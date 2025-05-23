const express = require("express");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./reviews.js")
const User = require("./user.js");
const { required } = require("joi");

const listingSchema = new Schema({
    title:{
        type:String,
        required:true,
    },
    description:{type:String},
    image:{
        filename:{type:String},
        url:{type:String},
        
    },
    category:{
      type:String,
      enum:["pool","beach","farms","lake","mountain city","doms","camping","trending","others"],
      required:true,
    },
    price:{type:Number},
    location:{type:String},
    country:{type:String},
    review:[{
        type:Schema.Types.ObjectId,
        ref:"Review",
    }],
    owner:{
         type:Schema.Types.ObjectId,
         ref:"User",
    },
  
    geometry:{
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        },
      },
})

// delete review  when listing is deleted(this is auotmatic call when listing deletd route is called)
listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.review}});
    } //with the help of listing id ,review will deleted from that listing id 
})


const Listing = mongoose.model("Listing",listingSchema);
module.exports=Listing;