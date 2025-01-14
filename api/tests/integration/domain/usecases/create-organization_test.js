const { expect, databaseBuilder, knex } = require('../../../test-helper');

const organizationForAdminRepository = require('../../../../lib/infrastructure/repositories/organization-for-admin-repository');
const dataProtectionOfficerRepository = require('../../../../lib/infrastructure/repositories/data-protection-officer-repository');
const organizationCreationValidator = require('../../../../lib/domain/validators/organization-creation-validator.js');
const OrganizationForAdmin = require('../../../../lib/domain/models/organizations-administration/Organization');

const createOrganization = require('../../../../lib/domain/usecases/create-organization');

describe('Integration | UseCases | create-organization', function () {
  afterEach(async function () {
    await knex('data-protection-officers').delete();
    await knex('organizations').delete();
  });

  it('returns newly created organization', async function () {
    // given
    const superAdminUserId = databaseBuilder.factory.buildUser().id;
    await databaseBuilder.commit();

    const organization = new OrganizationForAdmin({
      name: 'ACME',
      type: 'PRO',
      documentationUrl: 'https://pix.fr',
      createdBy: superAdminUserId,
    });

    // when
    const createdOrganization = await createOrganization({
      organization,
      dataProtectionOfficerRepository,
      organizationForAdminRepository,
      organizationCreationValidator,
    });

    // then
    expect(createdOrganization).to.be.instanceOf(OrganizationForAdmin);
    expect(createdOrganization.createdBy).to.be.equal(superAdminUserId);
    expect(createdOrganization.name).to.be.equal(organization.name);
    expect(createdOrganization.type).to.be.equal(organization.type);
    expect(createdOrganization.documentationUrl).to.be.equal(organization.documentationUrl);
    expect(createdOrganization.dataProtectionOfficerFirstName).to.be.null;
    expect(createdOrganization.dataProtectionOfficerLastName).to.be.null;
    expect(createdOrganization.dataProtectionOfficerEmail).to.be.null;
  });
});
