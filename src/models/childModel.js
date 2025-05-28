
const Sequelize = require('sequelize');
const db = require('../config/database.js');
const parent = require('./parentModel');

const Children = db.define('children', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: Sequelize.STRING,
    email: Sequelize.STRING,
    status: {
        type: Sequelize.STRING,
        defaultValue: 'active' 
    },
    parentId: {
        type: Sequelize.INTEGER,
        references:{
            model:parent,
            key:"id"
        },
        onDelete: "CASCADE"
    }
    
}, {
    timestamps: true 
}
);

module.exports = Children;


