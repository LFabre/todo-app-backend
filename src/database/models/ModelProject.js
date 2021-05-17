const { Model } = require('sequelize')

/**
 * Maps project database table
 * 
 * @author Lucas Fabre
 * @class ModelUserAuth
 * @extends {Model}
 */
class ModelProject extends Model {
  static init(sequelize, Sequelize) {
    return super.init({
      project_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING(75),
        allowNull: false
      },
      description: {
        type: Sequelize.STRING(300),
        defaultValue: ''
      },
      createdAt: { type: 'TIMESTAMP', field: 'created_at' },
      updatedAt: { type: 'TIMESTAMP', field: 'updated_at' },
      deletedAt: { type: 'TIMESTAMP', field: 'deleted_at' }
    }, {
      sequelize,
      modelName: 'Project',
      tableName: 'project',
      timestamps: true,
      paranoid: true
    })
  }

  static associate(models) {
    // Adds user_id as foregin key from ModelUser
    models.Project.belongsTo(models.User, {
      foreignKey: { name: 'user_id', allowNull: false },
      as: 'user'
    })

    // Allows Sequelize to query Task with ModelProject
    // project_id is added as foregin key on ModelTask
    models.Project.hasMany(models.Task, {
      foreignKey: { name: 'project_id', allowNull: false },
      as: 'tasks'
    })
  }
}

module.exports = ModelProject