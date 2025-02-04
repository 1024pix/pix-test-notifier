const bluebird = require('bluebird');

const { OrganizationArchivedError } = require('../errors.js');

module.exports = async function createOrganizationInvitations({
  organizationId,
  emails,
  locale,
  organizationRepository,
  organizationInvitationRepository,
  organizationInvitationService,
}) {
  const organization = await organizationRepository.get(organizationId);

  if (organization.archivedAt) {
    throw new OrganizationArchivedError();
  }

  const trimmedEmails = emails.map((email) => email.trim());
  const uniqueEmails = [...new Set(trimmedEmails)];

  return bluebird.mapSeries(uniqueEmails, (email) => {
    return organizationInvitationService.createOrUpdateOrganizationInvitation({
      organizationRepository,
      organizationInvitationRepository,
      organizationId,
      email,
      locale,
    });
  });
};
