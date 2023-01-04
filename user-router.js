const mongoose = require("mongoose");

const express = require('express');
const session = require('express-session');
const Review = require("./ReviewModel")
const LikeModel = require("./LikeModel");
const Follow = require("./FollowModel");
const Artwork = require("./ArtworkModel");
const Artist = require("./ArtistModel");
let router = express.Router();
const Notifs = require("./NotificationModel");
const e = require("express");

router.get("/", serveProfilePage);

router.get("/managereview", checkLoggedin,serveManagePage);
router.get("/manageartist",checkLoggedin,serveManageArtistPage);
router.get("/viewnotifs",checkLoggedin,serveNotifPage);
router.post("/switch",checkLoggedin,switchAccountType);

router.put("/removereview/:name", removeReview);
router.put("/removelike/:name", removeLike);


function switchAccountType(req,res,next){
    // console.log(req.app.locals.users);
    // req.app.locals.users[req.session.username].artist =!(req.app.locals.users[req.session.username].artist);
    // console.log(req.app.locals.users);

    if(req.app.locals.users[req.session.username].artist ==true){
        req.app.locals.users[req.session.username].artist =!(req.app.locals.users[req.session.username].artist);
        res.status(200);
    }
    else{
        //res.redirect("http://localhost:3000/artist/addart");
        res.status(201);
    }
    res.send();
}

function serveProfilePage(req,res,next){
    let isArtist = req.app.locals.users[req.session.username].artist;
    console.log(req.app.locals.users);
    console.log("isArtist");
    res.status(200);
	res.render("./user.pug",{user:req.session.username,artist:isArtist})
}

async function serveManagePage(req,res,next){
    let allReviews = await Review.find().where("user").equals(req.session.username).exec();
    let allLikes = await LikeModel.find().where("user").equals(req.session.username).exec();

    res.status(200);
    res.render("./userReviews.pug",{reviews:allReviews, likes:allLikes});
}

async function serveManageArtistPage(req,res,next){
    let allFollows = await Follow.find().where("user").equals(req.session.username).exec();
    console.log(allFollows);
    
    res.render("./manageArtist.pug",{follows:allFollows});
}

async function serveNotifPage(req,res,next){
    let allNotifs = await Notifs.find().where("user").equals(req.session.username);
    console.log(allNotifs);
    res.render("./notification.pug",{list:allNotifs});
}

async function removeReview(req,res,next){

    await Review.deleteOne().where("user").equals(req.session.username).where("artwork").equals(req.params.name).exec();
    res.status(200);
    res.send()
}

async function removeLike(req,res,next){

    await LikeModel.deleteOne().where("user").equals(req.session.username).where("artwork").equals(req.params.name).exec();
    res.status(200);
    res.send()
}

function checkLoggedin(req, res, next){
	//check for logged in
	if (!req.session.loggedin) {
		res.status(401).send("Unauthorized");
		return;
	}
	next();
}



module.exports = router;