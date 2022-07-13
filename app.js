if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const cloudinary = require('cloudinary').v2
const connectToDB = require('./db_config')
const session = require('express-session')

const productRoutes = require('./routes/products')
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')
const orderRoutes = require('./routes/orders')
const paymentRoutes = require('./routes/payments')

const sessionOptions = {
    name:'session',
    resave: false,
    saveUninitialized: false,
    secret : 'mylittlesecret',
    cookie: {
        // domain: 'localhost:2000',
        // sameSite: 'lax',
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRES_TIME * 1000 * 60 * 60 * 24
        ),
        httpOnly: false,
        secure: false
    }
}
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cors({
    origin: process.env.CLIENT_URL ,     // client URL
    credentials: true
}))
app.use(session(sessionOptions))
app.use(morgan('dev'))  // request logs

/**DB Setup */
connectToDB()

/** Middleware */
// app.use((req, res, next)=>{
    
// })

/**API */

app.get('/', (req, res)=>{
    res.send('WELCOME HOME')
})
// Base URL = /api/products
app.use('/api', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/payment', paymentRoutes)

app.listen(8000, (req, res)=>{
    console.log('Server listening at port 8000...');
})
/** Error Handling Middleware */
app.use((err, req, res, next)=>{
    console.log('ERROR OCCURED',err);
    res.json({error:err, message:'From error handling middleware'})
})

/** STATUS CODES
 *  
 * 2xx : OK
 * 3xx : Redirection
 * 4xx : Client errors
 * 5xx : Server errors
 * 
 */

/** COMMONLY USED CODES
 * 
 *  404 : This means page/file that browser is requesting wasn't found by the server.
 *  401 : UnAuthenticated
 *  403 : Unauthorized
 *  500 : This indicates problem with server
 */