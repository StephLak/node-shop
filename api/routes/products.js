const express = require('express');
const router = express.Router();
const multer = require('multer');

const checkAuth = require('../middleware/check-auth');
const ProductsController =  require("../controllers/products");

// cb stands for callback
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    // To reject a file
    // cb(null, false);
    // To accept a file
    // cb(null, true);
    // To accept particular image types
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({
    storage: storage, 
    limits: {
        fileSize: 1024 * 1024 * 5,
    },
    fileFilter: fileFilter,
});

router.get('/', ProductsController.get_all_products);

router.post('/', checkAuth, upload.single('productImage'), ProductsController.create_product);

router.patch('/:productId', checkAuth, ProductsController.update_product);

router.get('/:productId', ProductsController.get_single_product);

router.delete('/:productId', checkAuth, ProductsController.delete_product);

module.exports = router;