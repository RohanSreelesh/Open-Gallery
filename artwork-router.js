const Artwork = require("./ArtworkModel");
const Review = require("./ReviewModel")
const express = require('express');
const LikeModel = require("./LikeModel");
const Artist = require("./ArtistModel")

let router = express.Router();

router.get("/:name", checkLoggedin,serveArtwork);
router.post("/review/:name",checkLoggedin,storeReview);
router.post("/like/:name",checkLoggedin,storeLike);
router.get("/searchcategory/:name",serveSearchCategory);
router.get("/searchmedium/:name",serveSearchMedium);

async function serveArtwork(req,res,next){
    //removes thhe %20 from the string
    let artName = decodeURI(req.params.name)
    let artObject =  await Artwork.find().where("name").equals(artName).exec();
    let reviewObject =  await Review.find().where("artwork").equals(artName).exec();
    let likeObject = await LikeModel.find().where("artwork").equals(artName).exec();
    console.log(likeObject.length);
    res.render("./artwork.pug",{art:artObject , reviews:reviewObject, likes:likeObject.length});
}

async function storeReview(req,res,next){
	let artwork = req.params.name;
    let artist = await Artist.find().where("artist").equals(req.session.username).exec();
	let reviewObject = await Review.find().where("user").equals(req.session.username).where("artwork").equals(artwork).exec();
    let isArtist =true;
    if(artist.length>0){
        let artwork = artist[0].artwork;
        if(artwork.includes(req.params.name)){
            isArtist=false;
        }
    }
    if(reviewObject.length ==0 && isArtist){
        let review = await Review.create({user:req.session.username ,review:req.body.review ,artwork:req.body.artwork });
        res.status(200);
        res.send();
    }
    else if(!isArtist){
        res.status(401);
        res.send();
    }
    else{
        res.status(400);
        res.send();
    }

}

async function storeLike(req,res,next){
    let artwork = req.params.name;
    let likeObject = await LikeModel.find().where("user").equals(req.session.username).where("artwork").equals(artwork).exec();
    let artist = await Artist.find().where("artist").equals(req.session.username).exec();
    let isArtist =true;
    if(artist.length>0){
        let artwork = artist[0].artwork;
        if(artwork.includes(req.params.name)){
            isArtist=false;
        }
    }
    if(likeObject.length ==0 && isArtist){
        let like = await LikeModel.create({user:req.session.username  ,artwork:req.body.artwork })
        res.status(200);
        res.send();
    }
    else if(!isArtist){
        res.status(401);
        res.send();
    }
    else{
        res.status(400);
        res.send();
    }


}

async function serveSearchCategory(req,res,next){
    //console.log(req.body);
	let category = req.params.name;

	let regexCategory = new RegExp(`${category}`, "g");
    let searchResult =  await Artwork.find()
						.where("category").equals(regexCategory).exec();
	console.log(searchResult);
    res.status(200);
	res.render("./searchResults.pug",{list:searchResult})
}

async function serveSearchMedium(req,res,next){
    //console.log(req.body);
	let medium = req.params.name;

	let regexMedium = new RegExp(`${medium}`, "g");
    let searchResult =  await Artwork.find()
						.where("medium").equals(regexMedium).exec();
	console.log(searchResult);
    res.status(200);
	res.render("./searchResults.pug",{list:searchResult})
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