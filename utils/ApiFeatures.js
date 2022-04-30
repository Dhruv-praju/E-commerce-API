class APIFeatures{
    constructor(query, queryStr){
        this.query = query
        this.queryStr = queryStr
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
}

module.exports = APIFeatures