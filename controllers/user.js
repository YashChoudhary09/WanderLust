const wrapAsync = require("../utils/wrapAsync");
const User = require("../models/user.js");


// render signup fprm
module.exports.rendersignUp = (req,res)=>{
    res.render("user/signup.ejs");
};

// signup
module.exports.signUp = wrapAsync(async(req,res)=>{
    try{
     let {username,email,password} = req.body;
    const newUser = await new User({username,email});
    const registerdUser = await User.register(newUser,password);//automatic save to db with hash password
    console.log(registerdUser);
    req.login(registerdUser,(err)=>{ //after signup automatic got login
     if(err){
         return next(err);
     }
     req.flash("success","you are successfully registered!")
    res.redirect("/showlisting?category=trending");
    })
    } catch(e){
     req.flash("error",e.message);
     res.redirect("/signUp");
    }
 });

//  login form
module.exports.renderlogin = (req,res)=>{
    res.render("user/login.ejs");
};

//  login
module.exports.login = async(req,res)=>{
    req.flash("success","welcome back to WanderLust!");
    let redirectUrl = res.locals.redirectUrl || "/showlisting?category=trending";
    res.redirect(redirectUrl);
};
// logout
module.exports.logout = (req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","you are successfully logout!")
        res.redirect("/showlisting?category=trending");
    })
};
 
// privacy
module.exports.privacyForm = (req,res)=>{
    res.render("user/privacy");
}
// terms and condtions
module.exports.termAndconditions = (req,res)=>{
    res.render("user/termAndcondition.ejs");
}