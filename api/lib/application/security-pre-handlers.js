/* eslint-disable  no-restricted-syntax */
const bluebird = require('bluebird');
const checkIfUserIsBlockedUseCase = require('./usecases/checkIfUserIsBlocked.js');
const checkAdminMemberHasRoleSuperAdminUseCase = require('./usecases/checkAdminMemberHasRoleSuperAdmin.js');
const checkAdminMemberHasRoleCertifUseCase = require('./usecases/checkAdminMemberHasRoleCertif.js');
const checkAdminMemberHasRoleSupportUseCase = require('./usecases/checkAdminMemberHasRoleSupport.js');
const checkAdminMemberHasRoleMetierUseCase = require('./usecases/checkAdminMemberHasRoleMetier.js');
const checkUserIsAdminInOrganizationUseCase = require('./usecases/checkUserIsAdminInOrganization.js');
const checkUserBelongsToOrganizationManagingStudentsUseCase = require('./usecases/checkUserBelongsToOrganizationManagingStudents.js');
const checkUserBelongsToLearnersOrganizationUseCase = require('./usecases/checkUserBelongsToLearnersOrganization.js');
const checkUserBelongsToScoOrganizationAndManagesStudentsUseCase = require('./usecases/checkUserBelongsToScoOrganizationAndManagesStudents.js');
const checkUserBelongsToSupOrganizationAndManagesStudentsUseCase = require('./usecases/checkUserBelongsToSupOrganizationAndManagesStudents.js');
const checkUserOwnsCertificationCourseUseCase = require('./usecases/checkUserOwnsCertificationCourse.js');
const checkUserBelongsToOrganizationUseCase = require('./usecases/checkUserBelongsToOrganization.js');
const checkUserIsAdminAndManagingStudentsForOrganization = require('./usecases/checkUserIsAdminAndManagingStudentsForOrganization.js');
const checkUserIsMemberOfAnOrganizationUseCase = require('./usecases/checkUserIsMemberOfAnOrganization.js');
const checkUserIsMemberOfCertificationCenterUsecase = require('./usecases/checkUserIsMemberOfCertificationCenter.js');
const checkUserIsMemberOfCertificationCenterSessionUsecase = require('./usecases/checkUserIsMemberOfCertificationCenterSession.js');
const checkAuthorizationToManageCampaignUsecase = require('./usecases/checkAuthorizationToManageCampaign.js');
const checkOrganizationIsScoAndManagingStudentUsecase = require('./usecases/checkOrganizationIsScoAndManagingStudent');
const checkPix1dEnabled = require('./usecases/checkPix1dEnabled.js');
const certificationIssueReportRepository = require('../infrastructure/repositories/certification-issue-report-repository.js');
const organizationRepository = require('../infrastructure/repositories/organization-repository');
const Organization = require('../../lib/domain/models/Organization.js');
const { ForbiddenAccess, NotFoundError } = require('../..//lib/domain/errors.js');
const apps = require('../..//lib/domain/constants.js');

const JSONAPIError = require('jsonapi-serializer').Error;
const has = require('lodash/has');

function _replyForbiddenError(h) {
  const errorHttpStatusCode = 403;

  const jsonApiError = new JSONAPIError({
    code: errorHttpStatusCode,
    title: 'Forbidden access',
    detail: 'Missing or insufficient permissions.',
  });

  return h.response(jsonApiError).code(errorHttpStatusCode).takeover();
}

async function checkIfUserIsBlocked(
  request,
  h,
  dependencies = {
    checkIfUserIsBlockedUseCase,
  }
) {
  const { username, grant_type: grantType } = request.payload;

  if (grantType === 'password') {
    await dependencies.checkIfUserIsBlockedUseCase.execute(username);
  }

  return h.response(true);
}

