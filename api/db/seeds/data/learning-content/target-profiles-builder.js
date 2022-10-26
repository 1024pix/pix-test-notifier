const { createTargetProfile, createBadge, createStages } = require('./tooling');
const { PRO_COMPANY_ID } = require('../organizations-pro-builder');

async function richTargetProfilesBuilder({ databaseBuilder }) {
  let configTargetProfile = {
    frameworks: [{
      chooseCoreFramework: true,
      countTubes: 30,
      minLevel: 3,
      maxLevel: 5,
    }],
  };
  const configBadge = {
    criteria: [
      {
        scope: 'CappedTubes',
        threshold: 60,
      },
      {
        scope: 'CampaignParticipation',
        threshold: 50,
      },
    ],
  };
  const { targetProfileId, cappedTubesDTO } = await createTargetProfile({
    databaseBuilder,
    targetProfileId: 500,
    name: 'Profil cible Pur Pix (Niv3 ~ 5)',
    isPublic: true,
    ownerOrganizationId: PRO_COMPANY_ID,
    isSimplifiedAccess: false,
    description: 'Profil cible pur pix (Niv3 ~ 5) avec 1 RT double critère (tube et participation)',
    configTargetProfile,
  });
  createBadge({
    databaseBuilder,
    targetProfileId,
    cappedTubesDTO,
    badgeId: 600,
    altMessage: '1 RT double critère Campaign & Tubes',
    imageUrl: 'some_image.svg',
    message: '1 RT double critère Campaign & Tubes',
    title: '1 RT double critère Campaign & Tubes',
    key: 'SOME_KEY_FOR_RT_600',
    isCertifiable: false,
    isAlwaysVisible: false,
    configBadge,
  });
  createStages({
    databaseBuilder,
    targetProfileId,
    cappedTubesDTO,
    type: 'LEVEL',
    countStages: 3,
  });
  configTargetProfile = {
    frameworks: [{
      chooseCoreFramework: true,
      countTubes: 5,
      minLevel: 1,
      maxLevel: 8,
    }, {
      chooseCoreFramework: false,
      countTubes: 3,
      minLevel: 1,
      maxLevel: 8,
    }],
  };
  await createTargetProfile({
    databaseBuilder,
    targetProfileId: 501,
    name: 'Profil cible Pix et un autre réf (Niv1 ~ 8)',
    isPublic: true,
    ownerOrganizationId: PRO_COMPANY_ID,
    isSimplifiedAccess: false,
    description: 'Profil cible pur pix et un autre réf (Niv1 ~ 8)',
    configTargetProfile,
  });
}

module.exports = {
  richTargetProfilesBuilder,
};
