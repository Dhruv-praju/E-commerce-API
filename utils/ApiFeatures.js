/** Helper class that will be used to search, filter products based on parameters passed while calling API  */
class APIFeatures{
    constructor(query, queryStr){
        this.query = query      // DATABASE query
        this.queryStr = queryStr    // URL query
    }
    //Get products ==> /api/products?keyword=apple
    search(){
        const { keyword } = this.queryStr
        const options = keyword ? {
            // search product by its name
            name:{
                $regex: keyword,
                $options: 'i'
            }
        } : {}

        // modify the DB query and return it
        this.query = this.query.find({...options})

        return this
    }

    // Get products ==> /api/products?keyword=apple&category=Grocery
    // Get products ==> /api/products?price[gte]=100&price[lte]=2000
    // Get products ==> /api/products?category=Grocery&price[lte]=200
    // Get products ==> /api/products?stock[lte]=5
    filter(){
        const { category, price, stock } = this.queryStr
        let queryCopy = {...this.queryStr}

        // Removing field from query string
        const removeFields = ['keyword', 'limit', 'page']
        removeFields.forEach(el => delete queryCopy[el])

        // Advance filter for price, rating, etc (for given range)
        if(price || stock){
            let queryString = JSON.stringify(queryCopy)
            const pattern = /(gte|gt|lte|lt)/g
            queryString = queryString.replace(pattern, match => `$${match}`)
    
            queryCopy = JSON.parse(queryString)
        }

        this.query = this.query.find({...queryCopy})

        return this 
    }

    pagination(resPerPage){
        // to display only certain no of products in a page
        // Get products ==> /api/products?page=2
        const currentPage = Number(this.queryStr.page) || 1
        const skip = resPerPage * (currentPage - 1)
        
        this.query = this.query.skip(skip).limit(resPerPage)
        return this
    }
}

module.exports = APIFeatures