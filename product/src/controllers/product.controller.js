const productModel = require('../models/product.model');
const { uploadImage } = require('../services/imagekit.service');
const mongoose = require('mongoose');

async function createProduct(req, res) {
    try {
        const { title, description, priceAmount, priceCurrency = 'INR' } = req.body;
        const seller = req.user.id;

        const price = {
            amount: Number(priceAmount),
            currency: priceCurrency
        };

        const images = [];
        for (const file of (req.files || [])) {
            const uploaded = await uploadImage({
                buffer: file.buffer,
                filename: file.originalname
            });
            images.push(uploaded);
        }

        const product = await productModel.create({
            title,
            description,
            price,
            seller: new mongoose.Types.ObjectId(seller),
            images
        });

        return res.status(201).json({ data: product });
    } catch (err) {
        console.error('Error creating product:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

async function getProducts(req, res) {
    try {
        const { q, minprice, maxprice, skip = 0, limit = 20 } = req.query;
        const filter = {};

        if (q) {
            filter.$text = { $search: q };
        }

        if (minprice) {
            filter['price.amount'] = { ...filter['price.amount'], $gte: Number(minprice) };
        }

        if (maxprice) {
            filter['price.amount'] = { ...filter['price.amount'], $lte: Number(maxprice) };
        }

        const products = await productModel
            .find(filter)
            .skip(Number(skip))
            .limit(Math.min(Number(limit), 20));

        return res.status(200).json({ data: products });
    } catch (err) {
        console.error('Error fetching products:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

async function getProductById(req, res) {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid product id format' });
        }

        const product = await productModel.findById(id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        return res.status(200).json({ data: product });
    } catch (err) {
        console.error('Error fetching product:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

async function getSellerProducts(req, res) {
    try {
        const { skip = 0, limit = 20 } = req.query;
        const products = await productModel
            .find({ seller: req.user.id })
            .skip(Number(skip))
            .limit(Math.min(Number(limit), 20));

        return res.status(200).json({ data: products });
    } catch (err) {
        console.error('Error fetching seller products:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

async function updateProduct(req, res) {
    try {
        const { id } = req.params;
        
        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid product id format' });
        }

        const product = await productModel.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if seller owns the product
        if (product.seller.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to update this product' });
        }

        // Update only allowed fields
        const allowedUpdates = ['title', 'description', 'price'];
        const updates = {};
        for (const field of allowedUpdates) {
            if (field in req.body) {
                if (field === 'price') {
                    updates.price = {
                        amount: Number(req.body.price.amount),
                        currency: req.body.price.currency || 'INR'
                    };
                } else {
                    updates[field] = req.body[field];
                }
            }
        }

        const updatedProduct = await productModel.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true }
        );

        return res.status(200).json({ data: updatedProduct });
    } catch (err) {
        console.error('Error updating product:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

async function deleteProduct(req, res) {
    try {
        const { id } = req.params;
        
        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid product id format' });
        }

        const product = await productModel.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if seller owns the product
        if (product.seller.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to delete this product' });
        }

        await productModel.findByIdAndDelete(id);
        return res.status(200).json({ message: 'Product deleted successfully' });
    } catch (err) {
        console.error('Error deleting product:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    createProduct,
    getProducts,
    getProductById,
    deleteProduct,
    getSellerProducts,
    updateProduct
};