const mongoose = require('mongoose')
const {Schema, model} = mongoose

const productSchema = new Schema({
    image:{
        type: String,
        required: true
    },
    name:{    
        type: String,
        required: true
    },
    category:{
        type: String,
        enum:['Clothes', 'Mobiles', 'Computers & Laptops', 'Grocery', 'Accessories'],
        required: true
    },
    company:{
        type: String
    },
    description:{    
        type: String,
        required: true
    },
    price:{    
        type: Number,
        required: true
    },
    stock:{    
        type: Number,
        required: true
    },
    seller:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    ratings:{
        type: Number,
        default:0
    },
    reviews:[
        {   
            user: {type:Schema.Types.ObjectId, ref:'User'},
            name: String,
            rating: Number,
            comment: String
        }
    ]
})

productSchema.methods.getAvgRating = function(){
    
    if(this.reviews.length)
    return this.reviews.reduce((acc, rev)=> rev.rating + acc, 0)/this.reviews.length
    else return 0
}

productSchema.plugin(require('mongoose-autopopulate'))
const Product = new model('Product', productSchema)

module.exports = Product