async function checkAdminMemberHasRoleSuperAdmin(
  request,
  h,
  dependencies = {
    checkAdminMemberHasRoleSuperAdminUseCase,
  }
) {
  if (!request.auth.credentials || !request.auth.credentials.userId) {
    return _replyForbiddenError(h);
  }

  const userId = request.auth.credentials.userId;

  try {
    const hasRoleSuperAdmin = await dependencies.checkAdminMemberHasRoleSuperAdminUseCase.execute(userId);
    if (!hasRoleSuperAdmin) {
      throw new ForbiddenAccess(apps.PIX_ADMIN.NOT_ALLOWED_MSG);
    }
    return h.response(true);
  } catch (e) {
    return _replyForbiddenError(h);
  }
}

async function checkAdminMemberHasRoleCertif(request, h, dependencies = { checkAdminMemberHasRoleCertifUseCase }) {
  if (!request.auth.credentials || !request.auth.credentials.userId) {
    return _replyForbiddenError(h);
  }

  const userId = request.auth.credentials.userId;

  try {
    const hasRoleCertif = await dependencies.checkAdminMemberHasRoleCertifUseCase.execute(userId);
    if (!hasRoleCertif) {
      throw new ForbiddenAccess(apps.PIX_ADMIN.NOT_ALLOWED_MSG);
    }
    return h.response(true);
  } catch (e) {
    return _replyForbiddenError(h);
  }
}

async function checkAdminMemberHasRoleSupport(request, h, dependencies = { checkAdminMemberHasRoleSupportUseCase }) {
  if (!request.auth.credentials || !request.auth.credentials.userId) {
    return _replyForbiddenError(h);
  }

  const userId = request.auth.credentials.userId;

  try {
    const hasRoleSupport = await dependencies.checkAdminMemberHasRoleSupportUseCase.execute(userId);
    if (!hasRoleSupport) {
      throw new ForbiddenAccess(apps.PIX_ADMIN.NOT_ALLOWED_MSG);
    }
    return h.response(true);
  } catch (e) {
    return _replyForbiddenError(h);
  }
}

async function checkAdminMemberHasRoleMetier(request, h, dependencies = { checkAdminMemberHasRoleMetierUseCase }) {
  if (!request.auth.credentials || !request.auth.credentials.userId) {
    return _replyForbiddenError(h);
  }

  const userId = request.auth.credentials.userId;

  try {
    const hasRoleMetier = await dependencies.checkAdminMemberHasRoleMetierUseCase.execute(userId);
    if (!hasRoleMetier) {
      throw new ForbiddenAccess(apps.PIX_ADMIN.NOT_ALLOWED_MSG);
    }
    return h.response(true);
  } catch (e) {
    return _replyForbiddenError(h);
  }
}

function checkRequestedUserIsAuthenticatedUser(request, h) {
  if (!request.auth.credentials || !request.auth.credentials.userId) {
    return _replyForbiddenError(h);
  }

  const authenticatedUserId = request.auth.credentials.userId;
  const requestedUserId = parseInt(request.params.userId) || parseInt(request.params.id);

  return authenticatedUserId === requestedUserId ? h.response(true) : _replyForbiddenError(h);
}

function checkUserIsAdminInOrganization(request, h, dependencies = { checkUserIsAdminInOrganizationUseCase }) {
  if (!request.auth.credentials || !request.auth.credentials.userId) {
    return _replyForbiddenError(h);
  }

  const userId = request.auth.credentials.userId;

  //organizationId can be retrieved from path param in case organizations/id/invitations api or from memberships payload in case memberships/id
  const organizationId =
    request.path && request.path.includes('memberships')
      ? request.payload.data.relationships.organization.data.id
      : parseInt(request.params.id);

  return dependencies.checkUserIsAdminInOrganizationUseCase
    .execute(userId, organizationId)
    .then((isAdminInOrganization) => {
      if (isAdminInOrganization) {
        return h.response(true);
      }
      return _replyForbiddenError(h);
    })
    .catch(() => _replyForbiddenError(h));
}

