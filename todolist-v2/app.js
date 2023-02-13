//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.set('strictQuery', false);
mongoose.connect('mongodb://127.0.0.1:27017/todoListDB');
const itemsSchema = mongoose.Schema({
    name : String,
})
const Item = mongoose.model('Item',itemsSchema)
const item = new Item({
   name : "excersize"
})
const item1 = new Item({
  name : "excersize1"
})
const item2 = new Item({
  name : "excersize2"
})
const defaultItem = [item,item1,item2]
const listSchema = {
  name : String,
  items: [itemsSchema]
}
const List = mongoose.model('List', listSchema)
app.get("/", function(req, res) {

Item.find({},function(err,foundItems){
   if(foundItems.length === 0){
    Item.insertMany(defaultItem,function(err){
      if(err){
        console.log(err);
      }
      else{
        console.log("successfully inserted");
      }
  })
   res.redirect("/")
  
  }
   else{  
      res.render("list", {listTitle:"Today", newListItems: foundItems});
   }
})
 
});

app.post("/", function(req, res){

  const itemName = req.body.newItem;
  const item = new Item({name: itemName})
    item.save()
    res.redirect("/")
});
app.post('/delete', function(req,res){
   const checkid = req.body.checkbox;
   Item.findByIdAndRemove(checkid,function(err){
     if(err){
      console.log(err);
     }
     else{
       console.log("successfully deleted");
     }
   })
   res.redirect("/")
})
app.get("/:namework", function(req,res){
   let namework = req.params.namework
   List.findOne({name: namework},function(err,foundList){
        if(!err){
          if(!foundList){
            const list = new List({
              name: namework,
              items :defaultItem
            })
         
            list.save()
            res.redirect("/"+namework)
          }
          else{
             res.render("list",{listTitle:foundList.name, newListItems: foundList.items})
          }
        }
   })
  
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
