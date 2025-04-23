const mongoose = require("mongoose");

const Listing = require("../models/listing.js");
const initData = require("./data.js");

main().then(()=>{console.log("db is connected!")}).catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

const  initdb = async()=>{
    await Listing.deleteMany({});
    initData.data =initData.data.map((obj)=>({
       ...obj,
       owner:'67fcccb06c6a96f78655860e',
       category:"trending",
       geometry:{
        type:"Point",
        coordinates:[77.2088,28.6139],
       }
    }));
    await Listing.insertMany(initData.data);
}
initdb();