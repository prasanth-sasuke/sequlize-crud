const Sequelize  = require('sequelize');
const sequelize = require('sequelize');
const db = require('../config/database');
const parent = require('./parentModel');

const Address = db.define('address',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    city: Sequelize.STRING,
    state: Sequelize.STRING,
    pinCode: Sequelize.INTEGER,
    status:{
        type:Sequelize.STRING,
        defaultValue: "active"
    },
    parentId: {
        type:Sequelize.INTEGER,
        references:{
            model: parent,
            key: "id"
        },
        onDelete:"CASCADE"
    }
},
{
    timestamps: true
});



module.exports = Address;