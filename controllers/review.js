let Listing = require("../models/listing.js");
const {listingSchema,reviewSchema} = require("../schema.js"); //joi schema
let Review = require("../models/reviews.js");
const wrapAsync = require("../utils/wrapAsync.js");


// create new review
module.exports.createReview = wrapAsync(async(req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(","); // fecthing all details in error
        return next( new ExpressError(400,errMsg));
    } 
    let listing = await Listing.findById(req.params.id);
    let newReview =  await new Review(req.body.review);
    newReview.author = req.user._id;
     await listing.review.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","new review created!");
    res.redirect(`/listing/${listing._id}`);
});

// delete review
module.exports.destroyReview = wrapAsync(async(req,res,next)=>{
    let{id,reviewId} = req.params;
   
    await Listing.findByIdAndUpdate(id,{$pull:{review:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","review deleted!");
    res.redirect(`/listing/${id}`);
});
