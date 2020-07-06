const express = require("express");
const request = require("request");
const https = require("https");
var bodyParser = require("body-parser");
const app = express();
//static folder to get static photos and css file
app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended:true}));




app.get("/",function(req , res){
  res.sendFile(__dirname +"/signup.html");
});




app.post("/",function(req,res){

  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var email = req.body.email;
  console.log(firstName, lastName ,email);
  //create data needed to fed into the mailchimp list
  var data = {
    //members are array of objetcs
    members: [
      {
        email_address: email,
        status : "subscribed",
        merge_fields:{
          FNAME : firstName,
          LNAME : lastName
        }
      }
    ]
  };
//convert to string format
const jsonData = JSON.stringify(data);

//"https://usX.api.mailchimp.com/3.0/lists/{list_id}" x is the number in the api key
const url = "https://us3.api.mailchimp.com/3.0/lists/b1788e261f"

const options = {
  method: "POST",
  auth : "samy:ded28e832e43f21b872f815160096a96-us3"
}

//send data to mailchimp server
const request =  https.request(url,options,function(response){

  if (response.statusCode === 200){
    res.sendFile(__dirname+ "/success.html");
  }
  else {
    res.sendFile(__dirname+ "/failure.html");
  }
  response.on("data",function(data){
  console.log(JSON.parse(data));

});

});
request.write(jsonData);
request.end();
});

app.post("/failure",function(req,res){
  res.redirect("/");
});
//api key
//ded28e832e43f21b872f815160096a96-us3

//list id
//b1788e261f







app.listen(process.env.PORT || 3000 ,function(){

  console.log("listenning on port 3000");
});
