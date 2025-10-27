const orderModel = require("../models/order.model");
const axios = require("axios");

async function createOrder(req, res) {
    const user = req.user;
    const token = req.cookies?.token || req.headers?.authorization?.split(' ')[ 1 ];

    try{
        // fetch user cart from cart service

        const cartResponse = await axios.get(`http://localhost:3002/api/cart`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        const products = await Promise.all(cartResponse.data.cart.items.map(async(item)=>{
            return await (axios.get(`https://localhost:3001/api/products/${item.productId}`,{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })).data.data
        }))

        let priceAmount = 0;

        const orderItems = cartResponse.data.cart.items.map((item, index)=>{



            const product = product.find(p => p._id=== item.productId)


            // if product not in stock 
            if( product.stock < item.quantity){
                throw new Error(`Product ${product.name} is out of stock`)
            }

            const itemTotal = product.price * item.quantity;
            priceAmount += itemTotal;

            return {
                productId: item.productId,
                quantity: item.quantity,
                price: {
                    amount:itemTotal,
                    currency: product.price.currency
                }

            }
        })

        const newOrder = new orderModel({
            userId: user._id,
            items: orderItems,
            status:"PENDING",
            totalAmount: {
                amount: priceAmount,
                currency: "INR"
            },
            shippingAddress: req.body.shippingAddress
        })

    }catch(err){
        console.error("Error fetching cart:", err);
        res.status(500).json({
            message: "Internal server error"
        })

    }
    
}
async function getMyOrders(req, res) {
}


module.exports = {
    createOrder
}