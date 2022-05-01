const Product = require('../models/product')
const ExpressError = require('../utils/ExpressError')
const APIFeatures = require('../utils/ApiFeatures')
const catchAsync = require('../utils/catchAsync')

module.exports.getProducts = catchAsync(
    async (req, res)=>{
        // returns all products
        const resPerPage = 3
        const productCount = await Product.countDocuments() // total no of documents in product collection
        
        //Get products ==> /api/products?keyword=apple
        // console.log(req.query);
        const apiFeature = new APIFeatures(Product.find(), req.query)
                                .search()
                                .filter()
                                .pagination(resPerPage)

        const products = await apiFeature.query
         
        res.status(200).json({
            success: true,
            totalProducts: productCount,
            count: products.length,
            products
        })  
    }

) 
module.exports.getSpecificProduct = catchAsync(
    async (req, res)=>{
       // returns product with given id
        const { id:product_id } = req.params        
        
        const product = await Product.findById(product_id)    
        if(!product) throw new ExpressError(404,'Product not found')
        res.status(200).json({
            success: true,
            product        
        })    

   }
) 
module.exports.createProduct = catchAsync(
    async (req, res)=>{
        // adds given product
        let new_product = req.body                  // grab data from request
        const added_prod = await Product.create(new_product)       // save that in DB
        res.status(200).json({
            success: true,
            message: 'Product created Successfully',
            product: added_prod
        })
    }
) 
module.exports.updateProduct = catchAsync(    
    async (req, res)=>{
        // updates specific product
        const {id} = req.params
        const updted_product = await Product.findByIdAndUpdate(id, req.body, {runValidators:true, new:true})
        if(!updted_product) throw new ExpressError(404,'Product not found')
        res.status(200).json({
            success: true,
            message: 'Product updated Successfully',
            product: updted_product
        })

    }
) 
module.exports.deleteProduct = catchAsync(    
    async (req, res)=>{
        // deletes specific product
        const {id} = req.params
        const dtd_product = await Product.findByIdAndDelete(id)
        if(!dtd_product) throw new ExpressError(404, "Producted doesn't exist")
        res.status(200).json({
            success: true,
            message: 'Product deleted Successfully',
            product: dtd_product
        })
    }
) 