const Product = require('../models/product')
const ExpressError = require('../utils/ExpressError')
const APIFeatures = require('../utils/ApiFeatures')

module.exports.getProducts = async (req, res)=>{
    // returns all products
    //Get products ==> /api/products?keyword=apple
    try {
        // console.log(req.query);
        const apiFeature = new APIFeatures(Product.find(), req.query).search().filter()

        const products = await apiFeature.query
         
        res.status(200).json({
            success: true,
            count: products.length,
            products
        })  

    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}
module.exports.getSpecificProduct =  async (req, res)=>{
    // returns product with given id
    try {
        const { id:product_id } = req.params        
        
        const product = await Product.findById(product_id)    
        if(!product) throw new ExpressError(404,'Product not found')
        res.status(200).json({
            success: true,
            product        
        })    

    } catch (err) {
        res.status(err.status||500).json({
            message:err.message
        })
    }
}
module.exports.createProduct = async (req, res)=>{
    // adds given product
    try {
        let new_product = req.body                  // grab data from request
        const added_prod = await Product.create(new_product)       // save that in DB
        res.status(200).json({
            success: true,
            message: 'Product created Successfully',
            product: added_prod
        })

    } catch (err) {
        res.status(500).json({
            message:err.message
        })
    }
}
module.exports.updateProduct = async (req, res)=>{
    // updates specific product
    try {
        const {id} = req.params
        const updted_product = await Product.findByIdAndUpdate(id, req.body, {runValidators:true, new:true})
        if(!updted_product) throw new ExpressError(404,'Product not found')
        res.status(200).json({
            success: true,
            message: 'Product updated Successfully',
            product: updted_product
        })

    } catch (err) {
        res.status(err.status||500).json({
            message:err.message
        })
    }
}
module.exports.deleteProduct = async (req, res)=>{
    // deletes specific product
    try {
        const {id} = req.params
        const dtd_product = await Product.findByIdAndDelete(id)
        if(!dtd_product) throw new ExpressError(404, "Producted doesn't exist")
        res.status(200).json({
            success: true,
            message: 'Product deleted Successfully',
            product: dtd_product
        })

    } catch (err) {
        res.status(err.status||500).json({
            message: err.message
        })
    }
}