function checkUserIsMemberOfCertificationCenter(
  request,
  h,
  dependencies = { checkUserIsMemberOfCertificationCenterUsecase }
) {
  if (!request.auth.credentials || !request.auth.credentials.userId) {
    return _replyForbiddenError(h);
  }

  const userId = request.auth.credentials.userId;
  const certificationCenterId = parseInt(request.params.certificationCenterId);

  return dependencies.checkUserIsMemberOfCertificationCenterUsecase
    .execute(userId, certificationCenterId)
    .then((isMemberInCertificationCenter) => {
      if (isMemberInCertificationCenter) {
        return h.response(true);
      }
      return _replyForbiddenError(h);
    })
    .catch(() => _replyForbiddenError(h));
}

async function checkUserIsMemberOfCertificationCenterSessionFromCertificationIssueReportId(
  request,
  h,
  dependencies = { checkUserIsMemberOfCertificationCenterSessionUsecase, certificationIssueReportRepository }
) {
  if (!request.auth.credentials || !request.auth.credentials.userId) {
    return _replyForbiddenError(h);
  }

  const userId = request.auth.credentials.userId;
  const certificationIssueReportId = parseInt(request.params.id);

  try {
    const certificationIssueReport = await dependencies.certificationIssueReportRepository.get(
      certificationIssueReportId
    );
    const isMemberOfSession = await dependencies.checkUserIsMemberOfCertificationCenterSessionUsecase.execute({
      userId,
      certificationCourseId: certificationIssueReport.certificationCourseId,
    });
    return isMemberOfSession ? h.response(true) : _replyForbiddenError(h);
  } catch (e) {
    return _replyForbiddenError(h);
  }
}

async function checkUserIsMemberOfCertificationCenterSessionFromCertificationCourseId(
  request,
  h,
  dependencies = {
    checkUserIsMemberOfCertificationCenterSessionUsecase,
  }
) {
  if (!request.auth.credentials || !request.auth.credentials.userId) {
    return _replyForbiddenError(h);
  }

  const userId = request.auth.credentials.userId;
  const certificationCourseId = parseInt(request.params.id);

  try {
    const isMemberOfSession = await dependencies.checkUserIsMemberOfCertificationCenterSessionUsecase.execute({
      userId,
      certificationCourseId,
    });
    return isMemberOfSession ? h.response(true) : _replyForbiddenError(h);
  } catch (e) {
    return _replyForbiddenError(h);
  }
}

async function checkUserBelongsToOrganizationManagingStudents(
  request,
  h,
  dependencies = { checkUserBelongsToOrganizationManagingStudentsUseCase }
) {
  if (!has(request, 'auth.credentials.userId')) {
    return _replyForbiddenError(h);
  }

  const userId = request.auth.credentials.userId;
  const organizationId = parseInt(request.params.id);

  try {
    if (await dependencies.checkUserBelongsToOrganizationManagingStudentsUseCase.execute(userId, organizationId)) {
      return h.response(true);
    }
  } catch (err) {
    return _replyForbiddenError(h);
  }
  return _replyForbiddenError(h);
}

async function checkUserBelongsToScoOrganizationAndManagesStudents(
  request,
  h,
  dependencies = { checkUserBelongsToScoOrganizationAndManagesStudentsUseCase }
) {
  if (!request.auth.credentials || !request.auth.credentials.userId) {
    return _replyForbiddenError(h);
  }

  const userId = request.auth.credentials.userId;
  const organizationId = parseInt(request.params.id) || parseInt(request.payload.data.attributes['organization-id']);

  let belongsToScoOrganizationAndManageStudents;
  try {
    belongsToScoOrganizationAndManageStudents =
      await dependencies.checkUserBelongsToScoOrganizationAndManagesStudentsUseCase.execute(userId, organizationId);
  } catch (err) {
    return _replyForbiddenError(h);
  }

  if (belongsToScoOrganizationAndManageStudents) {
    return h.response(true);
  }

  return _replyForbiddenError(h);
}

