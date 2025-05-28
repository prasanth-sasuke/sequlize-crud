const {Parent,Children,Address} = require('../models/associations');
//get all users
module.exports.getParent = async (req, res, next) => {
  try {
    let user = await Parent.findAll({
      where: {
        status: 'active'
      },
      include:[Children,Address]
    })
    if (user.length > 0) {
      res.status(200).json({
        message: "Success",
        result: user
      })
    } else {
      res.status(404).json({
        message: "User not found!"
      })
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong!' });
  }
}

module.exports.getParentById = async (req, res, next) => {
  try {
    const userId = req.query.userId;
    console.log(userId);
    if (!userId) {
      return res.status(400).json({ message: 'User id required!' });
    }
    let user = await Parent.findByPk(userId, {
      include:[Children,Address]
    })
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