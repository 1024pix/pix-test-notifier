const { domainBuilder, sinon, hFake, expect } = require('../../../test-helper');
const usecases = require('../../../../lib/domain/usecases/index.js');
const sessionWithCleaCertifiedCandidateController = require('../../../../lib/application/sessions/session-with-clea-certified-candidate-controller');

describe('Unit | Controller | session-with-clea-certified-candidate', function () {
  describe('#getCleaCertifiedCandidateDataCsv', function () {
    it('should return a response with CSV results', async function () {
      // given
      const request = {
        params: {
          id: 1,
        },
      };
      const session = domainBuilder.buildSession({ id: 1, date: '2021-01-01', time: '14:30' });
      const cleaCertifiedCandidates = [
        domainBuilder.buildCleaCertifiedCandidate({ createdAt: new Date('2021-01-01') }),
      ];

      sinon
        .stub(usecases, 'getCleaCertifiedCandidateBySession')
        .withArgs({ sessionId: 1 })
        .resolves({ session, cleaCertifiedCandidateData: cleaCertifiedCandidates });

      const certificationResultUtils = {
        getCleaCertifiedCandidateCsv: sinon.stub(),
      };
      certificationResultUtils.getCleaCertifiedCandidateCsv.withArgs(cleaCertifiedCandidates).resolves('csv-string');

      // when
      const response = await sessionWithCleaCertifiedCandidateController.getCleaCertifiedCandidateDataCsv(
        request,
        hFake,
        { certificationResultUtils }
      );

      // then
      expect(response.source).to.equal('csv-string');
      expect(response.headers['Content-Type']).to.equal('text/csv;charset=utf-8');
      expect(response.headers['Content-Disposition']).to.equal(
        'attachment; filename=20210101_1430_candidats_certifies_clea_1.csv'
      );
    });
  });
});