async function checkCertificationCenterIsNotScoManagingStudents(
  request,
  h,
  dependencies = {
    checkOrganizationIsScoAndManagingStudentUsecase,
    checkUserIsMemberOfCertificationCenterUsecase,
    organizationRepository,
  }
) {
  if (_noCredentials(request)) {
    return _replyForbiddenError(h);
  }

  const certificationCenterId =
    parseInt(request?.params?.certificationCenterId) ||
    parseInt(request?.payload?.data?.attributes?.certificationCenterId);

  let organizationId;

  try {
    organizationId = await dependencies.organizationRepository.getIdByCertificationCenterId(certificationCenterId);
  } catch (error) {
    if (_noOrganizationFound(error)) {
      return h.response(true);
    }
  }

  const isOrganizationScoManagingStudent = await dependencies.checkOrganizationIsScoAndManagingStudentUsecase.execute({
    organizationId,
  });

  if (isOrganizationScoManagingStudent) {
    return _replyForbiddenError(h);
  }

  return h.response(true);
}

function _noCredentials(request) {
  return !request?.auth?.credentials || !request.auth.credentials.userId;
}

async function checkUserBelongsToSupOrganizationAndManagesStudents(
  request,
  h,
  dependencies = { checkUserBelongsToSupOrganizationAndManagesStudentsUseCase }
) {
  if (!request.auth.credentials || !request.auth.credentials.userId) {
    return _replyForbiddenError(h);
  }

  const userId = request.auth.credentials.userId;
  const organizationId = parseInt(request.params.id) || parseInt(request.payload.data.attributes['organization-id']);

  let belongsToSupOrganizationAndManageStudents;
  try {
    belongsToSupOrganizationAndManageStudents =
      await dependencies.checkUserBelongsToSupOrganizationAndManagesStudentsUseCase.execute(userId, organizationId);
  } catch (err) {
    return _replyForbiddenError(h);
  }

  if (belongsToSupOrganizationAndManageStudents) {
    return h.response(true);
  }

  return _replyForbiddenError(h);
}

async function checkUserIsAdminInSCOOrganizationManagingStudents(
  request,
  h,
  dependencies = { checkUserIsAdminAndManagingStudentsForOrganization }
) {
  const userId = request.auth.credentials.userId;
  const organizationId = parseInt(request.params.id);

  if (
    await dependencies.checkUserIsAdminAndManagingStudentsForOrganization.execute(
      userId,
      organizationId,
      Organization.types.SCO
    )
  ) {
    return h.response(true);
  }
  return _replyForbiddenError(h);
}

async function checkUserIsAdminInSUPOrganizationManagingStudents(
  request,
  h,
  dependencies = { checkUserIsAdminAndManagingStudentsForOrganization }
) {
  const userId = request.auth.credentials.userId;
  const organizationId = parseInt(request.params.id);

  if (
    await dependencies.checkUserIsAdminAndManagingStudentsForOrganization.execute(
      userId,
      organizationId,
      Organization.types.SUP
    )
  ) {
    return h.response(true);
  }

  return _replyForbiddenError(h);
}

async function checkUserBelongsToLearnersOrganization(
  request,
  h,
  dependencies = { checkUserBelongsToLearnersOrganizationUseCase }
) {
  if (!request.auth.credentials) {
    return _replyForbiddenError(h);
  }

  const userId = request.auth.credentials.userId;
  const organizationLearnerId = parseInt(request.params.id);

  let belongsToLearnersOrganization;

  try {
    belongsToLearnersOrganization = await dependencies.checkUserBelongsToLearnersOrganizationUseCase.execute(
      userId,
      organizationLearnerId
    );
  } catch (e) {
    return _replyForbiddenError(h);
  }
  if (belongsToLearnersOrganization) {
    return h.response(true);
  }
  return _replyForbiddenError(h);
}

async function checkUserBelongsToOrganization(request, h, dependencies = { checkUserBelongsToOrganizationUseCase }) {
  if (!request.auth.credentials || !request.auth.credentials.userId) {
    return _replyForbiddenError(h);
  }

  const userId = request.auth.credentials.userId;
  const organizationId = parseInt(request.params.id);

  const belongsToOrganization = await dependencies.checkUserBelongsToOrganizationUseCase.execute(
    userId,
    organizationId
  );
  if (belongsToOrganization) {
    return h.response(true);
  }
  return _replyForbiddenError(h);
}

