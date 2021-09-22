import { module, test } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import clickByLabel from '../helpers/extended-ember-test-helpers/click-by-label';
import { setupApplicationTest } from 'ember-qunit';
import authenticateSession from '../helpers/authenticate-session';
import { createUserWithMembershipAndTermsOfServiceAccepted, createPrescriberByUser } from '../helpers/test-init';

import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';

module('Acceptance | Campaign Activity', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);
  let campaignId;

  hooks.beforeEach(async () => {
    const user = createUserWithMembershipAndTermsOfServiceAccepted();
    createPrescriberByUser(user);
    campaignId = 1;
    server.create('campaign', 'ofTypeAssessment', { id: campaignId, participationsCount: 1 });
    const campaignAssessmentParticipationResult = server.create(
      'campaign-assessment-participation-result',
      'withCompetenceResults',
      { id: 1, campaignId }
    );
    server.create('campaign-assessment-participation', {
      id: 1,
      campaignId,
      campaignAssessmentParticipationResult,
      lastName: 'Bacri',
    });
    server.create('campaign-participant-activity', { id: 1, lastName: 'Bacri' });

    await authenticateSession(user.id);
  });

  module('When prescriber arrives on activity page', function () {
    module('When campaign is of type assessment', function () {
      test('it could click on user to go to details', async function (assert) {
        // when
        await visit('/campagnes/1');
        await clickByLabel('Bacri');

        // then
        assert.equal(currentURL(), '/campagnes/1/evaluations/1/resultats');
      });
    });

    module('When campaign is of type profiles collection', function (hooks) {
      hooks.beforeEach(async () => {
        campaignId = 2;
        server.create('campaign', 'ofTypeProfilesCollection', { id: campaignId, participationsCount: 1 });
        server.create('campaign-profile', { id: 1, campaignId, lastName: 'Bacri' });
        server.create('campaign-participant-activity', { id: 1, lastName: 'Bacri' });
      });

      test('it could click on profile to go to details', async function (assert) {
        // when
        await visit('/campagnes/2');
        await clickByLabel('Bacri');

        // then
        assert.equal(currentURL(), '/campagnes/2/profils/1');
      });
    });

    test('it could return on list of participants', async function (assert) {
      // when
      await visit('/campagnes/1/evaluations/1');
      await clickByLabel('Retour');

      // then
      assert.equal(currentURL(), '/campagnes/1');
    });
  });
});
