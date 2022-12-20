const DomainTransaction = require('../../infrastructure/DomainTransaction');

module.exports = async function anonymizeUser({
  updatedByUserId,
  userId,
  userRepository,
  authenticationMethodRepository,
  membershipRepository,
  certificationCenterMembershipRepository,
  refreshTokenService,
}) {
  const anonymizedUser = {
    firstName: `prenom_${userId}`,
    lastName: `nom_${userId}`,
    email: `email_${userId}@example.net`,
    username: null,
  };

  await DomainTransaction.execute(async (domainTransaction) => {
    await authenticationMethodRepository.removeAllAuthenticationMethodsByUserId({ userId, domainTransaction });
    await refreshTokenService.revokeRefreshTokensForUserId({ userId });
    await membershipRepository.disableMembershipsByUserId({ userId, updatedByUserId, domainTransaction });
    await certificationCenterMembershipRepository.disableMembershipsByUserId({
      updatedByUserId,
      userId,
      domainTransaction,
    });
    await userRepository.updateUserDetailsForAdministration({
      id: userId,
      userAttributes: anonymizedUser,
      domainTransaction,
    });
  });
  return userRepository.getUserDetailsForAdmin(userId);
};
