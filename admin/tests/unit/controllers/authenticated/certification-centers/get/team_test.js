import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import sinon from 'sinon';

module('Unit | Controller | authenticated/certification-centers/get/team', function (hooks) {
  setupTest(hooks);

  module('#updateEmailErrorMessage', function () {
    test('should set email error message if email syntax is invalid', function (assert) {
      // given
      const controller = this.owner.lookup('controller:authenticated/certification-centers/get/team');
      controller.userEmailToAdd = 'an invalid email';

      // when
      controller.send('updateEmailErrorMessage');

      // then
      assert.strictEqual(controller.errorMessage, controller.EMAIL_INVALID_ERROR_MESSAGE);
    });

    test('should set email error message to null if email is empty', function (assert) {
      // given
      const controller = this.owner.lookup('controller:authenticated/certification-centers/get/team');
      controller.errorMessage = 'error message';
      controller.userEmailToAdd = '';

      // when
      controller.send('updateEmailErrorMessage');

      // then
      assert.strictEqual(controller.errorMessage, null);
    });
  });

  module('#isDisabled', function () {
    test('should be disabled if the email is empty', async function (assert) {
      // given
      const controller = this.owner.lookup('controller:authenticated/certification-centers/get/team');
      controller.userEmailToAdd = '';

      // when / then
      assert.true(controller.isDisabled);
    });
  });

  module('#addCertificationCenterMembership', function () {
    module('when email is valid', function () {
      test('should create a certificationCenterMembership', async function (assert) {
        // given
        const controller = this.owner.lookup('controller:authenticated/certification-centers/get/team');
        const emailWithSpaces = ' test@example.net ';
        controller.userEmailToAdd = emailWithSpaces;
        controller.send = sinon.stub();
        controller.notifications = {
          success: sinon.stub(),
        };
        controller.model = {
          certificationCenterMemberships: {},
          certificationCenterId: 666,
        };

        const store = this.owner.lookup('service:store');
        const saveStub = sinon.stub();
        store.createRecord = sinon.stub();
        store.createRecord.returns({ save: saveStub.resolves() });

        // when
        const event = { preventDefault() {} };
        await controller.addCertificationCenterMembership(event);

        // then
        sinon.assert.calledWith(store.createRecord, 'certification-center-membership');
        sinon.assert.calledWith(saveStub, {
          adapterOptions: {
            createByEmail: true,
            certificationCenterId: 666,
            email: emailWithSpaces.trim(),
          },
        });
        sinon.assert.calledWith(controller.send, 'refreshModel');
        assert.ok(true);
      });

      test('should not set any error message', async function (assert) {
        // given
        const controller = this.owner.lookup('controller:authenticated/certification-centers/get/team');
        const emailWithSpaces = ' test@example.net ';
        controller.send = sinon.stub();
        controller.userEmailToAdd = emailWithSpaces;

        const store = this.owner.lookup('service:store');
        const saveStub = sinon.stub();
        store.createRecord = sinon.stub();
        store.createRecord.returns({ save: saveStub.resolves() });

        // when
        const event = { preventDefault() {} };
        await controller.addCertificationCenterMembership(event);

        // then
        assert.strictEqual(controller.errorMessage, null);
      });

      test('should send success notification', async function (assert) {
        // given
        const controller = this.owner.lookup('controller:authenticated/certification-centers/get/team');
        const emailWithSpaces = ' test@example.net ';
        controller.userEmailToAdd = emailWithSpaces;
        controller.send = sinon.stub();
        controller.model = {
          certificationCenterId: 666,
        };
        controller.notifications = {
          success: sinon.stub(),
        };

        const store = this.owner.lookup('service:store');
        const saveStub = sinon.stub();
        store.createRecord = sinon.stub();
        store.createRecord.returns({ save: saveStub.resolves() });

        // when
        const event = { preventDefault() {} };
        await controller.addCertificationCenterMembership(event);

        // then
        sinon.assert.called(controller.notifications.success);
        assert.ok(true);
      });
    });

    module('when email is not valid', function () {
      test('should set error message if the email is empty', async function (assert) {
        // given
        const controller = this.owner.lookup('controller:authenticated/certification-centers/get/team');
        controller.userEmailToAdd = '';

        // when
        const event = { preventDefault() {} };
        await controller.addCertificationCenterMembership(event);

        // then
        assert.strictEqual(controller.errorMessage, controller.EMAIL_REQUIRED_ERROR_MESSAGE);
      });

      test('should set error message if the email syntax is invalid', async function (assert) {
        // given
        const controller = this.owner.lookup('controller:authenticated/certification-centers/get/team');
        controller.userEmailToAdd = 'an invalid email';

        // when
        const event = { preventDefault() {} };
        await controller.addCertificationCenterMembership(event);

        // then
        assert.strictEqual(controller.errorMessage, controller.EMAIL_INVALID_ERROR_MESSAGE);
      });
    });

    module('when API response is not OK', function () {
      module('when the response error does not contains any errors property', function () {
        test('should send default error notification', async function (assert) {
          // given
          const controller = this.owner.lookup('controller:authenticated/certification-centers/get/team');
          controller.userEmailToAdd = 'test@example.net';
          controller.notifications = {
            error: sinon.stub(),
          };
          controller.model = {
            certificationCenterId: 666,
          };

          const store = this.owner.lookup('service:store');
          const saveStub = sinon.stub();
          store.createRecord = sinon.stub();
          store.createRecord.returns({ save: saveStub.rejects() });

          // when
          const event = { preventDefault() {} };
          await controller.addCertificationCenterMembership(event);

          // then
          sinon.assert.calledWith(controller.notifications.error, controller.ERROR_MESSAGES.DEFAULT);
          assert.ok(true);
        });
      });

      module('when the response error contains an errors property', () => {
        test('should send a specific error notification for http error 400, 404 and 412', async function (assert) {
          // given
          const controller = this.owner.lookup('controller:authenticated/certification-centers/get/team');
          const responseError = {
            errors: [{ status: '400' }, { status: '404' }, { status: '412' }],
          };
          controller.notifications = {
            error: sinon.stub(),
          };
          controller.model = {
            certificationCenterId: 666,
          };

          const store = this.owner.lookup('service:store');
          const saveStub = sinon.stub();
          store.createRecord = sinon.stub();
          store.createRecord.returns({ save: saveStub.throws(responseError) });

          controller.userEmailToAdd = 'test@example.net';

          // when
          const event = { preventDefault() {} };
          await controller.addCertificationCenterMembership(event);

          // then
          sinon.assert.calledWith(controller.notifications.error, controller.ERROR_MESSAGES.STATUS_400);
          sinon.assert.calledWith(controller.notifications.error, controller.ERROR_MESSAGES.STATUS_404);
          sinon.assert.calledWith(controller.notifications.error, controller.ERROR_MESSAGES.STATUS_412);
          assert.ok(true);
        });
      });
    });
  });
});
