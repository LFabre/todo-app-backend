const { Model } = require('sequelize')

/**
 * Maps user database table
 * 
 * @author Lucas Fabre
 * @class ModelUser
 * @extends {Model}
 */
class ModelUser extends Model {
  static init(sequelize, Sequelize) {
    return super.init({
      user_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      login: {
        type: Sequelize.STRING(45),
        unique: true,
        allowNull: false,
      },
      first_name: {
        type: Sequelize.STRING(75),
        allowNull: false,
      },
      last_name: {
        type: Sequelize.STRING(75),
        defaultValue: '',
      },
      createdAt: { type: 'TIMESTAMP', field: 'created_at' },
      updatedAt: { type: 'TIMESTAMP', field: 'updated_at' },
      deletedAt: { type: 'TIMESTAMP', field: 'deleted_at' }
    }, {
      sequelize,
      modelName: 'User',
      tableName: 'user',
      timestamps: true,
      paranoid: true
    })
  }

  static associate(models) {
    // Allows Sequelize to query Projects with ModelUser
    // user_id is added as foregin key on ModelProject
    models.User.hasMany(models.Project, {
      foreignKey: { name: 'user_id', allowNull: false },
      as: 'projects'
    })
  }
}

module.exports = ModelUser