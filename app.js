//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
//const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const _ = require("lodash");
const ejs = require("ejs");

const app = express();

app.set('view engine', 'ejs');

app.use(express.static("public"));

app.use(bodyParser.urlencoded({
  extended: true
}));


//connect to mongoose and create a new DB -todolistdb
mongoose.connect("mongodb+srv://Admin:Edenhazard69!@cluster0-b6puq.mongodb.net/todolistDB", {useNewUrlParser: true});

//create a new schema for this new db
const itemsSchema = {
  name:  String
};

//creates a new collection/model off the back of the newly created schema
const Item = mongoose.model("Item", itemsSchema);


const Item1 = new Item({
  name: "Workout"
});

const Item2 = new Item({
  name: "Study"
});

const Item3 = new Item({
  name: "WORKOUTT!"
});

const defaultItems = [Item1, Item2, Item3]

const listSchema = {
  name: String,
  items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);

app.get("/", function(req, res) {

  Item.find({}, function(err, foundItems){

  if (foundItems.length === 0){

    Item.insertMany(defaultItems, function(err){
      if(err){
        console.log(err);
      }else {
        console.log("Successfully added defaultItems");
      }
    });
    res.redirect("/");
  }else {
    res.render("list", {
      listTitle: "Today",
      newListItems: foundItems
    });
  }
  });
});

app.get("/:listName", function (req,res) {

 const newList =  _.capitalize(req.params.listName);

 List.findOne({name: newList}, function (err, foundList ) {
   if (!err){
     if(!foundList){
       const list = new List({
         name: newList,
         items: defaultItems
       });
       list.save();
       res.redirect("/" + newList);
     }else{
       res.render("list", {listTitle: foundList.name, newListItems: foundList.items })
     }
   }
 });
});

app.get("/about", function(req, res) {
  res.render("about");
});


app.post("/", function(req, res) {

  const itemName = req.body.newItem;

  const listName = req.body.list;

  const item = new Item({
    name: itemName
  });
  
  if (listName === "Today"){
    item.save();
    res.redirect("/");
  }else{
    List.findOne({name: listName}, function (err, foundList) {
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName);
    })
  }
});

app.post("/delete", function (req, res) {
  const deletedID = req.body.checkBox;
  const listName  = req.body.listname;

  if (listName === "Today") {
    Item.findByIdAndRemove(deletedID, function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log("successfully deleted ID: " + deletedID);
        res.redirect("/");
      }
    });
  } else {
    List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: deletedID}}}, function (err, foundList ){
      if (!err){
        res.redirect("/" + listName);
      } else{
        console.log(err);
      }
    });
  }
});

let port = process.env.PORT;
if(port == null || port == ""){
  port = 3000;
}

app.listen(port);

app.listen(3000, function() {
  console.log("Server running on port 3000");
});