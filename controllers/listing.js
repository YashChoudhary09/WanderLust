let Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn,isOwner} = require("../middleware.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema,reviewSchema} = require("../schema.js"); //joi schema
const mongoose = require("mongoose");
const sharp = require("sharp");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding'); 
const mapToken = process.env.MAP_TOKEN; // check user authentication to use map services 
const geocodingClient = mbxGeocoding({ accessToken: mapToken});//provide coordinates of locations
// multer
// const {storage} = require("../cloudconfig.js");
// const multer = require("multer");
// const upload = multer({storage});

module.exports.mainRoute = (req,res)=>{
    res.redirect("/showlisting?category=trending");
}

// show all listing
module.exports.showRoute = wrapAsync(async(req,res,next)=>{
    let category = req.query.category;
    let location = req.query.location;
    let listing = await Listing.find({$or:[{category:category},{location:location}]});
  
    if(!listing){
        throw next(new ExpressError(404,"page not found!"));
        
    }

    res.render("./listing/index.ejs",{listing});
    
});

// create new listing form 
module.exports.newListingForm =  wrapAsync((req,res)=>{
    console.log(req.user);
    res.render("./listing/newlisting.ejs");
});

// create new listing
module.exports.newListing =  wrapAsync(async(req,res,next)=>{

   let response =  await geocodingClient.forwardGeocode({ //give coordinates of locations
        query: req.body.listing.location,
        limit: 1,
      }).send();
       
        
        // console.log(response.body.features);
    let newListing =  req.body.listing;
    // console.log(newListing);
    // joi listing validation (schema)
    let {error} = listingSchema.validate({listing:newListing});  // or use listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",");
        return next( new ExpressError(400,errMsg));
    } 
    let creatednewListing =  await new Listing({
            title:newListing.title,
            description:newListing.description,
            image:{url:req.file.path,filename:req.file.filename},
            category:newListing.category,
            price:newListing.price,
            country:newListing.country,
            location:newListing.location.toLowerCase(),
            owner:req.user._id, // by default, passport uses req.user to keep info about user
            geometry:{type:"Point",coordinates:response.body.features[0].geometry.coordinates},
        })
       
      
       console.log(creatednewListing);
        creatednewListing.save();
        req.flash("success","new listing created!");
        res.redirect("/showlisting?category=trending");

});

// show individual listing
module.exports.showListing = wrapAsync(async(req,res)=>{
 
    let {id} = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return new ExpressError(400, "Invalid ID format!");
 }
    let listing = await Listing.findById(id).populate({path:"review",populate:{path:"author"}}).populate("owner");
     if(!listing){
         req.flash("error","listing which you requested for does not exits!");
         // throw new ExpressError(404,"page not found!")
         res.redirect("/showlisting");
     }
    res.render("./listing/show.ejs",{listing});
   
    
 });

//  edit listing
module.exports.editListing = wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","listing which you requested for does not exits!");
        // throw new ExpressError(404,"page not found!")
        res.redirect("/showlisting");
    }

    let originalUrl = listing.image.url;
    originalUrl = originalUrl.replace("/upload","/upload/w_250"); //cloudinary docs of image transformation
    res.render("./listing/edit.ejs",{listing,originalUrl});
});


// update listing
module.exports.updateListing =  wrapAsync(async(req,res,next)=>{   
  let{id} = req.params;
//   let result = req.body.listing;
//   console.log(result);
  let {error} = listingSchema.validate(req.body);
  if(error){
      let errMsg = error.details.map((el)=> el.message).join(","); // fecthing all details in error
      return next( new ExpressError(400,errMsg));
  } 

   await Listing.findByIdAndUpdate(id,{
    title:req.body.listing.title,
    description:req.body.listing.description,
    // image:{url:req.file.path,filename:req.file.filename},
    price:req.body.listing.price,
    country:req.body.listing.country,
    location:req.body.listing.location,
   });
  
   
   
   if(typeof req.file !== "undefined"){
    const listing = await Listing.findById(id);
    listing.image.url = req.file.path;
    listing.image.filename = req.file.filename;
    await listing.save();
   }
 
   req.flash("success","listing upadted!");
  res.redirect(`/listing/${id}`);

});

// delete listing
module.exports.deleteListing = wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","listing deleted!");
    res.redirect("/showlisting");
});
