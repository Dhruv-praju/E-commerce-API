const mongoose = require('mongoose')
const {Schema, model} = mongoose

const orderSchema = new Schema({
    createdAt: {
        type: Date,
        default: new Date()
    },
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    orderItems:[{
        product: {type: Schema.Types.ObjectId, ref: 'Product', autopopulate: true},
        qty: Number
    }],
    paymentInfo:{
        mode:{
            type: String,
            required: true
        },
        status:{
            type: String,
            enum: ['paid','unpaid'],
            required: true
        },
        paidAt: Date
    },
    shipmentInfo:{
        source:{
            type: String,
            // required: true
        },
        destination:{
            address:{
                type: String,
                required: true
            },
            city:{
                type: String,
                required: true
            },
            pincode:{
                type: Number,
                required: true
            }
        },
        deliveredAt:{
            type: Date,
            // default: new Date()
        },
        status:{
            type: String,
            enum: ['delivered', 'pending'],
            default: 'pending'
        }
    },
    itemPrice: {
        type:Number,
        required: true
    },
    shippingPrice: {
        type: Number,
        required: true
    },
    taxPrice: {
        type: Number,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    }
})

async function calItemPrice(){
    await this.populate({path:'orderItems', populate:'product'})
    let total = 0
    this.orderItems.forEach(item => {
        
        total += item.product.price * item.qty
    })
    return total
}
orderSchema.statics.findByUserId = async function(userId){
    const foundOrder = await this.find({user: userId})
    if(!foundOrder) return null

    return foundOrder
}

orderSchema.plugin(require('mongoose-autopopulate'))

const Order = new model('Order', orderSchema)
module.exports = Order