const Parent = require('./parentModel');
const Children = require('./childModel');
const Address = require('./addressModel');

Parent.hasMany(Children, {
    foreignKey: 'parentId',
    onDelete: 'CASCADE',
});
Children.belongsTo(Parent, {
    foreignKey: 'parentId',
});

Parent.hasMany(Address,{
    foreignKey:'parentId',
onDelete: 'CASCADE'
});
Address.belongsTo(Parent, {
    foreignKey: 'parentId',
});

module.exports = {
    Parent: Parent, 
    Children: Children,
    Address:Address
}