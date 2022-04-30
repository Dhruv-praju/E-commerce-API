/** Helper function that catches errors in async fucntion and passes to Error handler middleware */
function catchAsync(fn){        // it will take an async function which may throw err
    return function(req, res, next){
        fn(req, res, next).catch(err => {
            const {status=500, message='SOMETHING WENT WRONG ON SERVERSIDE !!'} = err
            res.status(status).json({
                message
            })
        })  
    }
}

module.exports = catchAsync