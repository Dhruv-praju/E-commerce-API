const cloudinary = require('cloudinary').v2
const Product = require('../models/product')
const ExpressError = require('../utils/ExpressError')
const APIFeatures = require('../utils/ApiFeatures')
const catchAsync = require('../utils/catchAsync')

// Get all products => /api/products
module.exports.getProducts = catchAsync(
    async (req, res)=>{
        // returns all products
        const resPerPage = 6
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
// Get product by ID => /api/products/:id
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
// Create new product => /api/product/new
module.exports.createProduct = catchAsync(
    async (req, res)=>{
        // adds given product
        let new_product = req.body                  // grab data from request
        new_product.seller = req.user
        const added_prod = await Product.create(new_product)       // save that in DB
        
        res.status(200).json({
            success: true,
            message: 'Product created Successfully',
            product: added_prod
        })
    }
) 
// Update product of ID => /api/products/update/:id
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
// Delete product of ID => /api/products/delete/:id
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

// Create new review    =>      /api/products/:id/reviews/new
module.exports.createProductReview = catchAsync(
    async (req, res) => {
        const {id:productId} = req.params
        const {rating, comment} = req.body

        const review = {
            user: req.user,
            name: req.user.name,
            rating: Number(rating),
            comment
        }

        const product = await Product.findById(productId)
        // check if product is reviewed by the user
        const isReviewed = product.reviews?.find(rev => rev.user.toString() == req.user._id.toString() ) 

        if(isReviewed){
            // update the review
            product.reviews.forEach(rev =>{
                if(rev.user.toString() == req.user._id.toString()){
                    rev.comment = comment
                    rev.rating = rating
                }
            })
            
            res.status(200)
        } else {
            // create new review and push it
            product.reviews.push(review)
        }
        // console.log(product);
        product.ratings = await product.getAvgRating()        
        const addedProduct = await product.save()

        res.status(200).json({
            success: true,
        })
    }
)
// Get reviews of a product   =>    /api/products/:id/reviews
module.exports.getProductReviews = catchAsync(
    async (req, res) =>{
        const {id} = req.params
        const product = await Product.findById(id)

        res.status(200).json({
            success: true,
            reviews: product.reviews
        })
    }

)
// Delete product review    =>    /api/products/:prodId/reviews/:id/delete
module.exports.deleteReview = catchAsync(
    async (req, res) => {
        const {prodId, id} = req.params

        const product = await Product.findById(prodId)

        const reviews = product.reviews.filter(rev => rev._id.toString() !== id.toString())

        product.reviews = reviews
        product.ratings = await product.getAvgRating()
        
        await product.save()

        res.status(200).json({
            success: true,
            message: 'Successfully deleted the review'
        })
    }
)