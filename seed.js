require('dotenv').config()

const connectToDB = require('./db_config')
connectToDB()
const Product = require('./models/product')

const products = [
    {name:'Watch', description:'Lorm Ipsm oasnasofd', price: 342, qty: 12},
    {name:'Pie', description:'Lorm Ipsm oasnasofd', price: 32, qty: 10},
    {name:'Cake', description:'Lorm Ipsm oasnasofd', price: 24, qty: 2},
    {name:'Apple', description:'Lorm Ipsm oasnasofd', price: 82, qty: 5},
    {name:'Speaker', description:'Lorm Ipsm oasnasofd', price: 112, qty: 1}
]
Product.deleteMany({})
    .then(resp => {
        console.log('DELETED EVERYTHING');
        Product.insertMany(products)
            .then(resp=> console.log('DATA INSERTED SUCCESSFULLY !', resp))
            .catch(err=> console.log('ERROR!!!', err))
    })