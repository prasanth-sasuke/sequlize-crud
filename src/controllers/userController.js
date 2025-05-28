const { Parent, Children, Address } = require('../models/associations');
const sequelize = require('../config/database.js');
const { json } = require('sequelize');
//get all users
module.exports.getParent = async (req, res, next) => {
  try {
    const query = `
      SELECT
        p.id as parent_id,
        p.name as parent_name,
        c.id, c.name as child_name,
        a.id, a.city
      FROM parents p
    LEFT JOIN children c ON p.id = c."parentId"
  LEFT JOIN addresses a ON p.id = a."parentId"
  WHERE p.status = 'active'
    `;

    const [results, metadata] = await sequelize.query(query, { raw: true });
    console.log(results);
    return res.json(results)
  
  } catch (err) {
    console.error(err);
    res.status(500).json({ err });
  }
}

module.exports.getParentById = async (req, res, next) => {
  try {
    const userId = req.query.userId;
    console.log(userId);
    if (!userId) {
      return res.status(400).json({ message: 'User id required!' });
    }
    const query = `
      SELECT
        p.*,
        c.id AS child_id,
        c.name AS child_name,
        a.id AS address_id,
        a.city
      FROM parents p
      LEFT JOIN children c ON p.id = c."parentId"
      LEFT JOIN addresses a ON p.id = a."parentId"
      WHERE p.id = :userId
      ORDER BY p.id, c.id, a.id;
    `;

    const [results, metadata] = await sequelize.query(query, {
      replacements: { userId },
      raw: true
    });

    return res.json({results})
    if (!user) {
      res.status(404).json({
        message: "User not found!"
      })
    } else {

      res.status(200).json({
        message: "Success",
        result: user
      })
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong!' });
  }
}

module.exports.saveParent = async (req, res, next) => {
  try {
    const name = req.body.name;
    const email = req.body.email;

    if (!name || !email) {
      return res.status(400).json({
        message: "Invalid field!"
      });
    }

    let user = await Parent.create({
      name: name,
      email: email
    })
    if (user) {
      res.status(201).json({
        message: 'User created successfully!',
        user: user
      });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong!' });
  }
};

module.exports.updateParent = async (req, res, next) => {
  try {
    const { userId, name: updatedName, email: updatedEmail } = req.body;

    if (!userId || !updatedEmail || !updatedName) {
      return res.status(400).json({ message: "Invalid field!" });
    }

    const user = await Parent.findOne({
      where: {
        id: userId,
        status: 'active'
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found!' });
    }

    user.name = updatedName;
    user.email = updatedEmail;

    const result = await user.save();

    return res.status(200).json({ message: 'User updated!', user: result });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Something went wrong!' });
  }
};

module.exports.deleteParent = async (req, res, next) => {
  try {
    let userId = req.body.userId
    const user = await Parent.findOne({
      where: {
        id: userId,
        status: 'active'
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found!' });
    }

    user.status = 'inactive';
    const result = await user.save();

    res.status(200).json({ message: 'User updated!', user: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong!' });
  }
}