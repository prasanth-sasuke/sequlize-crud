const userController = require('../controllers/userController.js');
const childrenController = require('../controllers/childController');
const addressController = require('../controllers/addressController');
const router = require('express').Router();


router.get('/', userController.getParent); 

router.get('/parentById', userController.getParentById); 

router.post('/save-parent',userController.saveParent);

router.put('/update-parent',userController.updateParent);

router.delete('/delete-parent',userController.deleteParent);

router.get('/children',childrenController.getChildren);

router.get('/childrenById',childrenController.getChildrenById);

router.post('/save-children',childrenController.saveChildren);

router.put('/update-children', childrenController.updateChildren);

router.delete('/delete-children', childrenController.deleteChildren);

router.get('/address',addressController.getAddress);

router.get('/addressbyId',addressController.getAddressById);

router.post('/save-address',addressController.saveAddress);

router.put('/update-address',addressController.updateAddress);

router.delete('/delete-address',addressController.deleteAddress);


module.exports = router;