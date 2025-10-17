const productModel = require('../models/product.model');
const { uploadImage } = require('../services/imagekit.service');
const mongoose = require('mongoose');


async function createProduct( req,res){
    try{
        const {title, description, priceAmount, priceCurrency = 'INR'} = req.body
        const seller = req.user.id;


        const price = {
            amount: Number(priceAmount),
            currency: priceCurrency
        };


        const images = [];
        for (const file of (req.files || [])){
            const uploaded = await uploadImage({
                buffer: file.buffer, filename: file.originalname
            });
            images.push(uploaded)
        }

        const product = await productModel.create({ title, description, price, seller: new mongoose.Types.ObjectId(seller), images });
        return res.status(201).json({
            success: true,
            product
        });
    } catch(err){
        return res.status(500).json({
            message: 'Internal server error'
        })
    }
}

async function getProducts(req, res) {

    const { q, minprice, maxprice, skip = 0, limit = 20 } = req.query;


    const filter = {}

    if (q) {
        filter.$text = { $search: q }
    }

    if (minprice) {
        filter[ 'price.amount' ] = { ...filter[ 'price.amount' ], $gte: Number(minprice) }
    }

    if (maxprice) {
        filter[ 'price.amount' ] = { ...filter[ 'price.amount' ], $lte: Number(maxprice) }
    }

    const products = await productModel.find(filter).skip(Number(skip)).limit(Math.min(Number(limit), 20));

    return res.status(200).json({ data: products });


}

async function getProductById(req, res) {
    const { id } = req.params;

    const product = await productModel.findById(id);

    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }

    return res.status(200).json({ product: product });
}

module.exports = {
    createProduct,
    getProducts,
    getProductById
}