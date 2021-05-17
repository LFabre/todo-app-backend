const { Model } = require('sequelize')

/**
 * Maps task database table
 * 
 * @author Lucas Fabre
 * @class ModelUserAuth
 * @extends {Model}
 */
class ModelTask extends Model {
  static init(sequelize, Sequelize) {
    return super.init({
      task_id: {
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
      termination_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
        defaultValue: null
      },
      finish_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
        defaultValue: null
      },
      createdAt: { type: 'TIMESTAMP', field: 'created_at' },
      updatedAt: { type: 'TIMESTAMP', field: 'updated_at' },
      deletedAt: { type: 'TIMESTAMP', field: 'deleted_at' }
    }, {
      sequelize,
      modelName: 'Task',
      tableName: 'task',
      timestamps: true,
      paranoid: true
    })
  }

  static associate(models) {
    // Adds project_id as foregin key from ModelProject
    models.Task.belongsTo(models.Project, {
      foreignKey: { name: 'project_id', allowNull: false },
      as: 'project'
    })
  }
}

module.exports = ModelTask