require('dotenv').config()

const connectToDB = require('./db_config')
connectToDB()
const Product = require('./models/product')

const products = require('./shopData')

Product.deleteMany({})
    .then(resp => {
        console.log('DELETED EVERYTHING');
        Product.insertMany(products)
            .then(resp=> console.log('DATA INSERTED SUCCESSFULLY !', resp))
            .catch(err=> console.log('ERROR!!!', err))
    })