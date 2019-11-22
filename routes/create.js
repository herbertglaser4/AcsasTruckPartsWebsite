require('dotenv').config({ path: './.env' })
const stripeSecretKey = process.env.STRIPE_SECRET_KEY
const stripePublicKey = process.env.STRIPE_PUBLIC_KEY
const helper = require ('../helper.js');
var helper1 = new helper();
const express = require('express')
const { check, validationResult } = require('express-validator');
const { body } = require('express-validator');
const { sanitizeBody } = require('express-validator');
const mysql = require('mysql')
const bodyParser = require('body-parser')
const app = express()
const fs = require("fs")
const multer = require("multer");

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./Front End/img/product")
    },
    filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now() + '.jpg')
    }
});

const upload = multer({
    storage: storage
})

const router = express.Router()

router.use(bodyParser.urlencoded({extended: false}))



router.post('/create_listing', upload.single("file"), (req,res) => {
    
    console.log("Creating Listing")
    
    const truckName = req.body.truck_name
    const truckBrand = req.body.truck_brand
    const truckKM = req.body.truck_km
    const truckFuel = req.body.truck_fuel
    const truckDrive = req.body.truck_drive
    const truckColor = req.body.truck_color
    const truckDesc = req.body.truck_desc
    var picture = req.file.filename
    picture = picture.slice(0,-4)
    
    const email = "example2@gmail.com"
    
    const queryString = "insert into trucks (TruckName, Brand, KMPerHour, FuelType, DriveType, Color, EmailAddress, TruckDescription, Picture) values (?,?,?,?,?,?,?,?,?)"
    
    helper1.getConnection().query(queryString, [truckName, truckBrand, truckKM, truckFuel, truckDrive, truckColor, email, truckDesc, picture], (err, results, fields) => {
        if(err) {
            console.log("Insert failed")
            console.log(truckName)
            console.log(truckBrand)
            console.log(truckKM)
            console.log(truckFuel)
            console.log(truckDrive)
            console.log(truckColor)
            console.log(email)
            console.log(truckDesc)
            console.log(picture)
            //res.sendStatus(500)
            res.redirect('/Front End/error-500.html')
            return
        }
        
        res.end()
    })
})

router.post('/trailer_listing', upload.single("file"), (req,res) => {
    
    const trailerName = req.body.trailer_name
    const trailerBrand = req.body.trailer_brand
    const trailerLength = req.body.trailer_length
    const trailerWidth = req.body.trailer_width
    const trailerDesc = req.body.trailer_desc
    const trailerColor = req.body.trailer_color
    var picture = req.file.filename
    picture = picture.slice(0,-4)
    
    //FIX TO PULL FROM SESSION
    const email = "example2@gmail.com"
    
    const queryString = "insert into trailers (TrailerName, Brand, Length, Width, TrailerDescription, Color, EmailAddress, Picture) values (?,?,?,?,?,?,?,?)"
    
    helper1.getConnection().query(queryString, [trailerName, trailerBrand, trailerLength, trailerWidth, trailerDesc, trailerColor, email, picture], (err,results,fields) => {
        if(err) {
            console.log("Insert failed")
            console.log(trailerName)
            console.log(trailerBrand)
            console.log(trailerLength)
            console.log(trailerWidth)
            console.log(trailerDesc)
            console.log(trailerColor)
            console.log(email)
            console.log(picture)
            console.log(err)
            res.redirect('/Front End/error-500.html')
            return
        }
        else{
            if(req.file) {
                res.json(req.file);
            }
        }
        
        res.end()
    })
    
})

router.post('/create_part', upload.single("file"),  (req,res) => {
    
    console.log("Creating Part")
    
    const partName = req.body.part_name
    const partDesc = req.body.part_desc
    const partPrice = req.body.part_price * 100
    const partBrand = req.body.part_brand
    const partQuan = req.body.part_quan
    var picture = req.file.filename
    picture = picture.slice(0,-4)
    
    const queryString = "insert into parts (ItemName, Brand, PriceUSD, PartDescription, QuantityOnHand, Picture) values (?,?,?,?,?,?)"
    
    helper1.getConnection().query(queryString, [partName, partBrand, partPrice, partDesc, partQuan, picture], (err, results, fields) => {
        if(err) {
            console.log("Insert failed")
            console.log(results)
            console.log(partName)
            console.log(partDesc)
            console.log(partPrice)
            console.log(partBrand)
            console.log(partQuan)
            console.log(picture)
            //res.sendStatus(500)
            res.redirect('/Front End/error-500.html')
            return
        }
        fs.writeFile('../items.json', results, function(err){
              if(err) throw err;
              console.log('Saved');
                         })
        
        res.redirect('/Front End/list-sucess.html')
    })
})

router.post('/create_account', [
    body('account_first').trim().escape(),
    body('account_last').trim().escape(),
    body('account_email').trim().escape(),
    body('account_password').trim().escape()
], (req,res) => {
    
    const accountFirst = req.body.account_first
    const accountLast = req.body.account_last
    const accountEmail = req.body.account_email
    const accountPass = req.body.account_pass
    const elist = true
    
    const queryString = "insert into accounts (FirstName, LastName, EmailAddress, Password, EmailList) values (?,?,?,?,?)"
    
    helper1.getConnection().query(queryString, [accountFirst, accountLast, accountEmail, accountPass, elist], (err, results, fields) => {
        if(err) {
            console.log("Insert failed")
            console.log(results)
            console.log(accountFirst)
            console.log(accountLast)
            console.log(accountEmail)
            console.log(accountPass)
            res.sendStatus(500)
            res.render('/Front End/error-500.html')
            return
        }
        
        res.render('/Front End/account-created.html')
    })
})

module.exports = router