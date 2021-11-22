import Route from '@ember/routing/route';
import SecuredRouteMixin from 'mon-pix/mixins/secured-route-mixin';
import { inject as service } from '@ember/service';

export default class InvitedRoute extends Route.extend(SecuredRouteMixin) {
  @service campaignStorage;

  beforeModel(transition) {
    if (!transition.from) {
      return this.replaceWith('campaigns.entry-point');
    }
    super.beforeModel(...arguments);
  }

  model() {
    return this.modelFor('campaigns');
  }

  afterModel(campaign) {
    if (this.shouldAssociateWithScoInformation(campaign)) {
      return this.replaceWith('campaigns.invited.student-sco', campaign);
    }

    if (this.shouldAssociateWithSupInformation(campaign)) {
      return this.replaceWith('campaigns.invited.student-sup', campaign);
    }

    return this.replaceWith('campaigns.invited.fill-in-participant-external-id', campaign);
  }

  shouldAssociateWithScoInformation(campaign) {
    const associationDone = this.campaignStorage.get(campaign.code, 'associationDone');
    return campaign.isOrganizationSCO && campaign.isRestricted && !associationDone;
  }

  shouldAssociateWithSupInformation(campaign) {
    const associationDone = this.campaignStorage.get(campaign.code, 'associationDone');
    return campaign.isOrganizationSUP && campaign.isRestricted && !associationDone;
  }
}
