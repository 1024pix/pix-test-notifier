import { module, test } from 'qunit';
import setupIntlRenderingTest from '../../../../helpers/setup-intl-rendering';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | Participant::Profile::Header', function (hooks) {
  setupIntlRenderingTest(hooks);

  test('it displays user information', async function (assert) {
    this.campaignProfile = {
      firstName: 'Godefroy',
      lastName: 'de Montmirail',
    };
    this.campaign = {};

    await render(hbs`<Participant::Profile::Header @campaignProfile={{campaignProfile}} @campaign={{campaign}} />`);

    assert.contains('Godefroy de Montmirail');
  });

  test('it displays campaign particiaption creation date', async function (assert) {
    this.campaignProfile = {
      createdAt: '2020-01-01',
    };
    this.campaign = {};

    await render(hbs`<Participant::Profile::Header @campaignProfile={{campaignProfile}} @campaign={{campaign}} />`);

    assert.contains('01 janv. 2020');
  });

  module('is shared', function () {
    module('when participant has shared results', function () {
      test('it displays the sharing date', async function (assert) {
        this.campaignProfile = {
          isShared: true,
          sharedAt: '2020-01-02',
        };
        this.campaign = {};

        await render(hbs`<Participant::Profile::Header @campaignProfile={{campaignProfile}} @campaign={{campaign}} />`);

        assert.contains('Envoyé le');
        assert.contains('02 janv. 2020');
      });
    });
    module('when participant has not shared results', function () {
      test('it does not displays the sharing date', async function (assert) {
        this.campaignProfile = {
          isShared: false,
        };

        this.campaign = {};

        await render(hbs`<Participant::Profile::Header @campaignProfile={{campaignProfile}} @campaign={{campaign}} />`);

        assert.notContains('Envoyé le');
      });
    });
  });

  module('identifiant', function () {
    module('when the external id is present', function () {
      test('it displays the external id', async function (assert) {
        this.campaignProfile = {
          externalId: 'i12345',
        };
        this.campaign = {};

        await render(hbs`<Participant::Profile::Header @campaignProfile={{campaignProfile}} @campaign={{campaign}} />`);

        assert.contains('i12345');
      });
    });
    module('when the external id is not present', function () {
      test('it does not display the external id', async function (assert) {
        this.campaignProfile = {
          externalId: null,
        };
        this.campaign = {};

        await render(hbs`<Participant::Profile::Header @campaignProfile={{campaignProfile}} @campaign={{campaign}} />`);

        assert.notContains('Identifiant');
      });
    });
  });

  module('certification info', function () {
    module('when the  profile is shared', function () {
      test('it displays the pix score', async function (assert) {
        this.campaignProfile = {
          pixScore: '124',
          isShared: true,
        };
        this.campaign = {};

        await render(hbs`<Participant::Profile::Header @campaignProfile={{campaignProfile}} @campaign={{campaign}} />`);

        assert.contains('124');
      });

      test('it displays the total number of competence', async function (assert) {
        this.campaignProfile = {
          competencesCount: 12,
          isShared: true,
        };
        this.campaign = {};

        await render(hbs`<Participant::Profile::Header @campaignProfile={{campaignProfile}} @campaign={{campaign}} />`);
        assert.contains('/\u00a012');
      });

      test('it displays the total number of certifiable competence', async function (assert) {
        this.campaignProfile = {
          certifiableCompetencesCount: 2,
          isShared: true,
        };
        this.campaign = {};

        await render(hbs`<Participant::Profile::Header @campaignProfile={{campaignProfile}} @campaign={{campaign}} />`);

        assert.contains('2');
      });

      module('certifiable badge', function () {
        module('when the profile is certifiable', function () {
          test('it displays certifiable', async function (assert) {
            this.campaignProfile = {
              isCertifiable: true,
              isShared: true,
            };
            this.campaign = {};

            await render(
              hbs`<Participant::Profile::Header @campaignProfile={{campaignProfile}} @campaign={{campaign}} />`
            );

            assert.contains('Certifiable');
          });
        });

        module('when the profile is not certifiable', function () {
          test('it does not display certifiable', async function (assert) {
            this.campaignProfile = {
              isCertifiable: false,
              isShared: true,
            };
            this.campaign = {};

            await render(
              hbs`<Participant::Profile::Header @campaignProfile={{campaignProfile}} @campaign={{campaign}} />`
            );

            assert.notContains('Certifiable');
          });
        });
      });
    });

    module('when the  profile is not shared', function () {
      test('it does not display the pix score', async function (assert) {
        this.campaignProfile = {
          isShared: false,
        };
        this.campaign = {};

        await render(hbs`<Participant::Profile::Header @campaignProfile={{campaignProfile}} @campaign={{campaign}} />`);

        assert.notContains('PIX');
      });

      test('it does not display the total number of competence', async function (assert) {
        this.campaignProfile = {
          competencesCount: 12,
          isShared: false,
        };
        this.campaign = {};

        await render(hbs`<Participant::Profile::Header @campaignProfile={{campaignProfile}} @campaign={{campaign}} />`);

        assert.notContains('12');
        assert.notContains('COMP. CERTIFIABLE');
      });

      test('it does not display the total number of certifiable competence', async function (assert) {
        this.campaignProfile = {
          certifiableCompetencesCount: 30,
          isShared: false,
        };
        this.campaign = {};

        await render(hbs`<Participant::Profile::Header @campaignProfile={{campaignProfile}} @campaign={{campaign}} />`);

        assert.notContains('30');
      });

      test('it does not display certifiable badge', async function (assert) {
        this.campaignProfile = {
          isCertifiable: true,
          isShared: false,
        };
        this.campaign = {};

        await render(hbs`<Participant::Profile::Header @campaignProfile={{campaignProfile}} @campaign={{campaign}} />`);

        assert.notContains('Certifiable');
      });
    });
  });
});
