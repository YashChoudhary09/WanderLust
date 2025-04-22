if(process.env.NODE_ENV != "production" ){
  require("dotenv").config(); // require dotenv to access env folder anywhere 
}


const express = require("express");
const app = express();
const mongoose = require("mongoose");
let Listing = require("./models/listing.js");
const path = require("path");
const methodoverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const localstrategy = require("passport-local");
const User = require("./models/user.js");

// connect atlas db
const dbUrl = process.env.ATLASDB_URL;
// mongo session
const MongoStore = require("connect-mongo");
const store = MongoStore.create({
  mongoUrl:dbUrl,
  crypto:{
    secret:process.env.SECRET,
  },
  touchAfter:24*3600,
})
store.on("error",()=>{
  console.log(err);
})

const sessionOptions ={
  store,
  secret:process.env.SECRET,
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge:7 * 24 * 60 * 60 * 1000,
    httpOnly:true,
  }
}

// session used
app.use(session(sessionOptions));
// flash used
app.use(flash());

// passport middlewares
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localstrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// flash middleware
app.use(async(req,res,next)=>{
  res.locals.successMsg = req.flash("success"); //making local response to be flash 
  res.locals.errorMsg = req.flash("error"); //making local response to be flash for error 
  res.locals.currUser = req.user;//making current user details for login or logout in ejs 
  next();
})
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");


const favicon = require("serve-favicon");
// serve favicon middleware
app.use(favicon(path.join(__dirname,"public","favicon.ico")));


// const { error } = require("console");
app.use(express.urlencoded({extended:true}));
app.use(methodoverride("_method"));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"view"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"public")));
main().then(()=>{console.log("db is connected!")}).catch(err => console.log(err));
async function main() {
  await mongoose.connect(dbUrl);
}


// validateListing function with joi
// const validateListing = (req,res,next)=>{
//     let {error} = listingSchema.validate(req.body);
//     if(error){
//         let errMsg = error.details.map((el)=> el.message).join(",");
//         return new ExpressError(400,errMsg);
//     } else{
//         next();
//     }
// }

// all route in routes folder
app.use("/",listingRouter);
// all review routes from review.js
app.use("/",reviewRouter)
// signup for user
app.use("/",userRouter);





app.all("*",(req,res,next)=>{
   next(new ExpressError(404,"page not found!"));
})
// error handler
app.use((err,req,res,next)=>{
    console.log(`page not found url:${req.url}`);
   if(res.headersSent){
    return next(err);
   }
  
    let{status = 500 , message = "something Went Wrong!"} = err ;
    res.render("err.ejs",{message});
   
  
})

app.listen(8080,()=>{console.log("app is listening to port 8080")});

