/*
 * File: shop-load.js
 * Authors: TripleP (Alex Smith, Herbert Glaser, Kaitlyn Dominguez)
 * Version: 1.2
 *
 * Contains the API calls for loading pages that
 * require information from the DB.
 */

require('dotenv').config({ path: './.env' })
const stripeSecretKey = process.env.STRIPE_SECRET_KEY
const stripePublicKey = process.env.STRIPE_PUBLIC_KEY
const express = require('express')
const mysql = require('mysql')
const bodyParser = require('body-parser')
const app = express()
const fs = require("fs")

const router = express.Router()

router.use(bodyParser.urlencoded({extended: false}))

function getConnection(){
    return mysql.createConnection({
      host:'localhost',
      user:'root',
      password:'Capping2',
      database:'acsas'
    })
}

//Load hompage
router.get('/index', function(req,res){
    const connection = getConnection()
    
    //TODO: SEPARATE QUERIES FOR MOST POPULAR AND NEWEST (see index.js comments for more details)
    //Only load a small number of items since its the home page
    const queryString = "SELECT PartId AS id, ItemName AS name, PriceUSD as price, Picture as imgName from parts LIMIT 4;"
    
    connection.query(queryString, (err,result,fields) =>{
       if(err){
        console.log("Failed to query: " +err)
        res.sendStatus(500);
        res.end()
        return
       }
        
        
       //Probably TODO?: Limit the amount of trucks that appear here
       const truckString = "SELECT TruckId AS id, TruckName as name, EmailAddress as email, TruckDescription as blah from trucks;"
        
       connection.query(truckString, (err,trucks,fields) =>{
           res.render('index.ejs', {
               items: result,
               listings: trucks
           })
       })
    })
})

//Load parts shop
router.get('/shop', function(req,res){
    fs.readFile('./items.json', function(error, data){
        if(error) {
          res.status(500).end()
        } else{

            const connection = getConnection()
            var queryString = "SELECT PartId AS id, ItemName AS name, PriceUSD as price, PartDescription as blah,"
            queryString = queryString + " Picture as imgName from parts;"


            connection.query(queryString, (err,result,fields) => {
                if(err){
                  console.log("Failed to query: " +err)
                  res.sendStatus(500);
                  res.end()
                  return
                }

                //Writing to file to save results of the specific query. Might not be needed
                fs.writeFile('test.json', result, function(err){
                  if(err) throw err;
                  console.log('Saved');
                             })
                console.log(result)

                res.render('shop.ejs', {
                stripePublicKey: stripePublicKey,
                items: result
                })
            })   
        }
    })
})

//Load truck listings
router.get('/trucks', function(req,res){
fs.readFile('./items.json', function(error, data){
    if(error) {
      res.status(500).end()
    } else{
        
        const connection = getConnection()
        var queryString = "SELECT TruckId AS id, TruckName AS name, EmailAddress as email,"
        queryString = queryString + " TruckDescription as blah, Picture as imgName, DriveType as drive,"
        queryString = queryString + " KMPerHour as km, FuelType as fuel, Brand as brand from trucks;"
        
        
        connection.query(queryString, (err,result,fields) => {
            if(err){
              console.log("Failed to query: " +err)
              res.sendStatus(500);
              res.end()
              return
            }
            fs.writeFile('test.json', result, function(err){
              if(err) throw err;
              console.log('Saved');
                         })
            console.log(result)
            
            res.render('trucks.ejs', {
            stripePublicKey: stripePublicKey,
            items: result
            })
        })
        
    }
})
})

