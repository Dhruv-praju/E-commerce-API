const catchAsync = require('../utils/catchAsync')

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

// Process stripe payment   =>  /api/payment/process
module.exports.processPayment = catchAsync(
    async (req, res) => {

        const paymentIntent = await stripe.paymentIntents.create({
            amount: req.body.amount * 100,
            currency: 'inr',
            payment_method_types: ['card'],
            metadata: {integration_check: 'accept_a_payment'}
        })

        res.status(200).json({
            success: true,
            client_secret: paymentIntent.client_secret
        })
    }
)

// Send stripe API Key  =>   /api/payment/stripeapi
module.exports.sendStripeApi = catchAsync(
    async (req, res) =>{
        res.status(200).json({
            stripeApiKey: process.env.STRIPE_API_KEY
        })
    }
)