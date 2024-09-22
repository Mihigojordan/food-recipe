const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');
const Admin = require('./Admin');

const Preference = sequelize.define('Preference', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

// Create a relationship between Admin and Preference
Admin.hasMany(Preference, { foreignKey: 'adminId', onDelete: 'CASCADE' });
Preference.belongsTo(Admin, { foreignKey: 'adminId' });

module.exports = Preference;