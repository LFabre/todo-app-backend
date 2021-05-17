const { Model } = require('sequelize')

/**
 * Maps user_auth database table
 * 
 * @author Lucas Fabre
 * @class ModelUserAuth
 * @extends {Model}
 */
class ModelUserAuth extends Model {
  static init(sequelize, Sequelize) {
    return super.init({
      user_auth_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      secret: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      createdAt: { type: 'TIMESTAMP', field: 'created_at' },
      updatedAt: { type: 'TIMESTAMP', field: 'updated_at' },
      deletedAt: { type: 'TIMESTAMP', field: 'deleted_at' }
    }, {
      sequelize,
      modelName: 'UserAuth',
      tableName: 'user_auth',
      timestamps: true
    })
  }

  static associate(models) {
    // Adds Foreign key to table User
    models.UserAuth.belongsTo(models.User, {
      foreignKey: { name: 'user_id', allowNull: false },
      as: 'user'
    })
  }
}

module.exports = ModelUserAuth