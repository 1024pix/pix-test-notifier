import { inject as service } from '@ember/service';
import SessionService from 'ember-simple-auth/services/session';
import { FRENCH_INTERNATIONAL_LOCALE, FRENCH_FRANCE_LOCALE } from 'pix-certif/services/locale';

export default class CurrentSessionService extends SessionService {
  @service currentDomain;
  @service currentUser;
  @service locale;
  @service intl;
  @service dayjs;

  _localeFromQueryParam;

  async handleAuthentication() {
    const isFranceDomain = this.currentDomain.isFranceDomain;
    await this.currentUser.load();
    const userLocale = this.currentUser.certificationPointOfContact.lang;
    await this.handleLocale({ isFranceDomain, userLocale });

    const isCurrentUserMemberOfACertificationCenter =
      this.currentUser.certificationPointOfContact.isMemberOfACertificationCenter;
    const routeAfterAuthentication = isCurrentUserMemberOfACertificationCenter
      ? 'authenticated'
      : 'login-session-supervisor';
    super.handleAuthentication(routeAfterAuthentication);
  }

  handleInvalidation() {
    super.handleInvalidation('/connexion');
  }

  async handleLocale({ isFranceDomain, localeFromQueryParam, userLocale }) {
    if (localeFromQueryParam && this.intl.get('locales').includes(localeFromQueryParam)) {
      this._localeFromQueryParam = localeFromQueryParam;
    }

    if (isFranceDomain) {
      this.locale.setLocale(FRENCH_INTERNATIONAL_LOCALE);

      if (!this.locale.hasLocaleCookie()) {
        this.locale.setLocaleCookie(FRENCH_FRANCE_LOCALE);
      }

      return;
    }

    if (this._localeFromQueryParam) {
      this.locale.setLocale(this._localeFromQueryParam);
      return;
    }

    const locale = userLocale || FRENCH_INTERNATIONAL_LOCALE;
    this.locale.setLocale(locale);
  }
}
