if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const cloudinary = require('cloudinary').v2
const connectToDB = require('./db_config')
const cookieParser = require('cookie-parser')

const productRoutes = require('./routes/products')
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')
const orderRoutes = require('./routes/orders')

// cloudinary configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
  });


app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cors())
app.use(cookieParser())
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