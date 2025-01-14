import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class StageRoute extends Route {
  @service store;
  @service accessControl;

  beforeModel() {
    this.accessControl.restrictAccessTo(['isSuperAdmin', 'isSupport', 'isMetier'], 'authenticated');
  }

  async model(params) {
    const targetProfile = this.modelFor('authenticated.target-profiles.target-profile');
    const stageCollection = await targetProfile.belongsTo('stageCollection').value();
    const stage = stageCollection.stages.find((stage) => stage.id == params.stage_id);

    return {
      stage,
      stageCollection,
      targetProfile,
    };
  }
}
