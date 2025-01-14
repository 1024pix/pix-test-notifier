const tokenService = require('../../domain/services/token-service.js');
const usecases = require('../../domain/usecases/index.js');

const campaignManagementSerializer = require('../../infrastructure/serializers/jsonapi/campaign-management-serializer.js');
const campaignReportSerializer = require('../../infrastructure/serializers/jsonapi/campaign-report-serializer.js');
const divisionSerializer = require('../../infrastructure/serializers/jsonapi/division-serializer.js');
const groupSerializer = require('../../infrastructure/serializers/jsonapi/group-serializer.js');
const membershipSerializer = require('../../infrastructure/serializers/jsonapi/membership-serializer.js');
const organizationSerializer = require('../../infrastructure/serializers/jsonapi/organization-serializer.js');
const organizationInvitationSerializer = require('../../infrastructure/serializers/jsonapi/organization-invitation-serializer.js');
const supOrganizationLearnerWarningSerializer = require('../../infrastructure/serializers/jsonapi/sup-organization-learner-warnings-serializer.js');
const targetProfileForSpecifierSerializer = require('../../infrastructure/serializers/jsonapi/campaign/target-profile-for-specifier-serializer.js');
const organizationMemberIdentitySerializer = require('../../infrastructure/serializers/jsonapi/organization-member-identity-serializer.js');
const organizationPlacesLotManagementSerializer = require('../../infrastructure/serializers/jsonapi/organization/organization-places-lot-management-serializer.js');
const organizationPlacesLotSerializer = require('../../infrastructure/serializers/jsonapi/organization/organization-places-lot-serializer.js');
const organizationPlacesCapacitySerializer = require('../../infrastructure/serializers/jsonapi/organization-places-capacity-serializer.js');
const organizationParticipantsSerializer = require('../../infrastructure/serializers/jsonapi/organization/organization-participants-serializer.js');
const scoOrganizationParticipantsSerializer = require('../../infrastructure/serializers/jsonapi/organization/sco-organization-participants-serializer.js');
const supOrganizationParticipantsSerializer = require('../../infrastructure/serializers/jsonapi/organization/sup-organization-participants-serializer.js');
const targetProfileSummaryForAdminSerializer = require('../../infrastructure/serializers/jsonapi/target-profile-summary-for-admin-serializer.js');

const SupOrganizationLearnerParser = require('../../infrastructure/serializers/csv/sup-organization-learner-parser.js');
const queryParamsUtils = require('../../infrastructure/utils/query-params-utils.js');
const {
  extractLocaleFromRequest,
  extractUserIdFromRequest,
} = require('../../infrastructure/utils/request-response-utils.js');
const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);
const certificationResultUtils = require('../../infrastructure/utils/csv/certification-results.js');
const certificationAttestationPdf = require('../../infrastructure/utils/pdf/certification-attestation-pdf.js');
const organizationForAdminSerializer = require('../../infrastructure/serializers/jsonapi/organization-for-admin-serializer.js');

const { mapCertificabilityByLabel } = require('./helpers.js');
const csvSerializer = require('../../infrastructure/serializers/csv/csv-serializer.js');

