var express               = require("express"),
    mongoose              = require("mongoose"),
    passport              = require("passport"),
    bodyParser           = require("body-parser"),
    User                  = require("./models/user"),
    LocalStrategy        = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose");

mongoose.connect("mongodb://localhost/auth_demo_app");
var app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(require("express-session")({
    secret: "Just exploring the beautiful desert!DUH!!",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

//The below method User.authenticate is coming from UserSchema.plugin()
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ================
// ROUTES
// ================
app.get("/", function(re, res){
    res.render("home");
});

app.get("/secret", isLoggedIn, function(req, res){
    res.render("secret");
});

//Auth Routes

//Show signup form
app.get("/register", function(req, res){
    res.render("register");
});

//Handling user sign up form
app.post("/register", function(req, res){
    req.body.username;
    req.body.password;
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render('register');
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/secret");
        });
    });
});

//LOGIN ROUTES
//Render login form
app.get("/login", function(req,res){
    res.render("login");
});

//Login logic
//The below logic is called middleware which runs before final route
app.post("/login", passport.authenticate("local", {
    successRedirect: "/secret",
    failureRedirect: "/login"
}) ,function(req, res){
});

app.get("/logout", function(req, res){
     req.logout();
     req.redirect("/");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redierct("/login");
}


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("server started...........");
});

