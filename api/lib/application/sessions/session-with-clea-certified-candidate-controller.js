const usecases = require('../../domain/usecases/index.js');
const certificationResultUtils = require('../../infrastructure/utils/csv/certification-results.js');
const dayjs = require('dayjs');

module.exports = {
  async getCleaCertifiedCandidateDataCsv(request, h, dependencies = { certificationResultUtils }) {
    const sessionId = request.params.id;
    const { session, cleaCertifiedCandidateData } = await usecases.getCleaCertifiedCandidateBySession({ sessionId });
    const csvResult = await dependencies.certificationResultUtils.getCleaCertifiedCandidateCsv(
      cleaCertifiedCandidateData
    );

    const dateWithTime = dayjs(session.date + ' ' + session.time)
      .locale('fr')
      .format('YYYYMMDD_HHmm');
    const fileName = `${dateWithTime}_candidats_certifies_clea_${sessionId}.csv`;

    return h
      .response(csvResult)
      .header('Content-Type', 'text/csv;charset=utf-8')
      .header('Content-Disposition', `attachment; filename=${fileName}`);
  },
};
