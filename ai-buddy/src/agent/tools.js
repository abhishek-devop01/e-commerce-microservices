const { tool } = require("@langchain/core/tools")
const { z } = require("zod");
const axios = require("axios");


const searchProduct = tool(async ({query, token})=> {
     const response = await axios.get(`https://localhost:3001/api/products?q=${data.query}`, {
          headers: {
               Authorization: `Bearer ${token}`
          }
     });
     return JSON.stringify(response.data);
}, {
     name: "searchProduct",
     description: "Search for a product in the e-commerce store given a product name or category. Input should be a string representing the product name or category to search for. The output will be a list of matching products with their details.",
     schema: z.object({
          query: z.string().describe("The product name or category to search for")
     })
})

const addProductToCart = tool(async ({productId, qty=1, token})=>{
     const response = await axios.post(`https://localhost:3002/api/cart/items`, {
          productId,
          qty
     }, {
          headers: {
               Authorization: `Bearer ${token}`
          }
     });
     return `Added product with id ${productId} (qty: ${qty}) to cart successfully.`;
}, {
     name: "addProductToCart",
     description: "Add a product to the user's shopping cart given the product ID. Input should be a string representing the product ID. The output will be a confirmation message indicating whether the product was successfully added to the cart.",
     schema: z.object({
          productId: z.string().describe("The ID of the product to add to the cart"),
          qty: z.number().describe("The quantity of the product to add to the cart").default(1)
     })
})


module.exports = {
     searchProduct,
     addProductToCart
}