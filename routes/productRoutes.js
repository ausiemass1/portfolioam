const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const auth = require("../middleware/auth");
const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, '../public/uploads')); 
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
    }
  });

const upload = multer({ storage });

// Add product route
router.post('/addproduct',   upload.single('image'), auth, productController.addProduct);


// Define routes
router.get('/',  productController.displayProducts);
// router.get('/all', productController.addProduct);
router.get('/delete/:id', productController.deleteProduct);
router.get('/edit/:id', productController.editProductForm);

// POST 


router.post('/update/:id', upload.single('image'), productController.updateProduct);

module.exports = router;
