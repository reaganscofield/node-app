var express = require("express");
var app = express();
var mongoose = require("mongoose");
var path = require("path");
var bodyParser = require("body-parser");
var methodOveride = require("method-override");

//APP CONFIGURATIONS
// use body parser
app.use(bodyParser.urlencoded({extended: true}));
// setting templte for html
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
//use config method
app.use(methodOveride("_method"));



//setting up databases 
mongoose.connect("mongodb://localhost/dogsblogs");
//setting up Model Schema for databases 
var dataSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {
        type: Date,
        default: Date.now
    }
});
var Blog = mongoose.model("Blog", dataSchema);




//RESTFULL ROUTER
// Main Router knows as Index
app.get("/", function(request, response){
    response.render("index");
});

// Blogs Rooter with all Posted data
app.get("/index", function(request, response){
    //fetching data with var Blog which was defined in Schema Model
    Blog.find({}, function(err, blogs){
        if(err){
            console.log(err);
        }else {
            response.render("index", {blogs: blogs}          
        );
        }
    });   
});

//Form Router 
app.get("/new", function(request, response){
    response.render("new");
});

//post router
app.post("/index", function(request, response){
    Blog.create(request.body.blog, function(err, newBlog){
        if(err){
            response.render("new");
        } else {
            response.render("new");
        }
    });
});

//Router with an ID FOR READ MORE
app.get("/blogs/:id", function(request, response){
    Blog.findById(request.params.id, function(err, foundBlog){
        if(err){
            response.redirect("/index");
        } else{
            response.render("show", {blog: foundBlog});
        }
    });
});


//Router with an ID EDIT ROUTER
app.get("/index/:id/edit", function(request, response){
    Blog.findById(request.params.id, function(err, foundBlog){
        if(err){
            response.redirect("/index");
        } else{
            response.render("edit", {blog: foundBlog});
        }
    });
});

//Router with an ID Update ROUTER
app.put("/index/:id", function(request, response){
    Blog.findByIdAndUpdate(request.params.id, request.body.blog, function(err, updateBlog){
        if(err){
            response.render("/index");
        } else{
            response.redirect("/index/" + request.params.id);
        }
    });
});



//Router with an ID Delete Router
app.delete("/index/:id", function(request, response){
    Blog.findByIdAndRemove(request.params.id, function(err){
        if(err){
            response.redirect("/index");
        } else {
            response.redirect("/index");
        }
    });
});














app.listen(3001, function(){
    console.log("the server is running on port 3001 localhost");
  });


//its was just a demostration to create a blogs
// Blog.create({
//     title: "Chouchou Twins",
//     image: "https://static.pexels.com/photos/416196/pexels-photo-416196.jpeg",
//     body: "To add this npm package to your local machine, type the above into your command line. "
// });
