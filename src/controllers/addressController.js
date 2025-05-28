const {Parent,Address,Children} = require('../models/associations');

module.exports.getAddress = async (req, res, next) => {
    try {
        let children = await Address.findAll({
            where: {
                status: 'active'
            },
            include:[
                {
                    model:Parent,
                    include:[Children]
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

module.exports.getAddressById = async (req, res, next) => {
    try {
        const id = req.query.id;
        if (!id) {
            return res.status(400).json({ message: 'Id required!' });
        }
        let children = await Address.findByPk(id,
            {
                include:[
                    {
                        model:Parent,
                        include:[Children]
                    }
                ]
           
            }
        );
        if (!children) {
            res.status(404).json({
                message: "Address not found!"
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