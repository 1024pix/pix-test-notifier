const { CERTIFICATION_CENTER_TYPES } = require('../constants.js');

class CertificationCenter {
  constructor({ id, name, externalId, type, createdAt, updatedAt, habilitations = [] } = {}) {
    this.id = id;
    this.name = name;
    this.externalId = externalId;
    this.type = type;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.habilitations = habilitations;
  }

  get isSco() {
    return this.type === CERTIFICATION_CENTER_TYPES.SCO;
  }

  get hasBillingMode() {
    return this.type !== CERTIFICATION_CENTER_TYPES.SCO;
  }

  isHabilitated(key) {
    return this.habilitations.some((habilitation) => habilitation.key === key);
  }
}

module.exports = CertificationCenter;
module.exports.types = CERTIFICATION_CENTER_TYPES;
