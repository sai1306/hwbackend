const express = require("express");
const app = express();
const cors = require('cors');
const port = 7000;
const path = require("path"); 
var email = '';  
var userdata = {};
var phone = "";
var user = {};
app.use(express.json());
app.use(cors()); 
app.use(express.urlencoded({ extended: false }));
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
const { MongoClient } = require('mongodb');
const { log } = require("console");

  const uri = 'mongodb://127.0.0.1:27017'; 
var users;
const dbName = 'HitchedWheels';
const collectionName = 'users'; 
app.get('/', async (req, res) => {
    res.send('Server is running!'); 
  });
app.get('/users', async (req, res)=>{
  var data;
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  try {
    await client.connect();
    const database = client.db(dbName);
    const collection = database.collection(collectionName);
    const query = {}; 
    const cursor = collection.find(query);
    data = await cursor.toArray();
    console.log(data);
  }
  catch(err) {
    console.error(err);
    res.status(500).json({error: "Internal Server Error"});
}
  finally {
    await client.close();
  }
  res.send(data);
})
app.post('/', async (req, res)=>{
    console.log(req.body);
    let obj = req.body;
    const client  = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  try{
   await client.connect();
   const database = client.db(dbName);
   const collection = database.collection(collectionName);
   collection.insertOne(obj, (insertErr) => {
    client.close();
    if (insertErr) {
      return res.status(500).send('Error saving user');
    }
    return res.status(201).send('User registered successfully');
  });
   console.log('inserted successfully');
  }
  catch(err){
    console.log(err);
  }
})

app.post('/rides', async (req, res)=>{
  const rideData = req.body;
  const client  = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  try{
   await client.connect();
   const database = client.db(dbName);
   const collection = database.collection('rides');
   console.log(rideData);
   const ride = {...rideData, uphone:phone};
   console.log(ride);
   collection.insertOne(ride, (insertErr) => {
    client.close();
    if (insertErr) {
      return res.status(500).send('Error saving user');
    }
    return res.status(201).send('Ride registered successfully');
  });
   console.log('inserted successfully');
  }
  catch(err){
    console.log(err);
  }
})
app.get('/rides', async (req, res)=>{
  var data;
 // console.log(req.query);
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  try {
    await client.connect();
    const database = client.db(dbName);
    const collection = database.collection('rides');
    const query = {};
    const cursor = collection.find(query);
    data = await cursor.toArray();
 //   console.log(data);
  }
  catch(err) {
    console.error(err);
    res.status(500).json({error: "Internal Server Error"});
}
  finally {
    await client.close();
  }
  res.json(data);
})
app.post('/login', async (req, res)=>{
    console.log('req ',req.body);
    email = req.body.uemail;
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  try {
    await client.connect();
    const database = client.db(dbName);
    const collection = database.collection(collectionName);
    const query = {'uemail' : email}; 
    const cursor = collection.find(query);
    userdata = await cursor.toArray();
    user = userdata[0];
    console.log(user);
    phone = userdata[0].uphone;
    console.log(phone);
  }
  catch(err) {
    console.error(err);
    res.status(500).json({error: "Internal Server Error"});
}
  finally {
    await client.close();
  }
})
app.get('/user', async (req, res)=>{
  res.json(user);
})