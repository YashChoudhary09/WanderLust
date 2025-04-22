const Listing = require("./models/listing.js");
const Review = require("./models/reviews.js");



module.exports.isLoggedIn = (req,res,next) =>{
console.log(req.originalUrl);
   if(!req.isAuthenticated()){
      req.session.redirectUrl = req.originalUrl; // save the original url in res.session
    req.flash("error","you must be logged in !")
    return res.redirect("/login");
   }
   next();
}

module.exports.saveredirectUrl = (req,res,next)=>{
   if(req.session.redirectUrl){
      res.locals.redirectUrl = req.session.redirectUrl;
   }
   next();
}

// authorization 
module.exports.isOwner = async(req,res,next) =>{
    let {id} = req.params;
       let listing = await Listing.findById(id);
   if(!res.locals.currUser._id.equals(listing.owner._id)){
      req.flash("error","you are not the owner of this listing!");
      return res.redirect(`/listing/${id}`);
   }
  next();
}

// review authorization
module.exports.isreviewAuthor = async(req,res,next) =>{
   let {id,reviewId} = req.params;
      let review  = await Review.findById(reviewId);
  if(!res.locals.currUser._id.equals(review.author._id)){
     req.flash("error","you are not the owner of this review!");
     return res.redirect(`/listing/${id}`);
  }
 next();
}