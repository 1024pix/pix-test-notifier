import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';
import { triggerEvent } from '@ember/test-helpers';
import { fillByLabel, render } from '@1024pix/ember-testing-library';

import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';

module('Integration | Component | Auth::ToggableLoginForm', function (hooks) {
  setupIntlRenderingTest(hooks);

  let emailInputLabel;
  let passwordInputLabel;

  hooks.beforeEach(function () {
    emailInputLabel = this.intl.t('pages.login-form.email');
    passwordInputLabel = this.intl.t('pages.login-form.password');
  });

  test('it should display email and password inputs', async function (assert) {
    // when
    const screen = await render(hbs`<Auth::ToggableLoginForm/>`);

    // then
    assert.dom(screen.getByRole('textbox', { name: emailInputLabel })).exists();
    assert.dom(screen.getByLabelText(passwordInputLabel)).exists();
  });

  test('[a11y] it should display a message that all inputs are required', async function (assert) {
    // when
    const screen = await render(hbs`<Auth::ToggableLoginForm/>`);

    // then
    assert.dom(screen.getByText('Tous les champs sont obligatoires.')).exists();
    assert.dom(screen.getByRole('textbox', { name: emailInputLabel })).hasAttribute('required');
    assert.dom(screen.getByLabelText(passwordInputLabel)).hasAttribute('required');
  });

  module('when the user fills inputs with errors', function () {
    test('should display an invalid email error message when focus-out', async function (assert) {
      //given
      const invalidEmail = 'invalidEmail';
      const screen = await render(hbs`<Auth::ToggableLoginForm/>`);

      // when
      await fillByLabel(emailInputLabel, invalidEmail);
      const emailInput = screen.getByRole('textbox', { name: emailInputLabel });
      await triggerEvent(emailInput, 'focusout');

      // then
      assert.dom(screen.getByText(this.intl.t('pages.login-form.errors.invalid-email'))).exists();
    });

    test('should display an empty password error message when focus-out', async function (assert) {
      //given
      const screen = await render(hbs`<Auth::ToggableLoginForm/>`);

      // when
      await fillByLabel(passwordInputLabel, '');
      const passwordInput = screen.getByLabelText(passwordInputLabel);
      await triggerEvent(passwordInput, 'focusout');

      // then
      assert.dom(screen.getByText(this.intl.t('pages.login-form.errors.empty-password'))).exists();
    });
  });
});
