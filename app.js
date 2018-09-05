var express = require("express");
var app = express();

var bodyParser = require("body-parser");

var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/yelp_camp",{ useNewUrlParser: true });

app.use(bodyParser.urlencoded({extended:true}));

app.set("view engine","ejs");

//SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
	name : String,
	image : String,
	description : String
});

//DATABASE MODEL
var Campground = mongoose.model("Campground",campgroundSchema);

// Campground.create({name:"Granite Hill",
// 	image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSv9n8b2hjD26vxj1jcjSOQk-rgsxZoAvH6LHeUMen7tGOCH6iOww",
// 	description : "This is a huge granite hill . No bathrooms , no water"
// 	},function(err , campground){
// 	if(err){
// 		console.log("ERROR ALERT!");
// 	}
// 	else{
// 		console.log("New campground created");
// 		console.log(campground);
// 	}
// });

app.get("/",function(req,res){
	res.render("landing");
});

app.get("/campgrounds",function(req,res){
	//get all campgrounds from db
	Campground.find({},function(err, campgrounds){
		if(err){
			console.log("oops error");
			console.log(err);
		}
		else{
			res.render("index",{campgrounds:campgrounds});
		}
	});
});

app.post("/campgrounds",function(req,res){
	var name = req.body.campname;
	var image = req.body.image;
	var desc = req.body.description;	
	var newCampground = {name : name , image : image , description : desc};
	//create a new campground and save to database
	Campground.create(newCampground,function(err,newlyCreated){
		if(err){
			console.log(err);
		}
		else{
			res.redirect("/campgrounds");
		}

	});
});
//New RESTful route
app.get("/campgrounds/new",function(req,res){
	res.render("new.ejs");
});

app.get("/campgrounds/:id",function(req,res){
	Campground.findById(req.params.id,function(err,foundCampground){
		if(err){
			console.log(err);
		}
		else{
			res.render("show",{campground : foundCampground});
		}
	});
});


app.listen(3000, () => console.log('Yelpcamp server has started'));

