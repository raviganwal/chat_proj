const express = require('express');
const mongoose = require('mongoose');
const crypto = require('crypto');
const bodyParser = require('body-parser')
const app = express();
const port = 3000

// create application/json parser
// var jsonParser = bodyParser.json()
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/chatDb', { useNewUrlParser: true, useUnifiedTopology: true });

// When successfully connected
mongoose.connection.on('connected', function () {
    console.log('Mongoose default connection open to ' + 'mongodb://localhost:27017/chatDb');
});

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: {
        type: String,
        lowercase: true,
        required: true,
    },
    password: {type:String, required:true,select: false},
});

const User = mongoose.model("User", userSchema)


// const user =new User({
//     username:'admin',
//     email:"admin@gmail.com",
//     password:"#AsxIus09--+_33nasdijsd"
// });
// user.save();

const chatSchema = new mongoose.Schema({
    username: String,
    message: String,
});

const Chat = mongoose.model("Chat", chatSchema);


// const chat =Chat({
// username:"admin",
// message:"Default message from "
// });
// chat.save();

// User.find(function(err, users){
//     console.log(users);
// });


// Chat.find(function(err, users){
//     console.log(users);
// });


app.get('/users', function (req, res) {
    User.find(function (err, users) {
        if (users.length > 0)
            return res.send({ "status": "true", "result": users });
        else
            return res.send({ "status": "false", "error": "No Data found!" });
    }).select(['-__v']);
})

app.post('/users', function (req, res) {
    console.log("MY_PARAMS "+req.body.password);
    // console.log("MY_PARAMS "+JSON.stringify(req.body.password));
    let salt = crypto.randomBytes(16).toString('base64');
    let hash = crypto.createHmac('sha512', salt)
        .update(req.body.password)
        .digest("base64");
    req.body.password = salt + "$" + hash;
    const newuser=new User(req.body);
    newuser.save().then((result) => {
        var obj = result.toObject();
        delete obj.password;
        delete obj.__v;
        res.status(201).send(obj);
    });
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})