//Load trailer listings
router.get('/trailers', function(req,res){
fs.readFile('./items.json', function(error, data){
    if(error) {
      res.status(500).end()
    } else{
        
        const connection = getConnection()
        const queryString = "SELECT TrailerId AS id, TrailerName AS name, EmailAddress as email, TrailerDescription as blah, Picture as imgName, Length as length, Width as width, Brand as brand from trailers;"
        
        
        connection.query(queryString, (err,result,fields) => {
            if(err){
              console.log("Failed to query: " +err)
              res.sendStatus(500);
              res.end()
              return
            }
            fs.writeFile('test.json', result, function(err){
              if(err) throw err;
              console.log('Saved');
                         })
            console.log(result)
            
            res.render('trailers.ejs', {
            stripePublicKey: stripePublicKey,
            items: result
            })
        })
        
    }
})
})

//Load admin page for managing users
router.get('/manage-users', function(req,res){
        
        const connection = getConnection()
        const queryString = "SELECT EmailAddress AS email, FirstName AS first, LastName as last, PhoneNumber as phone from accounts;"
        
        
        connection.query(queryString, (err,result,fields) => {
            if(err){
              console.log("Failed to query: " +err)
              res.sendStatus(500);
              res.end()
              return
            }
            fs.writeFile('test.json', result, function(err){
              if(err) throw err;
              console.log('Saved');
                         })
            console.log(result)
            
            res.render('manage-users.ejs', {
            stripePublicKey: stripePublicKey,
            items: result
            })
        })
        
})

//Load page for specific item
router.get('/parts/:id', (req, res) =>{
    console.log("Finding part with id: " + req.params.id)
    
    //Establish connection to DB
    const connection = getConnection()
    
    const partId = req.params.id
    
    //? allows us to fill in with a different value
    const queryString = "SELECT PartId as id, ItemName as name, PartDescription as blah, PriceUSD as price, Brand as brand, Picture as imgName FROM parts WHERE PartId = ?"
    
    //Query DB. First param is query, second is callback
    //[] is used for filling in the ?
    connection.query(queryString, [partId], (err, result, fields) => {
        
        //check if we succesfully queried
        if(err){
            console.log("Failed to query: " +err)
            res.sendStatus(500);
            res.end()
            return
        }
        console.log("Sucessfully queried parts")
        
        res.render('shop-details.ejs', {
            items: result
        })
        
    })
})

//Load page for specific truck listing
router.get('/trucks/:id', (req, res) =>{
    console.log("Finding truck with id: " + req.params.id)
    
    //Establish connection to DB
    const connection = getConnection()
    
    const truckId = req.params.id
    
    //? allows us to fill in with a different value
    const queryString = "SELECT TruckId as id, TruckName as name, TruckDescription as blah, EmailAddress as email, Brand as brand, DriveType as drive, KMPerHour as km, FuelType as fuel, Color as color, Picture as imgName FROM trucks WHERE TruckId = ?"
    
    //Query DB. First param is query, second is callback
    //[] is used for filling in the ?
    connection.query(queryString, [truckId], (err, result, fields) => {
        
        //check if we succesfully queried
        if(err){
            console.log("Failed to query: " +err)
            res.sendStatus(500);
            res.end()
            return
        }
        console.log("Sucessfully queried trucks")
        
        res.render('listing-details.ejs', {
            items: result
        })
        
    })
    
})

//Load page for specifc trailer listing
router.get('/trailers/:id', (req, res) =>{
    console.log("Finding trailer with id: " + req.params.id)
    
    //Establish connection to DB
    const connection = getConnection()
    
    const trailerId = req.params.id
    
    //? allows us to fill in with a different value
    const queryString = "SELECT TrailerId as id, TrailerName as name, TrailerDescription as blah, EmailAddress as email, Brand as brand, Length as length, Width as width, Color as color, Picture as imgName FROM trailers WHERE TrailerId = ?"
    
    //Query DB. First param is query, second is callback
    //[] is used for filling in the ?
    connection.query(queryString, [truckId], (err, result, fields) => {
        
        //check if we succesfully queried
        if(err){
            console.log("Failed to query: " +err)
            res.sendStatus(500);
            res.end()
            return
        }
        console.log("Sucessfully queried trailers")
        
        res.render('trailer-details.ejs', {
            items: result
        })
        
    })

})

module.exports = router