const Product = require("../models/Product");
const User = require("../models/User");
const { validationResult } = require("express-validator");

const getProducts = async (req, res, next) => {
    try {
        const currentPage = req.query.page || 1;
        const perPage = 4;
        const totalItems = await Product.find().countDocuments();
        const products = await Product.find()
                                        .skip((currentPage - 1) * perPage)
                                        .limit(perPage);
        res.status(200).json({
            message: "Fetched products successfully", 
            products: products, 
            totalItems: totalItems
        });
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

const getProductById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const product = await Product.findById(id);
        if(!product){
            const error = new Error(`Product with id: ${id} doesn't exist!`);
            error.statusCode = 404;
            throw error;
        }
        if(post.userId.toString() !== req.userId) {
            throw new Error('Not authorized!');
        }
        res.status(200).json(product);        
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

const createProduct = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const errorMessage = errors.array()[0].msg;
            const error = new Error(errorMessage);
            error.statusCode = 422;
            throw error;
        }

        const prodName = req.body.name;
        const prodDesc = req.body.description;
        const prodPrice = req.body.price;
        const userId = req.userId;

        const product = new Product({
            name: prodName,
            description: prodDesc,
            price: prodPrice,
            userId: userId
        })
        await product.save();

        const user = await User.findById(req.userId);
        if(!user) {
            const error = new Error("Not authorized!");
            error.statusCode = 403;
            throw error;
        }
        user.products.push(product);
        await user.save();

        res.status(201).json({product, message: "Product created successfully!", user: {id: user._id, username: user.username}});
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

const updateProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const prodName = req.body.name;
        const prodDesc = req.body.description;
        const prodPrice = req.body.price;
        const errors = validationResult(req);
        const product = await Product.findById(id);

        if(product.userId.toString() !== req.userId) {
            const error = new Error('Not authorized!');
            error.statusCode = 403;
            throw error;
        }
        
        if (!errors.isEmpty()) {
            const errorMessage = errors.array()[0].msg;
            const error = new Error(errorMessage);
            error.statusCode = 422;
            throw error;
        }

        product.name = prodName;
        product.description = prodDesc;
        product.price = prodPrice;
        await product.save();

        res.status(200).json({product, message: "Product updated successfully!"});
    } catch (error) {
        if(!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

const deleteProduct = async (req, res, next) => {
    try {
        const id = req.params.id;
        const product = await Product.findById(id);
        if(!product) {
            const error = new Error(`Product with id: ${id} doesn't exist!`);
            error.statusCode = 404;
            throw error;
        }
        
        if(product.userId.toString() !== req.userId) {
            const error = new Error('Not authorized');
            error.statusCode = 403;
            throw error;
        }
        
        await product.deleteOne();
        const user = await User.findById(req.userId);
        user.products.pull(id);
        await user.save();
        res.status(200).json({message: "Product deleted successfully!"});
    } catch (error) {
        if(!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct }