

const Sequelize = require('sequelize');
const db = require('../config/database.js');

const parent = db.define('parent', {
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
    
}, {
    timestamps: true 
}
);


module.exports = parent;