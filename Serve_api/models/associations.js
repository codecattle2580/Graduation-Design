
const Agritourism = require('./Agritourism');
const Food = require('./Food');
const Room = require('./Room');
const Order = require('./Order')
const User = require('./User')
const Message = require('./Message')

User.hasMany(Agritourism, { foreignKey: 'uid' });
Agritourism.belongsTo(User, { foreignKey: 'uid' });

Agritourism.hasMany(Food, { foreignKey: 'nid' });
Food.belongsTo(Agritourism, { foreignKey: 'nid' });

Agritourism.hasMany(Room, { foreignKey: 'nid' });
Room.belongsTo(Agritourism, { foreignKey: 'nid' });

Room.hasMany(Order, { foreignKey: 'zid' });
Order.belongsTo(Room, { foreignKey: 'zid' });

Order.hasMany(Message, { foreignKey: 'did' });
Message.belongsTo(Order, { foreignKey: 'did' });