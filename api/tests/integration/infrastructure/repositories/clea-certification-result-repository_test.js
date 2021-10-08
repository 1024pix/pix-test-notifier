const { expect, databaseBuilder, domainBuilder } = require('../../../test-helper');
const cleaCertificationResultRepository = require('../../../../lib/infrastructure/repositories/clea-certification-result-repository');
const CleaCertificationResult = require('../../../../lib/domain/models/CleaCertificationResult');

describe('Integration | Infrastructure | Repositories | clea-certification-result-repository', function () {
  describe('#get', function () {
    context('when there is no clea certification result for a given certification id', function () {
      it('should return a not_taken result', async function () {
        // given
        const certificationCourseId = databaseBuilder.factory.buildCertificationCourse().id;
        await databaseBuilder.commit();

        // when
        const cleaCertificationResult = await cleaCertificationResultRepository.get({ certificationCourseId });

        // then
        const expectedCleaCertificationResult = domainBuilder.buildCleaCertificationResult.notTaken();
        expect(cleaCertificationResult).to.be.instanceOf(CleaCertificationResult);
        expect(cleaCertificationResult).to.deep.equal(expectedCleaCertificationResult);
      });
    });

    context('when there is a acquired clea certification result for a given certification id', function () {
      context('V1', function () {
        it('should return a acquired result', async function () {
          // given
          databaseBuilder.factory.buildBadge({ key: CleaCertificationResult.badgeKeyV1 });
          const certificationCourseId = databaseBuilder.factory.buildCertificationCourse().id;
          databaseBuilder.factory.buildPartnerCertification({
            certificationCourseId,
            partnerKey: CleaCertificationResult.badgeKeyV1,
            acquired: true,
          });
          await databaseBuilder.commit();

          // when
          const cleaCertificationResult = await cleaCertificationResultRepository.get({ certificationCourseId });

          // then
          const expectedCleaCertificationResult = domainBuilder.buildCleaCertificationResult.acquired();
          expect(cleaCertificationResult).to.be.instanceOf(CleaCertificationResult);
          expect(cleaCertificationResult).to.deep.equal(expectedCleaCertificationResult);
        });

        context('when there is a rejected clea certification result for a given certification id', function () {
          it('should return a rejected result', async function () {
            // given
            databaseBuilder.factory.buildBadge({ key: CleaCertificationResult.badgeKeyV1 });
            const certificationCourseId = databaseBuilder.factory.buildCertificationCourse().id;
            databaseBuilder.factory.buildPartnerCertification({
              certificationCourseId,
              partnerKey: CleaCertificationResult.badgeKeyV1,
              acquired: false,
            });
            await databaseBuilder.commit();

            // when
            const cleaCertificationResult = await cleaCertificationResultRepository.get({ certificationCourseId });

            // then
            const expectedCleaCertificationResult = domainBuilder.buildCleaCertificationResult.rejected();
            expect(cleaCertificationResult).to.be.instanceOf(CleaCertificationResult);
            expect(cleaCertificationResult).to.deep.equal(expectedCleaCertificationResult);
          });
        });
      });

      context('V2', function () {
        it('should return a acquired result', async function () {
          // given
          databaseBuilder.factory.buildBadge({ key: CleaCertificationResult.badgeKeyV2 });
          const certificationCourseId = databaseBuilder.factory.buildCertificationCourse().id;
          databaseBuilder.factory.buildPartnerCertification({
            certificationCourseId,
            partnerKey: CleaCertificationResult.badgeKeyV2,
            acquired: true,
          });
          await databaseBuilder.commit();

          // when
          const cleaCertificationResult = await cleaCertificationResultRepository.get({ certificationCourseId });

          // then
          const expectedCleaCertificationResult = domainBuilder.buildCleaCertificationResult.acquired();
          expect(cleaCertificationResult).to.be.instanceOf(CleaCertificationResult);
          expect(cleaCertificationResult).to.deep.equal(expectedCleaCertificationResult);
        });

        context('when there is a rejected clea certification result for a given certification id', function () {
          it('should return a rejected result', async function () {
            // given
            databaseBuilder.factory.buildBadge({ key: CleaCertificationResult.badgeKeyV2 });
            const certificationCourseId = databaseBuilder.factory.buildCertificationCourse().id;
            databaseBuilder.factory.buildPartnerCertification({
              certificationCourseId,
              partnerKey: CleaCertificationResult.badgeKeyV2,
              acquired: false,
            });
            await databaseBuilder.commit();

            // when
            const cleaCertificationResult = await cleaCertificationResultRepository.get({ certificationCourseId });

            // then
            const expectedCleaCertificationResult = domainBuilder.buildCleaCertificationResult.rejected();
            expect(cleaCertificationResult).to.be.instanceOf(CleaCertificationResult);
            expect(cleaCertificationResult).to.deep.equal(expectedCleaCertificationResult);
          });
        });
      });
    });
  });
});
