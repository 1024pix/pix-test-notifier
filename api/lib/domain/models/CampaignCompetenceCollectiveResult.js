class CampaignCompetenceCollectiveResult {

  constructor({
    // attributes
    campaignId,
    competenceId,
    competenceIndex,
    competenceName,
    totalSkillsCount,
    averageValidatedSkills,
  } = {}) {
    // attributes
    this.campaignId = campaignId;
    this.competenceId = competenceId;
    this.competenceIndex = competenceIndex;
    this.competenceName = competenceName;
    this.totalSkillsCount = totalSkillsCount;
    this.averageValidatedSkills = averageValidatedSkills;
  }

  get id() {
    return `${this.campaignId}_${this.competenceId}`;
  }

  get domainCode() {
    return this.competenceIndex.charAt(0);
  }
}

module.exports = CampaignCompetenceCollectiveResult;
