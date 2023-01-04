const mongoose = require("mongoose");

const express = require('express');
let router = express.Router();
const Artist = require("./ArtistModel");
const Follow = require("./FollowModel");
const Workshop = require("./WorkshopModel");
const Artwork = require("./ArtworkModel");
const Notifs = require("./NotificationModel");

router.get("/profile/:name", serveArtistPage);
router.get("/addworkshop",checkArtistAuth ,serveAddWorkshopPage);
router.get("/addart",serveAddArt);
router.post("/addart",addArt);
router.post("/profile/follow/:name", followArtist);
router.post("/profile/unfollow/:name", unfollowArtist);
router.put("/addworkshop",checkArtistAuth ,addWorkshopToArtist);
router.post("/workshop/:name/adduser",addUserToWorkshop);

router.get("/workshop/:name",serveWorkshopPage);


async function addUserToWorkshop(req,res,next){

    //check if user already registered//show page with workshop
    console.log(req.params.name);
    let workshop =await Workshop.find().where("name").equals(req.params.name);
    console.log(workshop);
    if(workshop[0].users.includes(req.session.username)){
        res.status(400);
        res.send();
        return;
    }
    let test2 = await workshop[0].updateOne({"$push": { "users": req.session.username} });

    
    let test = await Workshop.find().exec();
    console.log(test2);
    console.log(test);

    res.status(200);
    res.send();
}



async function serveArtistPage(req,res,next){
    let allArt = await Artist.find().where("artist").equals(req.params.name).exec();
    let userFollows = await Follow.find().where("user").equals(req.session.username);
    let workshops =  await Workshop.find().where("artist").equals(req.params.name);
    let ifFollowed = true;
    console.log(userFollows);
    //if user already follows artist
    if(userFollows.length!=0){

    if(userFollows[0].followed.includes(req.params.name)){
        ifFollowed =false;
    }
}
    if(req.session.username == req.params.name && req.app.locals.users[req.session.username].artist){
        res.render("./artist.pug",{curUser:true,artworks:allArt,follow:ifFollowed,workshops:workshops});
    }
    else{
        res.render("./artist.pug",{curUser:false,artworks:allArt,follow:ifFollowed,workshops:workshops});
    }
}

function serveAddWorkshopPage(req,res,next){
    let artistName = req.session.username;
    res.status(200);
    res.render("./addWorkshop.pug",{username:artistName});

}

async function serveAddArt(req,res,next){
    res.status(200);
    res.render("./addArtwork.pug",{});
}

async function serveWorkshopPage(req,res,next){
    let usersList= await  Workshop.find().where("name").equals(req.params.name);

    res.status(200);
    res.render("./workshop.pug",{users:usersList[0].users});
}

async function addArt(req,res,next){
    //also change the users object if converted to an artist
    let artObject = {name:req.body.name,artist:req.session.username,year:req.body.year, category:req.body.category,medium:req.body.medium,description:req.body.description,image:req.body.image}
    console.log(artObject);

    let findart = await Artwork.find().where("name").equals(req.body.name).exec();
    if(findart.length>0){
        res.status(400);
        res.send();
        return;
    }

    await Artwork.create(artObject);
    let search = await Artist.find().where("artist").equals(artObject.artist).exec();
    if(search.length==0){
        let artist = await Artist.create({artist:artObject.artist,artwork:artObject.name})
    }
    else{
        await search[0].updateOne({"$push": { "artwork": artObject.name} })
    }

    //let allNotifs = await Notifs.find().where("artist").equals(req.session.username).exec();

    let all = await Notifs.find().exec();

    console.log(all);;
    await Notifs.updateMany({"$push": { "notifs" :`An artwork was added by ${req.session.username}`}}).where("artist").equals(req.session.username);


    all = await Notifs.find().exec();
    console.log(all);

    if(req.app.locals.users[req.session.username].artist ==false){
        req.app.locals.users[req.session.username].artist =!(req.app.locals.users[req.session.username].artist);
        res.status(201);
        console.log(req.app.locals.users)
        res.send();
        return;
    }

    res.status(200);
    res.send();
}

async function addWorkshopToArtist(req,res,next){
    console.log(req.body)
    let artistName = req.session.username;
    let name = req.body.name;
    let age = req.body.age;
    let workshopObject = {name:name,artist:artistName,minAge:age}
    console.log(workshopObject);
    await Workshop.create(workshopObject);
    await Notifs.updateMany({"$push": { "notifs" :`A workshop was added by ${req.session.username}`}}).where("artist").equals(req.session.username);

    res.status(200);
    res.send();

}

async function followArtist(req,res,next){
    let artistName = req.body.artist;

    let search = await Follow.find().where("user").equals(req.session.username).exec();
    if(search.length==0){
        await Follow.create({user: req.session.username,followed:artistName})
    }
    else{
        await search[0].updateOne({"$push": { "followed": artistName} })
    }
    
    await Notifs.create({user:req.session.username, artist:artistName});

    let all = await Notifs.find().exec();

    console.log(all);
    res.status(200);
    res.send();
}

async function unfollowArtist(req,res,next){
    let artistName = req.body.artist;

    let search = await Follow.find().where("user").equals(req.session.username).exec();

    await search[0].updateOne({"$pull": { "followed": artistName} })

    await Notifs.deleteOne().where("user").equals(req.session.username);

    let all = await Notifs.find().exec();

    console.log(all);
    res.status(200);
    res.send();
}

function checkArtistAuth(req, res, next) {
	//check if there a loggedin property set for the session, and
	//if they have admin rights
    let users = req.app.locals.users
	if (!req.session.loggedin || !users[req.session.username].artist) {
		res.status(401).send("Unauthorized");
		return;
	}

	next();
}





module.exports = router;

