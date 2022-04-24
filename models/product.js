    const mongoose = require('mongoose')
    const {Schema, model} = mongoose

    const ProductSchema = new Schema({
        name:{    
            type: String,
            required: true
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
        }
    })

    const Product = new model('Product', ProductSchema)

    module.exports = Product