const { Model } = require('sequelize')
const { Parent, Children, Address } = require('../models/associations')
module.exports.getChildren = async (req, res, next) => {
  try {
    let children = await Children.findAll({
      where: {
        status: 'active'
      },
      include:[
        {
          model:Parent,
          include:[Address]
        }
      ]
    })
    if (children.length > 0) {
      res.status(200).json({
        message: "Success",
        result: children
      })
    } else {
      res.status(404).json({
        message: "children not found!"
      })
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong!' });
  }
}


module.exports.getChildrenById = async (req, res, next) => {
  try {
    const id = req.query.id;
    if (!id) {
      return res.status(400).json({ message: 'Id required!' });
    }
    let children = await Children.findByPk(id, {
      include: [
        { 
          model: Parent, include: [Address] 
        }
      ]
    })
    if (!children) {
      res.status(404).json({
        message: "User not found!"
      })
    } else {


      res.status(200).json({
        message: "Success",
        result: children
      })
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong!' });
  }
}


module.exports.saveChildren = async (req, res, next) => {
  try {
    const name = req.body.name;
    const email = req.body.email;
    const parentId = req.body.parentId

    if (!name || !email || !parentId) {
      return res.status(400).json({
        message: "Invalid field!"
      });
    }

    let parent = await Parent.findOne({
      where: {
        id: parentId,
        status: "active"
      }
    })
    if (!parent) {
      return res.status(404).json({ message: 'parent not found!' });
    }
    let children = await Children.create({
      name: name,
      email: email,
      parentId: parentId
    })
    if (children) {
      res.status(201).json({
        message: 'User created successfully!',
        result: children
      });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong!' });
  }
};


module.exports.updateChildren = async (req, res, next) => {
  try {
    const { id, name: updatedName, email: updatedEmail } = req.body;

    if (!id || !updatedEmail || !updatedName) {
      return res.status(400).json({ message: "Invalid field!" });
    }

    const children = await Children.findOne({
      where: {
        id: id,
        status: 'active'
      }
    });

    if (!children) {
      return res.status(404).json({ message: 'Children not found!' });
    }

    children.name = updatedName;
    children.email = updatedEmail;

    const result = await children.save();

    return res.status(200).json({ message: 'children updated!', user: result });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Something went wrong!' });
  }
};


module.exports.deleteChildren = async (req, res, next) => {
  try {
    let id = req.body.id
    const children = await Children.findOne({
      where: {
        id: id,
        status: 'active'
      }
    });

    if (!children) {
      return res.status(404).json({ message: 'children not found!' });
    }

    children.status = 'inactive';
    const result = await children.save();

    res.status(200).json({ message: 'children updated!', result: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong!' });
  }
}