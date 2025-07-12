export default (sequelize, DataTypes) => {
  return sequelize.define('AuditLog', {
    userId: { type: DataTypes.INTEGER, allowNull: false },
    action: { type: DataTypes.STRING, allowNull: false },
    entity: { type: DataTypes.STRING, allowNull: false },
    entityId: { type: DataTypes.INTEGER, allowNull: false },
    changes: { type: DataTypes.JSON },
    timestamp: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  });
};
