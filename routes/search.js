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

router.post('/search', (req,res) =>{
        var searchName = req.body.searchBar
        const trimSearch = '%'+searchName+'%'
        
        const queryString = "SELECT PartId as id, ItemName AS name, PriceUSD as price, PartDescription as blah, Brand as brand, Picture as imgName from parts WHERE ItemName LIKE ? OR PartDescription LIKE ? OR Brand LIKE ?"
        
        getConnection().query(queryString, [trimSearch, trimSearch, trimSearch], (err,results,fields) =>{
            if(err){
              console.log("Failed to query: " +err)
              res.sendStatus(500);
              res.end()
              return
            }
            fs.writeFile('test.json', results, function(err){
              if(err) throw err;
              console.log('Saved');
            })
            
            
            
            res.render('shop.ejs', {
              stripePublicKey: stripePublicKey,
              items: results
            })

        })
})

router.post('/searchTrailers', (req,res) =>{
    var searchName = req.body.searchBar
    const trimSearch = '%'+searchName+'%'
    
    const queryString = "SELECT TrailerId AS id, TrailerName AS name, EmailAddress as email, TrailerDescription as blah, Picture as imgName, Length as length, Width as width, Brand as brand from trailers WHERE TrailerName LIKE ? OR TrailerDescription LIKE ? OR Brand LIKE ?;"
    
    getConnection().query(queryString, [trimSearch, trimSearch, trimSearch], (err,results,fields) =>{
            if(err){
              console.log("Failed to query: " +err)
              res.sendStatus(500);
              res.end()
              return
            }
            fs.writeFile('test.json', results, function(err){
              if(err) throw err;
              console.log('Saved');
            })
            
            res.render('trailers.ejs', {
              stripePublicKey: stripePublicKey,
              items: results
            })

        })
})

router.post('/searchTrucks', (req,res) =>{
    var searchName = req.body.searchBar
    const trimSearch = '%'+searchName+'%'
    
    const queryString = "SELECT TruckId AS id, TruckName AS name, EmailAddress as email, TruckDescription as blah, Picture as imgName, DriveType as drive, KMPerHour as km, FuelType as fuel, Brand as brand from trucks WHERE TruckName LIKE ? OR TruckDescription LIKE ? OR Brand LIKE ?;"
    
    getConnection().query(queryString, [trimSearch, trimSearch, trimSearch], (err,results,fields) =>{
            if(err){
              console.log("Failed to query: " +err)
              res.sendStatus(500);
              res.end()
              return
            }
            fs.writeFile('test.json', results, function(err){
              if(err) throw err;
              console.log('Saved');
            })
            
            res.render('trucks.ejs', {
              stripePublicKey: stripePublicKey,
              items: results
            })

        })
})

module.exports = router