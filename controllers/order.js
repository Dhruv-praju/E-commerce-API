const catchAsync = require("../utils/catchAsync");
const Order = require('../models/order');
const Product = require('../models/product')
const ExpressError = require("../utils/ExpressError");

// Creates order   =>   /api/orders/new
module.exports.makeOrder = catchAsync(
    async(req, res) => {
        const {
            orderItems,
            paymentInfo,
            shipmentInfo,
            itemsPrice,
            shippingPrice,
            taxPrice,
            totalPrice

        }   = req.body

        // make order object
        const order = new Order({
            orderItems,
            paymentInfo,
            shipmentInfo,
            itemsPrice,
            shippingPrice,
            taxPrice,
            totalPrice
        })
        // add other details to it
        if (order.paymentInfo.status === 'paid') order.paymentInfo.paidAt = new Date()
        order.user = req.user._id

        // save to DB
        const createdOrder = await order.save()

        res.status(200).json({
            success:true,
            order:createdOrder
        })
    }
)

// Get single order  =>    /api/orders/:id
module.exports.getOrderById = catchAsync(
    async (req, res) => {
        const {id} = req.params
        const order = await Order.findById(id)

        if(!order) throw new ExpressError(404, 'No Order found with this ID')

        res.status(200).json({
            success: true,
            order
        })
    }
)

// Get orders of currently loggedIn user    =>  /api/orders/me
module.exports.getMyOrders = catchAsync(
    async (req, res) => {
        const {_id: userId} = req.user
        console.log('MY ORDERS',req.user)
        const orders = await Order.findByUserId(userId)

        res.status(200).json({
            success: true,
            orders
        })
    }
)

// Get all Orders   =>   /api/orders/all
module.exports.getAllOrders = catchAsync(
    async (req, res) => {
        const orders = await Order.find({})
        const totalOrders = await Order.countDocuments()

        let totalAmount = 0
        orders.forEach(order => {
            totalAmount += order.totalPrice
        })

        res.status(200).json({
            success: true,
            totalOrders,
            totalAmount,
            orders
        })
    }   
) 

// Update shipping and payment status of order  =>    /api/orders/:id  
module.exports.updateOrder = catchAsync(
    async (req, res) => {
        const {id} = req.params
        const order = await Order.findById(id)

        const {shipmentInfo, paymentInfo} = order
        // change shipping status
        if(shipmentInfo.status==='delivered') 
        throw new ExpressError(404, 'You have already delivered this order') 
        
        // reduce the stock of product after delivered
        order.orderItems.forEach(async item => {
            await updateStock(item.product._id, item.qty)
        })

        // change payment & shippement status
        shipmentInfo.status = 'delivered'

        if(paymentInfo.status !== 'paid'){
            paymentInfo.status = 'paid'
            paymentInfo.paidAt = new Date()
        }

        shipmentInfo.deliveredAt = new Date()

        await order.save()

        res.status(200).json({
            success: true
        })
    }
)

async function updateStock(id, qty){
    let product = await Product.findById(id)
    product.stock = product.stock - qty
    await product.save()
}

// Delete order     =>      /api/orders/delete/:id
module.exports.deleteOrder = catchAsync(
    async (req, res) =>{
        const {id} = req.params
        const order = await Order.findByIdAndDelete(id)

        if(!order) throw new ExpressError(404, 'No Order found with this ID')

        res.status(200).json({
            success: true,
            message: 'Order deleted successfully'
        })
    }
)