module.exports = {
  async create(request) {
    const superAdminUserId = extractUserIdFromRequest(request);
    const organization = organizationForAdminSerializer.deserialize(request.payload);

    organization.createdBy = +superAdminUserId;

    const createdOrganization = await usecases.createOrganization({ organization });
    const serializedOrganization = organizationForAdminSerializer.serialize(createdOrganization);

    return serializedOrganization;
  },

  async createInBatch(request, h) {
    const organizations = await csvSerializer.deserializeForOrganizationsImport(request.payload.path);

    const createdOrganizations = await usecases.createOrganizationsWithTagsAndTargetProfiles({ organizations });

    return h.response(organizationForAdminSerializer.serialize(createdOrganizations)).code(204);
  },

  async findPaginatedFilteredOrganizations(
    request,
    h,
    dependencies = {
      organizationSerializer,
      queryParamsUtils,
    }
  ) {
    const options = dependencies.queryParamsUtils.extractParameters(request.query);

    const { models: organizations, pagination } = await usecases.findPaginatedFilteredOrganizations({
      filter: options.filter,
      page: options.page,
    });
    return dependencies.organizationSerializer.serialize(organizations, pagination);
  },

  async findPaginatedFilteredCampaigns(
    request,
    h,
    dependencies = {
      queryParamsUtils,
      campaignReportSerializer,
    }
  ) {
    const organizationId = request.params.id;
    const options = dependencies.queryParamsUtils.extractParameters(request.query);
    const userId = request.auth.credentials.userId;

    if (options.filter.status === 'archived') {
      options.filter.ongoing = false;
      delete options.filter.status;
    }
    const { models: campaigns, meta } = await usecases.findPaginatedFilteredOrganizationCampaigns({
      organizationId,
      filter: options.filter,
      page: options.page,
      userId,
    });
    return dependencies.campaignReportSerializer.serialize(campaigns, meta);
  },

  async findPaginatedCampaignManagements(
    request,
    h,
    dependencies = {
      queryParamsUtils,
      campaignManagementSerializer,
    }
  ) {
    const organizationId = request.params.id;
    const { filter, page } = dependencies.queryParamsUtils.extractParameters(request.query);

    const { models: campaigns, meta } = await usecases.findPaginatedCampaignManagements({
      organizationId,
      filter,
      page,
    });
    return dependencies.campaignManagementSerializer.serialize(campaigns, meta);
  },

  async findPaginatedFilteredMembershipsForAdmin(request) {
    const organizationId = request.params.id;
    const options = queryParamsUtils.extractParameters(request.query);

    const { models: memberships, pagination } = await usecases.findPaginatedFilteredOrganizationMemberships({
      organizationId,
      filter: options.filter,
      page: options.page,
    });
    return membershipSerializer.serializeForAdmin(memberships, pagination);
  },

  async findPaginatedFilteredMemberships(request) {
    const organizationId = request.params.id;
    const options = queryParamsUtils.extractParameters(request.query);

    const { models: memberships, pagination } = await usecases.findPaginatedFilteredOrganizationMemberships({
      organizationId,
      filter: options.filter,
      page: options.page,
    });
    return membershipSerializer.serialize(memberships, pagination);
  },

  async getOrganizationMemberIdentities(request, h, dependencies = { organizationMemberIdentitySerializer }) {
    const organizationId = request.params.id;
    const members = await usecases.getOrganizationMemberIdentities({ organizationId });
    return dependencies.organizationMemberIdentitySerializer.serialize(members);
  },

  async getOrganizationPlacesCapacity(request) {
    const organizationId = request.params.id;
    const organizationPlacesCapacity = await usecases.getOrganizationPlacesCapacity({ organizationId });
    return organizationPlacesCapacitySerializer.serialize(organizationPlacesCapacity);
  },

  async findOrganizationPlacesLot(request, h, dependencies = { organizationPlacesLotManagementSerializer }) {
    const organizationId = request.params.id;
    const places = await usecases.findOrganizationPlacesLot({ organizationId });
    return dependencies.organizationPlacesLotManagementSerializer.serialize(places);
  },

  async deleteOrganizationPlacesLot(request, h) {
    const organizationPlaceId = request.params.placeId;
    const userId = request.auth.credentials.userId;

    await usecases.deleteOrganizationPlaceLot({ organizationPlaceId, userId });

    return h.response(null).code(204);
  },

  async createOrganizationPlacesLot(
    request,
    h,
    dependencies = {
      organizationPlacesLotSerializer,
      organizationPlacesLotManagementSerializer,
    }
  ) {
    const organizationId = request.params.id;
    const createdBy = request.auth.credentials.userId;
    const organizationPlacesLotData = await dependencies.organizationPlacesLotSerializer.deserialize(request.payload);
    const organizationPlacesLot = await usecases.createOrganizationPlacesLot({
      organizationPlacesLotData,
      organizationId,
      createdBy,
    });
    return h
      .response(dependencies.organizationPlacesLotManagementSerializer.serialize(organizationPlacesLot))
      .code(201);
  },

  async downloadCertificationAttestationsForDivision(request, h, dependencies = { certificationAttestationPdf }) {
    const organizationId = request.params.id;
    const { division, isFrenchDomainExtension } = request.query;

    const attestations = await usecases.findCertificationAttestationsForDivision({
      organizationId,
      division,
    });

    const { buffer } = await dependencies.certificationAttestationPdf.getCertificationAttestationsPdfBuffer({
      certificates: attestations,
      isFrenchDomainExtension,
    });

    const now = dayjs();
    const fileName = `${now.format('YYYYMMDD')}_attestations_${division}.pdf`;

    return h
      .response(buffer)
      .header('Content-Disposition', `attachment; filename=${fileName}`)
      .header('Content-Type', 'application/pdf');
  },

  async downloadCertificationResults(request, h, dependencies = { certificationResultUtils }) {
    const organizationId = request.params.id;
    const { division } = request.query;

    const certificationResults = await usecases.getScoCertificationResultsByDivision({ organizationId, division });

    const csvResult = await dependencies.certificationResultUtils.getDivisionCertificationResultsCsv({
      certificationResults,
    });

    const now = dayjs();
    const fileName = `${now.format('YYYYMMDD')}_resultats_${division}.csv`;

    return h
      .response(csvResult)
      .header('Content-Type', 'text/csv;charset=utf-8')
      .header('Content-Disposition', `attachment; filename="${fileName}"`);
  },

  async findTargetProfiles(request, h, dependencies = { targetProfileForSpecifierSerializer }) {
    const organizationId = request.params.id;
    const targetProfiles = await usecases.getAvailableTargetProfilesForOrganization({ organizationId });
    return dependencies.targetProfileForSpecifierSerializer.serialize(targetProfiles);
  },

  async attachTargetProfiles(request, h) {
    const targetProfileIds = request.payload['target-profile-ids'];
    const organizationId = request.params.id;
    await usecases.attachTargetProfilesToOrganization({ organizationId, targetProfileIds });

    return h.response({}).code(204);
  },

  async getDivisions(request) {
    const organizationId = request.params.id;
    const divisions = await usecases.findDivisionsByOrganization({ organizationId });
    return divisionSerializer.serialize(divisions);
  },

  async getGroups(request) {
    const organizationId = request.params.id;
    const groups = await usecases.findGroupsByOrganization({ organizationId });
    return groupSerializer.serialize(groups);
  },

  async findPaginatedFilteredScoParticipants(
    request,
    h,
    dependencies = {
      queryParamsUtils,
      scoOrganizationParticipantsSerializer,
    }
  ) {
    const organizationId = request.params.id;
    const { filter, page, sort } = dependencies.queryParamsUtils.extractParameters(request.query);
    if (filter.divisions && !Array.isArray(filter.divisions)) {
      filter.divisions = [filter.divisions];
    }
    if (filter.connectionTypes && !Array.isArray(filter.connectionTypes)) {
      filter.connectionTypes = [filter.connectionTypes];
    }
    if (filter.certificability) {
      filter.certificability = mapCertificabilityByLabel(filter.certificability);
    }
    const { data: scoOrganizationParticipants, meta } = await usecases.findPaginatedFilteredScoParticipants({
      organizationId,
      filter,
      page,
      sort,
    });
    return dependencies.scoOrganizationParticipantsSerializer.serialize({
      scoOrganizationParticipants,
      meta,
    });
  },

  async findPaginatedFilteredSupParticipants(
    request,
    h,
    dependencies = {
      queryParamsUtils,
      supOrganizationParticipantsSerializer,
    }
  ) {
    const organizationId = request.params.id;
    const { filter, page, sort } = dependencies.queryParamsUtils.extractParameters(request.query);
    if (filter.groups && !Array.isArray(filter.groups)) {
      filter.groups = [filter.groups];
    }

    if (filter.certificability) {
      filter.certificability = mapCertificabilityByLabel(filter.certificability);
    }

    const { data: supOrganizationParticipants, meta } = await usecases.findPaginatedFilteredSupParticipants({
      organizationId,
      filter,
      page,
      sort,
    });
    return dependencies.supOrganizationParticipantsSerializer.serialize({ supOrganizationParticipants, meta });
  },

  async importOrganizationLearnersFromSIECLE(request, h) {
    const organizationId = request.params.id;
    const { format } = request.query;

    await usecases.importOrganizationLearnersFromSIECLEFormat({
      organizationId,
      payload: request.payload,
      format,
      i18n: request.i18n,
    });

    return h.response(null).code(204);
  },

  async importSupOrganizationLearners(request, h) {
    const organizationId = request.params.id;
    const buffer = request.payload;
    const supOrganizationLearnerParser = new SupOrganizationLearnerParser(buffer, organizationId, request.i18n);
    const warnings = await usecases.importSupOrganizationLearners({ supOrganizationLearnerParser });

    return h.response(supOrganizationLearnerWarningSerializer.serialize({ id: organizationId, warnings })).code(200);
  },

  async replaceSupOrganizationLearners(request, h) {
    const organizationId = request.params.id;
    const buffer = request.payload;
    const supOrganizationLearnerParser = new SupOrganizationLearnerParser(buffer, organizationId, request.i18n);
    const warnings = await usecases.replaceSupOrganizationLearners({
      organizationId,
      supOrganizationLearnerParser,
    });

    return h.response(supOrganizationLearnerWarningSerializer.serialize({ id: organizationId, warnings })).code(200);
  },

  async sendInvitations(request, h) {
    const organizationId = request.params.id;
    const emails = request.payload.data.attributes.email.split(',');
    const locale = extractLocaleFromRequest(request);

    const organizationInvitations = await usecases.createOrganizationInvitations({ organizationId, emails, locale });
    return h.response(organizationInvitationSerializer.serialize(organizationInvitations)).created();
  },

  async resendInvitation(request, h) {
    const organizationId = request.params.id;
    const email = request.payload.data.attributes.email;
    const locale = extractLocaleFromRequest(request);

    const organizationInvitation = await usecases.resendOrganizationInvitation({
      organizationId,
      email,
      locale,
    });
    return h.response(organizationInvitationSerializer.serialize(organizationInvitation));
  },

  async cancelOrganizationInvitation(request, h) {
    const organizationInvitationId = request.params.organizationInvitationId;
    await usecases.cancelOrganizationInvitation({ organizationInvitationId });
    return h.response().code(204);
  },

  async sendInvitationByLangAndRole(request, h, dependencies = { organizationInvitationSerializer }) {
    const organizationId = request.params.id;
    const invitationInformation =
      await dependencies.organizationInvitationSerializer.deserializeForCreateOrganizationInvitationAndSendEmail(
        request.payload
      );

    const organizationInvitation = await usecases.createOrganizationInvitationByAdmin({
      organizationId,
      email: invitationInformation.email,
      locale: invitationInformation.lang,
      role: invitationInformation.role,
    });
    return h.response(dependencies.organizationInvitationSerializer.serialize(organizationInvitation)).created();
  },

  findPendingInvitations(request, h, dependencies = { organizationInvitationSerializer }) {
    const organizationId = request.params.id;

    return usecases
      .findPendingOrganizationInvitations({ organizationId })
      .then((invitations) => dependencies.organizationInvitationSerializer.serialize(invitations));
  },

  async getOrganizationLearnersCsvTemplate(request, h, dependencies = { tokenService }) {
    const organizationId = request.params.id;
    const token = request.query.accessToken;
    const userId = dependencies.tokenService.extractUserId(token);
    const template = await usecases.getOrganizationLearnersCsvTemplate({
      userId,
      organizationId,
      i18n: request.i18n,
    });

    return h
      .response(template)
      .header('Content-Type', 'text/csv;charset=utf-8')
      .header('Content-Disposition', `attachment; filename=${request.i18n.__('csv-template.template-name')}.csv`);
  },

  async archiveOrganization(request, h, dependencies = { organizationForAdminSerializer }) {
    const organizationId = request.params.id;
    const userId = extractUserIdFromRequest(request);
    const archivedOrganization = await usecases.archiveOrganization({ organizationId, userId });
    return dependencies.organizationForAdminSerializer.serialize(archivedOrganization);
  },

  async getPaginatedParticipantsForAnOrganization(
    request,
    h,
    dependencies = {
      queryParamsUtils,
      organizationParticipantsSerializer,
    }
  ) {
    const organizationId = request.params.id;
    const { page, filter: filters, sort } = dependencies.queryParamsUtils.extractParameters(request.query);

    if (filters.certificability) {
      filters.certificability = mapCertificabilityByLabel(filters.certificability);
    }

    const results = await usecases.getPaginatedParticipantsForAnOrganization({
      organizationId,
      page,
      filters,
      sort,
    });

    return dependencies.organizationParticipantsSerializer.serialize(results);
  },

  async findTargetProfileSummariesForAdmin(request) {
    const organizationId = request.params.id;
    const targetProfileSummaries = await usecases.findOrganizationTargetProfileSummariesForAdmin({
      organizationId,
    });
    return targetProfileSummaryForAdminSerializer.serialize(targetProfileSummaries);
  },
};
