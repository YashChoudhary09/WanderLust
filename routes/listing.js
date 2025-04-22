const express = require("express");
const router = express.Router();
const {isLoggedIn,isOwner} = require("../middleware.js");
// multer
const {storage} = require("../cloudconfig.js");
const multer = require("multer"); //handle the files ,pictures come from frontend
const upload = multer({storage});



// controller folder
const listingController = require("../controllers/listing.js");


// listings routes

// show all listing route
router.get("/showlisting", (listingController.showRoute));

// create new listing form
router.get("/listing/new",isLoggedIn,(listingController.newListingForm));

// create new listing
router.post("/listing",  upload.single("listing[image]"),(listingController.newListing));

// show individual route
router.get("/listing/:id",  (listingController.showListing));


// edit route form
router.get("/listing/:id/edit",isLoggedIn,isOwner,(listingController.editListing));
// update route
router.put("/listing/:id/update",isLoggedIn,isOwner, upload.single("listing[image]"),(listingController.updateListing));
// delete route
router.delete("/listing/:id/delete",isLoggedIn,isOwner,(listingController.deleteListing));


module.exports = router;
