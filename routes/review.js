const express = require("express");
const router = express.Router();
const { isLoggedIn ,isreviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/review.js");

// review routes
//post  review route
router.post("/listing/:id/review",isLoggedIn, (reviewController.createReview));
// delete review route
router.delete("/listing/:id/review/:reviewId",isLoggedIn,isreviewAuthor,(reviewController.destroyReview));


module.exports = router;