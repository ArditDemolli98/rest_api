const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const isAuth = require("../middlewares/isAuth");
const { body } = require("express-validator");

// GET /api/products
router.get("/products", isAuth ,productController.getProducts);

// GET /api/products/{id}
router.get("/products/:id", isAuth, productController.getProductById);

// POST /api/products
router.post("/products", isAuth, [
    body("name")
        .isString()
        .isLength({ min: 3, max: 20 }).withMessage("Name has to be between 3 and 20 characters long!")
        .trim().escape(),
    body("description")
        .isString()
        .isLength({ min: 5, max: 150 }).withMessage("Description has to be between 5 and 150 characters long!")
        .trim().escape(),
    body("price")
        .isFloat({ min: 0 }).withMessage("Price has to be a positive number!"),
], productController.createProduct);

// PUT /api/products/{id}
router.put("/products/:id", isAuth, [
    body("prodName")
        .isString()
        .isLength({ min: 3, max: 20 }).withMessage("Name has to be between 3 and 20 characters long!")
        .trim().escape(),
    body("prodDesc")
        .isString()
        .isLength({ min: 5, max: 150 }).withMessage("Description has to be between 5 and 150 characters long!")
        .trim().escape(),
    body("prodPrice")
        .isFloat({ min: 0 }).withMessage("Price has to be a positive number!")

], productController.updateProduct);

// DELETE /api/products/{id}
router.delete("/products/:id", isAuth, productController.deleteProduct);

module.exports = router;