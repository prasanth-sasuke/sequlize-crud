const {Parent,Address,Children} = require('../models/associations');
const sequelize = require('../config/database')
module.exports.getAddress = async (req, res, next) => {
    try {
        let query = `
            SELECT a.id AS address_id,a.city,a.state,a."parentId",p.id AS parent_id,p.name AS parent_name,p.email AS parent_email,c.id AS child_id,c.name AS child_name, c.email AS child_email,c."parentId" AS child_parentId
            FROM addresses a
            LEFT JOIN parents p ON a."parentId" = p.id
            LEFT JOIN children c ON p.id = c."parentId"
            WHERE a.status = 'active'
            ORDER BY a.id, c.id;
        `
        const [results, metadata] = await sequelize.query(query);

        if (results.length > 0) {
            res.status(200).json({ message: "Success", result: results });
        } else {
            res.status(404).json({ message: "children not found!" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Something went wrong!' });
    }
}


module.exports.getAddressById = async (req, res, next) => {
    try {
        const id = req.query.id;
        const limit = parseInt(req.query.limit) || 1;
        const page = parseInt(req.query.page) || 1;
        const offset = (page - 1) * limit;
        if (!id) {
            return res.status(400).json({ message: 'Id required!' });
        }
      let query = `
            SELECT a.id AS address_id,a.city,a.state,a."parentId",p.id AS parent_id,p.name AS parent_name,p.email AS parent_email,c.id AS child_id,c.name AS child_name, c.email AS child_email,c."parentId" AS child_parentId
            FROM addresses a
            LEFT JOIN parents p ON a."parentId" = p.id
            LEFT JOIN children c ON p.id = c."parentId"
            WHERE a.id = :id AND a.status = 'active'
            ORDER BY a.id, c.id
            LIMIT :limit OFFSET :offset;
            ;`
        const results = await sequelize.query(query,{
      replacements: { id , limit, offset},
      raw: true
    });

        if (results.length > 0) {
           return res.status(200).json({ message: "Success", result: results[0] });
        } else {
           return res.status(404).json({ message: "children not found!" });
        }

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Something went wrong!' });
    }
}

module.exports.saveAddress = async (req, res, next) => {
    try {
        const city = req.body.city;
        const state = req.body.state;
        const parentId = req.body.parentId;
        const pinCode = req.body.pinCode;


        if (!city || !state || !parentId || !pinCode) {
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
            return res.status(404).json({ message: 'Address not found!' });
        }
        let children = await Address.create({
            state: state,
            city: city,
            pinCode: pinCode,
            parentId: parentId
        })
        if (children) {
            res.status(201).json({
                message: 'Address created successfully!',
                result: children
            });
        }

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Something went wrong!' });
    }
};


module.exports.updateAddress = async (req, res, next) => {
    try {
        const { id, pinCode, state, city } = req.body;

        if (!id || !pinCode || !state || !city) {
            return res.status(400).json({ message: "Invalid field!" });
        }

        const address = await Address.findOne({
            where: {
                id: id,
                status: 'active'
            }
        });

        if (!address) {
            return res.status(404).json({ message: 'Address not found!' });
        }

        address.pinCode = pinCode;
        address.state = state;
        address.city = city

        const result = await address.save();

        return res.status(200).json({ message: 'Address updated!', user: result });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Something went wrong!' });
    }
};



module.exports.deleteAddress = async (req, res, next) => {
  try {
    let id = req.body.id
    const address = await Address.findOne({
      where: {
        id: id,
        status: 'active'
      }
    });

    if (!address) {
      return res.status(404).json({ message: 'address not found!' });
    }

    address.status = 'inactive';
    const result = await address.save();

    res.status(200).json({ message: 'address updated!', result: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong!' });
  }
}