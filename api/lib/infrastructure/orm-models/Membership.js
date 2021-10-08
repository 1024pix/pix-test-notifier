const Bookshelf = require('../bookshelf');

require('./Organization');
require('./User');

const modelName = 'Membership';

module.exports = Bookshelf.model(
  modelName,
  {
    tableName: 'memberships',
    hasTimestamps: ['createdAt', 'updatedAt'],

    user() {
      return this.belongsTo('User', 'userId');
    },

    organization() {
      return this.belongsTo('Organization', 'organizationId');
    },
  },
  {
    modelName,
  }
);
