const _ = require('lodash');
const BookshelfTargetProfile = require('../orm-models/TargetProfile.js');
const targetProfileAdapter = require('../adapters/target-profile-adapter.js');
const bookshelfToDomainConverter = require('../utils/bookshelf-to-domain-converter.js');
const { knex } = require('../../../db/knex-database-connection.js');
const { NotFoundError, ObjectValidationError, InvalidSkillSetError } = require('../../domain/errors.js');
const DomainTransaction = require('../../infrastructure/DomainTransaction.js');
const TargetProfile = require('../../domain/models/TargetProfile.js');

const TARGET_PROFILE_TABLE = 'target-profiles';

module.exports = {
  async create({ targetProfileForCreation, domainTransaction }) {
    const knexConn = domainTransaction.knexTransaction;
    const targetProfileRawData = _.pick(targetProfileForCreation, [
      'name',
      'category',
      'description',
      'comment',
      'isPublic',
      'imageUrl',
      'ownerOrganizationId',
    ]);
    const [{ id: targetProfileId }] = await knexConn(TARGET_PROFILE_TABLE).insert(targetProfileRawData).returning('id');

    const tubesData = targetProfileForCreation.tubes.map((tube) => ({
      targetProfileId,
      tubeId: tube.id,
      level: tube.level,
    }));
    await knexConn.batchInsert('target-profile_tubes', tubesData);

    return targetProfileId;
  },

  async get(id, domainTransaction = DomainTransaction.emptyTransaction()) {
    const bookshelfTargetProfile = await BookshelfTargetProfile.where({ id }).fetch({
      require: false,
      transacting: domainTransaction.knexTransaction,
    });

    if (!bookshelfTargetProfile) {
      throw new NotFoundError(`Le profil cible avec l'id ${id} n'existe pas`);
    }

    return targetProfileAdapter.fromDatasourceObjects({
      bookshelfTargetProfile,
    });
  },

  async getByCampaignId(campaignId) {
    const bookshelfTargetProfile = await BookshelfTargetProfile.query((qb) => {
      qb.innerJoin('campaigns', 'campaigns.targetProfileId', 'target-profiles.id');
    })
      .where({ 'campaigns.id': campaignId })
      .fetch({
        withRelated: ['badges'],
      });
    return targetProfileAdapter.fromDatasourceObjects({
      bookshelfTargetProfile,
    });
  },

  async findByIds(targetProfileIds) {
    const targetProfilesBookshelf = await BookshelfTargetProfile.query((qb) => {
      qb.whereIn('id', targetProfileIds);
    }).fetchAll();

    return bookshelfToDomainConverter.buildDomainObjects(BookshelfTargetProfile, targetProfilesBookshelf);
  },

  async update(targetProfile) {
    let results;
    const editedAttributes = _.pick(targetProfile, [
      'name',
      'outdated',
      'description',
      'comment',
      'isSimplifiedAccess',
    ]);

    try {
      results = await knex(TARGET_PROFILE_TABLE)
        .where({ id: targetProfile.id })
        .update(editedAttributes)
        .returning(['id', 'isSimplifiedAccess']);
    } catch (error) {
      throw new ObjectValidationError();
    }

    if (!results.length) {
      throw new NotFoundError(`Le profil cible avec l'id ${targetProfile.id} n'existe pas`);
    }

    return new TargetProfile(results[0]);
  },

  async findOrganizationIds(targetProfileId) {
    const targetProfile = await knex(TARGET_PROFILE_TABLE).select('id').where({ id: targetProfileId }).first();
    if (!targetProfile) {
      throw new NotFoundError(`No target profile for ID ${targetProfileId}`);
    }

    const targetProfileShares = await knex('target-profile-shares')
      .select('organizationId')
      .where({ 'target-profile-shares.targetProfileId': targetProfileId });
    return targetProfileShares.map((targetProfileShare) => targetProfileShare.organizationId);
  },

  // TODO remove me with badge skill set
  async hasSkills({ targetProfileId, skillIds }, { knexTransaction } = DomainTransaction.emptyTransaction()) {
    const result = await (knexTransaction ?? knex)('target-profiles_skills')
      .select('skillId')
      .whereIn('skillId', skillIds)
      .andWhere('targetProfileId', targetProfileId);

    const unknownSkillIds = _.difference(skillIds, _.map(result, 'skillId'));
    if (unknownSkillIds.length) {
      throw new InvalidSkillSetError(`Les acquis suivants ne font pas partie du profil cible : ${unknownSkillIds}`);
    }

    return true;
  },

  async hasTubesWithLevels(
    { targetProfileId, tubesWithLevels },
    { knexTransaction } = DomainTransaction.emptyTransaction()
  ) {
    const tubeIds = tubesWithLevels.map(({ id }) => id);

    const result = await (knexTransaction ?? knex)('target-profile_tubes')
      .whereIn('tubeId', tubeIds)
      .andWhere('targetProfileId', targetProfileId);

    for (const tubeWithLevel of tubesWithLevels) {
      const targetProfileTube = result.find(({ tubeId }) => tubeId === tubeWithLevel.id);
      if (!targetProfileTube) {
        throw new ObjectValidationError(`Le sujet ${tubeWithLevel.id} ne fait pas partie du profil cible`);
      }

      if (tubeWithLevel.level > targetProfileTube.level) {
        throw new ObjectValidationError(
          `Le niveau ${tubeWithLevel.level} dépasse le niveau max du sujet ${tubeWithLevel.id}`
        );
      }
    }
  },
};
