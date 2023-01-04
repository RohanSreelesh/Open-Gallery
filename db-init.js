
//some code was taken from t9 demo and lecture examples


const Artwork = require("./ArtworkModel")
const Artist = require("./ArtistModel")
const mongoose = require('mongoose');
let artworks = require("./gallery.json");
//console.log(artworks);



async function connect (){
    await mongoose.connect('mongodb://127.0.0.1/2406');
    await db.dropDatabase();
    let artworksAdded = await Artwork.create(artworks);
    for(let i=0;i<artworksAdded.length;i++){
        let search = await Artist.find().where("artist").equals(artworksAdded[i].artist).exec();
        if(search.length==0){
            let artist = await Artist.create({artist:artworksAdded[i].artist,artwork:artworksAdded[i].name})
        }
        else{
            await search[0].updateOne({"$push": { "artwork": artworksAdded[i].name} })
        }
    }
     console.log("Connected to 2406 database.");
};

//Get the default Mongoose connection (can then be shared across multiple files)
let db = mongoose.connection;
//We register events to listen to that connection
db.on('error', console.error.bind(console, 'connection error:'));

//db.once('open', async () => {
//We're connected
    //await db.once('open')
    connect().then((result) => {
        console.log("Intialized database now disconnect");
        mongoose.connection.close();
    })
    .catch(err => console.log(err));;;

    //We could execute other commands in here
    //We could also just start our server
//});

