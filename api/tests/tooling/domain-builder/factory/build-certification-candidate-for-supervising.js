const CertificationCandidateForSupervising = require('../../../../lib/domain/models/CertificationCandidateForSupervising');

module.exports = function buildCertificationCandidateForSupervising({
  id = 123,
  firstName = 'Monkey',
  lastName = 'D Luffy',
  birthdate = '1997-07-22',
  extraTimePercentage = 0.3,
  authorizedToStart = false,
  assessmentStatus = null,
  startDateTime = new Date('2022-10-01T12:00:00Z'),
  complementaryCertification,
} = {}) {
  return new CertificationCandidateForSupervising({
    id,
    firstName,
    lastName,
    birthdate,
    extraTimePercentage,
    authorizedToStart,
    assessmentStatus,
    startDateTime,
    complementaryCertification,
  });
};
