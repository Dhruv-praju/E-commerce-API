const cloudDbUrl = process.env.CLOUD_DB_URL
const mongoose = require('mongoose')

const connectToDB = async ()=>{
    try {
        const resp = await mongoose.connect(cloudDbUrl, {useNewUrlParser: true, useUnifiedTopology: true})
        console.log('Database connected');
    } catch (error) {
        console.log('Error', error);        
    }
}

// const db = mongoose.connection;
// db.on("error", console.error.bind(console, "connection error:"));
// db.once("open", () => {
//     console.log("Database connected");
// });

module.exports = connectToDB