async function checkUserIsMemberOfAnOrganization(
  request,
  h,
  dependencies = { checkUserIsMemberOfAnOrganizationUseCase }
) {
  if (!request.auth.credentials || !request.auth.credentials.userId) {
    return _replyForbiddenError(h);
  }

  const userId = request.auth.credentials.userId;

  let isMemberOfAnOrganization;
  try {
    isMemberOfAnOrganization = await dependencies.checkUserIsMemberOfAnOrganizationUseCase.execute(userId);
  } catch (err) {
    return _replyForbiddenError(h);
  }

  if (isMemberOfAnOrganization) {
    return h.response(true);
  }
  return _replyForbiddenError(h);
}

async function checkAuthorizationToManageCampaign(
  request,
  h,
  dependencies = { checkAuthorizationToManageCampaignUsecase }
) {
  const userId = request.auth.credentials.userId;
  const campaignId = request.params.id;
  const isAdminOrOwnerOfTheCampaign = await dependencies.checkAuthorizationToManageCampaignUsecase.execute({
    userId,
    campaignId,
  });

  if (isAdminOrOwnerOfTheCampaign) return h.response(true);
  return _replyForbiddenError(h);
}

function adminMemberHasAtLeastOneAccessOf(securityChecks) {
  return async (request, h) => {
    const responses = await bluebird.map(securityChecks, (securityCheck) => securityCheck(request, h));
    const hasAccess = responses.some((response) => !response.source?.errors);
    return hasAccess ? hasAccess : _replyForbiddenError(h);
  };
}
async function checkPix1dActivated(request, h, dependencies = { checkPix1dEnabled }) {
  const isPix1dEnabled = await dependencies.checkPix1dEnabled.execute();

  if (isPix1dEnabled) return h.response(true);
  return _replyForbiddenError(h);
}

async function checkUserOwnsCertificationCourse(
  request,
  h,
  dependencies = { checkUserOwnsCertificationCourseUseCase }
) {
  if (!request.auth.credentials || !request.auth.credentials.userId) {
    return _replyForbiddenError(h);
  }

  const userId = request.auth.credentials.userId;
  const certificationCourseId = parseInt(request.params.id);

  try {
    const ownsCertificationCourse = await dependencies.checkUserOwnsCertificationCourseUseCase.execute({
      userId,
      certificationCourseId,
    });
    return ownsCertificationCourse ? h.response(true) : _replyForbiddenError(h);
  } catch (e) {
    return _replyForbiddenError(h);
  }
}

function _noOrganizationFound(error) {
  return error instanceof NotFoundError;
}

/* eslint-enable no-restricted-syntax */

module.exports = {
  checkIfUserIsBlocked,
  checkPix1dActivated,
  checkRequestedUserIsAuthenticatedUser,
  checkUserBelongsToOrganizationManagingStudents,
  checkUserBelongsToScoOrganizationAndManagesStudents,
  checkCertificationCenterIsNotScoManagingStudents,
  checkUserBelongsToSupOrganizationAndManagesStudents,
  checkAdminMemberHasRoleSuperAdmin,
  checkAdminMemberHasRoleCertif,
  checkAdminMemberHasRoleSupport,
  checkAdminMemberHasRoleMetier,
  checkUserIsAdminInOrganization,
  checkAuthorizationToManageCampaign,
  checkUserIsAdminInSCOOrganizationManagingStudents,
  checkUserIsAdminInSUPOrganizationManagingStudents,
  checkUserBelongsToLearnersOrganization: checkUserBelongsToLearnersOrganization,
  checkUserBelongsToOrganization,
  checkUserIsMemberOfAnOrganization,
  checkUserIsMemberOfCertificationCenter,
  checkUserOwnsCertificationCourse,
  checkUserIsMemberOfCertificationCenterSessionFromCertificationCourseId,
  checkUserIsMemberOfCertificationCenterSessionFromCertificationIssueReportId,
  adminMemberHasAtLeastOneAccessOf,
};
