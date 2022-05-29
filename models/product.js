    const mongoose = require('mongoose')
    const {Schema, model} = mongoose

    const ProductSchema = new Schema({
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
        qty:{    
            type: Number,
            required: true
        },
        seller:{
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    })

    const Product = new model('Product', ProductSchema)

    module.exports = Product