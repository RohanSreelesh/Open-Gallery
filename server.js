
//some code was taken from t9 demo and lecture examples

const express = require('express');
const session = require('express-session');
const morgan = require("morgan");
const pug = require("pug");
const app = express();
const fs = require("fs");
const Artwork = require("./ArtworkModel")
const Review = require("./ReviewModel")
const Like = require("./LikeModel")
//connect db
const mongoose = require('mongoose');
async function connect (){
	await mongoose.connect('mongodb://127.0.0.1/2406')
	
}

connect().then((result) => {
	console.log("Connected to database");
})
.catch(err => console.log(err));;

let db = mongoose.connection;


let users = {
	"fox": { password: "123", artist: false, age:99, },
	"box": { password: "123", artist: true, age:99, },
};

app.locals.users = users;

//from express docs
app.use(morgan('dev'));

app.use(session({ 
	secret: 'some secret here', 
	//cookie: {maxAge:50000},  //the cookie will expire in 50 seconds
	resave: true,
	saveUninitialized: true
  })); 

  //set pug
app.set("view engine"," pug");
//set views directory
app.set("views","./views");
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/",serveLoginPage);
app.get("/login",serveLoginPage);
app.get("/register",serveRegisterPage);
app.get("/admin", auth, admin); 
app.post("/login", login);   
app.post("/register",registerUser);
app.get("/logout", logout);  

//search
app.get("/search",checkLoggedin,serveSearchPage)
app.post("/search/:id",handleSearch)

app.get("/allartworks",checkLoggedin,serveAllArt)

let artworkRouter = require("./artwork-router");
let userRouter = require("./user-router");
let artistRouter = require("./artist-router");
app.use("/artwork", artworkRouter);
app.use("/user", userRouter);
app.use("/artist", artistRouter);




function serveLoginPage(req,res, next){
    res.render("./login.pug",{});
}

function serveRegisterPage(req, res,next){
	//console.log(req.body)
	res.render("./register.pug",{duplicateUser: false});
}

function serveSearchPage(req,res,next){
	res.render("./search.pug",{});
}

async function serveAllArt(req,res,next){
	let allart = await Artwork.find().exec();
	res.render("./allart.pug",{list:allart});
}

//post req
async function handleSearch(req, res,next){
	//code taken from my a3 submission
	//search in mongo database
	console.log(req.body);
	let name = req.body.artname;
	let Artistname = req.body.artistname;
	let category = req.body.artistcategory;

	let regexArtName = new RegExp(`${name}`, "g");
	let regexArtistName = new RegExp(`${Artistname}`, "g");
	let regexCategory = new RegExp(`${category}`, "g");
    let searchResult =  await Artwork.find()
						.where("name").equals(regexArtName)
						.where("artist").equals(regexArtistName)
						.where("category").equals(regexCategory).exec();

	console.log(searchResult);

	res.render("./searchResults.pug",{page:req.params.id, list:searchResult})
      

}
function registerUser(req, res,next){
	console.log(req.body)
	if(users.hasOwnProperty(req.body.username)){
		res.render("./register.pug",{duplicateUser: true});
	}
	else{
		users[`${req.body.username}`] = {password: `${req.body.password}`, artist: false, age: `${req.body.age}`}
		console.log(users);
		res.redirect("/login");
		res.status(200);
	}

}

//
function checkLoggedin(req, res, next){
	//check for logged in
	if (!req.session.loggedin) {
		res.status(401).send("Unauthorized");
		return;
	}
	next();
}

//authorization function
function auth(req, res, next) {
	//check if there a loggedin property set for the session, and
	//if they have admin rights
	if (!req.session.loggedin || !users[req.session.username].artist) {
		res.status(401).send("Unauthorized");
		return;
	}

	next();
}

function admin(req, res, next) {
	res.status(200).send("Welcome to the admin page, " + req.session.username);
	return;
}

//If the username and password match somebody in our database,
// then create a new session ID and save it in the database.
//That session ID will be associated with the requesting user
function login(req, res, next) {
	if (req.session.loggedin) {
		res.status(200).send("Already logged in.");
		return;
	}
	req.session.username = req.body.username
	let username = req.body.username;
	let password = req.body.password;

	console.log("Logging in with credentials:");
	console.log("Username: " + req.body.username);
	console.log("Password: " + req.body.password);

	//does the user exist?
	if (!users.hasOwnProperty(req.body.username)) {
		res.status(401).send("Unauthorized"); //you can also send 404 and specify "User not found"
		return;
	}

	//the user exists. Lets authenticate them
	if (users[req.body.username].password === req.body.password) {
		req.session.loggedin = true; // now that particular user session has loggedin value, and it is set to true 

		//We set the username associated with this session
		//On future requests, we KNOW who the user is
		//We can look up their information specifically
		//We can authorize based on who they are
		req.session.username = username; //we keep track of what user this session belongs to
		res.redirect("http://localhost:3000/user");
		res.status(200);
	} else {
		res.status(401).send("Not authorized. Invalid password.");
	}
}

function logout(req, res, next) {
	if (req.session.loggedin) {
		req.session.loggedin = false;
		req.session.username = undefined;
		res.redirect("/login")
		res.status(200);
	} else {
		res.status(200).send("You cannot log out because you aren't logged in.");
	}
}

app.listen(3000);
console.log("Server listening on port 3000");
