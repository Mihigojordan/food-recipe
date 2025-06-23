const User = require('./User');
const Recipe = require('./Recipe');
const Preference = require('./Preference');
const WeeklyPlan = require('./WeeklyPlan');
const Notification = require('./Notification');

// Define associations
// User.hasMany(Recipe, { foreignKey: 'userId' });
// Recipe.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Preference, { foreignKey: 'userId' });
Preference.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(WeeklyPlan, { foreignKey: 'userId' });
WeeklyPlan.belongsTo(User, { foreignKey: 'userId' });

WeeklyPlan.belongsTo(Recipe, { foreignKey: 'recipeId' });
Recipe.hasMany(WeeklyPlan, { foreignKey: 'recipeId' });

User.hasMany(Notification, { foreignKey: 'userId' });
Notification.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
    User,
    Recipe,
    Preference,
    WeeklyPlan,
    Notification
}; 