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

module.exports = {
    createProduct
}