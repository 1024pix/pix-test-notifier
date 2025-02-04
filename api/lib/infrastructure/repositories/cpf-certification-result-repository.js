const { knex } = require('../../../db/knex-database-connection.js');
const CpfCertificationResult = require('../../domain/read-models/CpfCertificationResult.js');
const AssessmentResult = require('../../domain/models/AssessmentResult.js');
const { cpfImportStatus } = require('../../domain/models/CertificationCourse.js');

module.exports = {
  async countByTimeRange({ startDate, endDate }) {
    const query = _selectCpfCertificationResults();
    const { count } = await _filterQuery(query, startDate, endDate)
      .count('certification-courses.id')
      .whereNull('certification-courses.cpfImportStatus')
      .first();
    return count;
  },

  async findByBatchId(batchId) {
    const cpfCertificationResults = await _selectCpfCertificationResults()
      .select('certification-courses.*', 'assessment-results.pixScore', 'sessions.publishedAt')
      .select(
        knex.raw(`
        json_agg(json_build_object(
          'competenceCode', "competence-marks"."competence_code",
          'areaCode', "competence-marks"."area_code",
          'level', "competence-marks"."level"
        ) ORDER BY "competence-marks"."competence_code" asc) as "competenceMarks"`)
      )
      .innerJoin('competence-marks', 'competence-marks.assessmentResultId', 'assessment-results.id')
      .where('certification-courses.cpfFilename', batchId)
      .groupBy('certification-courses.id', 'assessment-results.pixScore', 'sessions.publishedAt');
    return cpfCertificationResults.map((certificationCourse) => new CpfCertificationResult(certificationCourse));
  },

  async markCertificationCoursesAsExported({ certificationCourseIds, filename }) {
    const now = new Date();

    return knex('certification-courses')
      .update({ cpfFilename: filename, cpfImportStatus: cpfImportStatus.READY_TO_SEND, updatedAt: now })
      .whereIn('id', certificationCourseIds);
  },

  async markCertificationToExport({ startDate, endDate, limit = 'ALL', offset = 0, batchId }) {
    const now = new Date();

    return knex
      .with('certification-courses-to-mark', (qb) => {
        const query = _selectCpfCertificationResults(qb);
        return _filterQuery(query, startDate, endDate)
          .select('certification-courses.id')
          .where((qb) => {
            qb.orWhereNull('certification-courses.cpfImportStatus');
            qb.orWhere('certification-courses.cpfImportStatus', cpfImportStatus.PENDING);
          })
          .orderBy('certification-courses.id')
          .offset(offset)
          .limit(limit);
      })
      .update({ cpfFilename: batchId, cpfImportStatus: cpfImportStatus.PENDING, updatedAt: now })
      .from('certification-courses')
      .whereIn('id', knex.select('id').from('certification-courses-to-mark'))
      .whereNull('certification-courses.cpfImportStatus');
  },

  async updateCertificationImportStatus({ certificationCourseIds, cpfImportStatus }) {
    const now = new Date();

    return knex('certification-courses')
      .update({ cpfImportStatus, updatedAt: now })
      .whereIn('id', certificationCourseIds);
  },
};

function _selectCpfCertificationResults(qb = knex) {
  return qb
    .from('certification-courses')
    .innerJoin('sessions', 'sessions.id', 'certification-courses.sessionId')
    .innerJoin(
      'certification-courses-last-assessment-results',
      'certification-courses.id',
      'certification-courses-last-assessment-results.certificationCourseId'
    )
    .leftJoin(
      'assessment-results',
      'assessment-results.id',
      'certification-courses-last-assessment-results.lastAssessmentResultId'
    );
}

function _filterQuery(qb = knex, startDate, endDate) {
  return qb
    .where('certification-courses.isPublished', true)
    .where('certification-courses.isCancelled', false)
    .whereNotNull('certification-courses.sex')
    .where('assessment-results.status', AssessmentResult.status.VALIDATED)
    .where('sessions.publishedAt', '>=', startDate)
    .where('sessions.publishedAt', '<=', endDate);
}
