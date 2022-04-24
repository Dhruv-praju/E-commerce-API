if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const connectToDB = require('./db_config')

const productRoutes = require('./routes/products')

app.use(express.urlencoded({extended: true}))
app.use(cors())
app.use(morgan('dev'))  // request logs

/**DB Setup */
connectToDB()

/**API */

app.get('/', (req, res)=>{
    res.send('WELCOME HOME')
})
app.use('/products', productRoutes)


app.listen(8000, (req, res)=>{
    console.log('Server listening at port 8000...');
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
 *  500 : This indicates problem with server
 */