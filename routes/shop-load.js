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

const router = express.Router()

router.use(bodyParser.urlencoded({extended: false}))


router.get('/index', function(req,res){
    const connection = helper1.getConnection()
    const newString = "SELECT PartId AS id, ItemName AS name, PriceUSD as price, Picture as imgName from parts ORDER BY PartId DESC LIMIT 4;"
    const popString = "SELECT parts.PartId AS id, parts.ItemName AS name, parts.PriceUSD as price, parts.Picture as imgName, COUNT(orderedparts.PartId) from parts, orderedparts WHERE parts.PartId = orderedparts.PartId GROUP BY parts.PartId ORDER BY COUNT(orderedparts.PartId) LIMIT 4;"
   
    connection.query(newString, (err,result,fields) =>{
       if(err){
            console.log("Failed to query: " +err)
            res.redirect('/Front End/error-500.html')
            return
        }
        
       connection.query(popString, (err,resultp,fields) =>{
           
           if(err){
                console.log("Failed to query: " +err)
                res.redirect('/Front End/error-500.html')
                return
            }
           
       const truckString = "SELECT TruckId AS id, TruckName as name, EmailAddress as email, TruckDescription as blah, Picture as imgName, date(ListingTime) as date from trucks;"
        
       connection.query(truckString, (err,trucks,fields) =>{
           
           if(err){
                console.log("Failed to query: " +err)
                res.redirect('/Front End/error-500.html')
                return
            }
           
           res.render('index.ejs', {
               news: result,
               pops: resultp,
               listings: trucks
           })
       })
       })
    })
})

router.get('/shop', function(req,res){
fs.readFile('./items.json', function(error, data){
    if(error) {
      res.status(500).end()
    } else{
        
        const connection = helper1.getConnection()
        const queryString = "SELECT PartId AS id, ItemName AS name, PriceUSD as price, PartDescription as blah, Picture as imgName from parts LIMIT 10;"
        
        
        connection.query(queryString, (err,result,fields) => {
            if(err){
                console.log("Failed to query: " +err)
                res.redirect('/Front End/error-500.html')
                return
            }
            fs.writeFile('test.json', result, function(err){
              if(err) throw err;
              console.log('Saved');
                         })
            console.log(result)
            
            const partString = "SELECT * from parts"
            
            helper1.getConnection().query(partString, (err,results,fields) => {
                
                if(err){
                    console.log("Failed to query: " +err)
                    res.redirect('/Front End/error-500.html')
                    return
                }
                
                res.render('shop.ejs', {
                    stripePublicKey: stripePublicKey,
                    items: result,
                    parts: results
                })
            })
        })
        
    }
})
})

router.get('/shop/:offset', function(req,res){
    fs.readFile('./items.json', function(error, data){
    if(error) {
      res.status(500).end()
    } else{
        
        const connection = helper1.getConnection()
        const offs = req.params.offset * 10 - 10
        const queryString = "SELECT PartId AS id, ItemName AS name, PriceUSD as price, PartDescription as blah, Picture as imgName from parts LIMIT 10 OFFSET ?;"
        
        
        connection.query(queryString, [offs], (err,result,fields) => {
            if(err){
                console.log("Failed to query: " +err)
                res.redirect('/Front End/error-500.html')
                return
            }
            fs.writeFile('test.json', result, function(err){
              if(err) throw err;
              console.log('Saved');
                         })
            console.log(result)
            
            const partString = "SELECT * from parts"
            
            helper1.getConnection().query(partString, (err,results,fields) => {
                
                if(err){
                    console.log("Failed to query: " +err)
                    res.redirect('/Front End/error-500.html')
                    return
                }
                
                res.render('shop.ejs', {
                    stripePublicKey: stripePublicKey,
                    items: result,
                    parts: results
                })
            })
        })
        
    }
})
})

router.get('/trucks', function(req,res){
fs.readFile('./items.json', function(error, data){
    if(error) {
      res.status(500).end()
    } else{
        
        var sql = "delete from trucks where current_timestamp() > RemoveTime"

        const connection = helper1.getConnection()
        connection.query(sql, 1, (error, results, fields) => {
          if (error)
            return console.error(error.message);

          console.log('Deleted Row(s):', results.affectedRows);
        });
        
        
        
        const queryString = "SELECT TruckId AS id, TruckName AS name, EmailAddress as email, TruckDescription as blah, Picture as imgName, DriveType as drive, KMPerHour as km, FuelType as fuel, Brand as brand from trucks LIMIT 10;"
        
        
        connection.query(queryString, (err,result,fields) => {
            if(err){
                console.log("Failed to query: " +err)
                res.redirect('/Front End/error-500.html')
                return
            }
            fs.writeFile('test.json', result, function(err){
              if(err) throw err;
              console.log('Saved');
                         })
            console.log(result)
            
            const partString = "SELECT * from trucks"
            
            helper1.getConnection().query(partString, (err,results,fields) => {
                
                if(err){
                    console.log("Failed to query: " +err)
                    res.redirect('/Front End/error-500.html')
                    return
                }
                
                res.render('trucks.ejs', {
                    stripePublicKey: stripePublicKey,
                    items: result,
                    parts: results
                })
            })
        })
        
    }
})
})

router.get('/truckShop/:offset', function(req,res){
fs.readFile('./items.json', function(error, data){
    if(error) {
      res.status(500).end()
    } else{
        
        const connection = helper1.getConnection()
        const offs = req.params.offset * 10 - 10
        const queryString = "SELECT TruckId AS id, TruckName AS name, EmailAddress as email, TruckDescription as blah, Picture as imgName, DriveType as drive, KMPerHour as km, FuelType as fuel, Brand as brand from trucks LIMIT 10 OFFSET ?;"
        
        
        connection.query(queryString, [offs], (err,result,fields) => {
            if(err){
                console.log("Failed to query: " +err)
                res.redirect('/Front End/error-500.html')
                return
            }
            fs.writeFile('test.json', result, function(err){
              if(err) throw err;
              console.log('Saved');
                         })
            console.log(result)
            
            const partString = "SELECT * from trucks"
            
            helper1.getConnection().query(partString, (err,results,fields) => {
                
                if(err){
                    console.log("Failed to query: " +err)
                    res.redirect('/Front End/error-500.html')
                    return
                }
                
                res.render('trucks.ejs', {
                    stripePublicKey: stripePublicKey,
                    items: result,
                    parts: results
                })
            })
        })
        
    }
})
})

router.get('/trailers', function(req,res){
fs.readFile('./items.json', function(error, data){
    if(error) {
      res.status(500).end()
    } else{
        
        var sql = "delete from trailers where current_timestamp() > RemoveTime"

        const connection = helper1.getConnection()
        connection.query(sql, 1, (error, results, fields) => {
          if (error)
            return console.error(error.message);

          console.log('Deleted Row(s):', results.affectedRows);
        });
       
        const queryString = "SELECT TrailerId AS id, TrailerName AS name, EmailAddress as email, TrailerDescription as blah, Picture as imgName, Length as length, Width as width, Brand as brand from trailers LIMIT 10;"
        
        
        connection.query(queryString, (err,result,fields) => {
            if(err){
                console.log("Failed to query: " +err)
                res.redirect('/Front End/error-500.html')
                return
            }
            fs.writeFile('test.json', result, function(err){
              if(err) throw err;
              console.log('Saved');
                         })
            console.log(result)
            
            const partString = "SELECT * from trailers"
            
            helper1.getConnection().query(partString, (err,results,fields) => {
                
                if(err){
                    console.log("Failed to query: " +err)
                    res.redirect('/Front End/error-500.html')
                    return
                }
                
                res.render('trailers.ejs', {
                    stripePublicKey: stripePublicKey,
                    items: result,
                    parts: results
                })
            })
        })
        
    }
})
})

router.get('/trailerShop/:offset', function(req,res){
fs.readFile('./items.json', function(error, data){
    if(error) {
      res.status(500).end()
    } else{
        
        const connection = helper1.getConnection()
        const offs = req.params.offset * 10 - 10
        const queryString = "SELECT TrailerId AS id, TrailerName AS name, EmailAddress as email, TrailerDescription as blah, Picture as imgName, Length as length, Width as width, Brand as brand from trailers LIMIT 10 OFFSET ?;"
        
        
        connection.query(queryString, [offs], (err,result,fields) => {
            if(err){
                console.log("Failed to query: " +err)
                res.redirect('/Front End/error-500.html')
                return
            }
            fs.writeFile('test.json', result, function(err){
              if(err) throw err;
              console.log('Saved');
                         })
            console.log(result)
            
            const partString = "SELECT * from trailers"
            
            helper1.getConnection().query(partString, (err,results,fields) => {
                
                if(err){
                    console.log("Failed to query: " +err)
                    res.redirect('/Front End/error-500.html')
                    return
                }
                
                res.render('trailers.ejs', {
                    stripePublicKey: stripePublicKey,
                    items: result,
                    parts: results
                })
            })
        })
        
    }
})
})

router.get('/manage-users', function(req,res){

    const queryUser = "SELECT EmailAddress as email FROM admins"

    helper1.getConnection().query(queryUser, (err, accountresult) => {
        //if the user is not logged in, it will direct them back to the home page
        if(!req.session || !req.session.username) {
            res.redirect('../index');
        }else{
            const connection = helper1.getConnection()
            const queryString = "SELECT EmailAddress AS email, FirstName AS first, LastName as last, PhoneNumber as phone from accounts;"


            connection.query(queryString, (err,result,fields) => {
                if(err){
                  console.log("Failed to query: " +err)
                  res.sendStatus(500);
                  res.render('/Front End/error-500.html')
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
        }
    })
})

router.get('/parts/:id', (req, res) =>{
    console.log("Finding part with id: " + req.params.id)
    
    //Establish connection to DB
    const connection = helper1.getConnection()
    
    const partId = req.params.id.trim()
    
    //? allows us to fill in with a different value
    const queryString = "SELECT PartId as id, ItemName as name, PartDescription as blah, PriceUSD as price, Brand as brand, Picture as imgName FROM parts WHERE PartId = ?"
    
    //Query DB. First param is query, second is callback
    //[] is used for filling in the ?
    connection.query(queryString, [partId], (err, result, fields) => {
        
        //check if we succesfully queried
        if(err){
                console.log("Failed to query: " +err)
                res.redirect('/Front End/error-500.html')
                return
            }
        console.log("Sucessfully queried parts")
        
        res.render('shop-details.ejs', {
            items: result
        })
        
    })
    //ending response
    
})

router.get('/order/:id', (req,res) =>{
    const orderId = req.params.id
    const queryString = "SELECT orderedparts.OrderId as id, orderedparts.PartId as part, parts.PartId as partIn, orderedparts.OrderedQuantity as quan, parts.PriceUSD as price, parts.ItemName as name, parts.Picture as imgName from orderedparts, parts WHERE orderedparts.OrderId = ? AND orderedparts.PartId = parts.PartId"
    const queryUser = "SELECT EmailAddress as email FROM orders WHERE OrderId = ?"

    console.log("Order lookup")

    helper1.getConnection().query(queryUser, [orderId], (err, accountresult) => {
        
        if(err){
                console.log("Failed to query: " +err)
                res.redirect('/Front End/error-500.html')
                return
            }
        

        //if the user is not logged in, it will direct them to the login page
        if(!req.session || !req.session.username) {
            res.redirect('../login.html');
        }else{
            if(req.session.username === accountresult[0].email){
                helper1.getConnection().query(queryString, [orderId], (err, result, fields) => {
                    
                    if(err){
                        console.log("Failed to query: " +err)
                        res.redirect('/Front End/error-500.html')
                        return
                    }
                    
                    
                    const billString = "SELECT orders.OrderId as id, orders.PaymentId, paymentdetails.PaymentId, paymentdetails.BillingAddress as address, paymentdetails.BillingFirstName as first, paymentdetails.BillingLastName as last, paymentdetails.BillingCountry as country, paymentdetails.BillingCity as city, paymentdetails.BillingState as state, paymentdetails.BillingPhone as phone, orders.EmailAddress as email FROM orders, paymentdetails WHERE orders.OrderId = ? AND orders.PaymentId = paymentdetails.PaymentId"
                    helper1.getConnection().query(billString, [orderId], (err, billing, fields) => {
                        
                        if(err){
                            console.log("Failed to query: " +err)
                            res.redirect('/Front End/error-500.html')
                            return
                        }
                        
                        
                        const shipString = "SELECT orders.OrderId as id, orders.ShippingId as ship, shippingdetails.ShippingId as shipping, shippingdetails.ShippingAddress as address, shippingdetails.ShippingFirstName as first, shippingdetails.ShippingLastName as last, shippingdetails.ShippingCountry as country, shippingdetails.ShippingCity as city, shippingdetails.ShippingState as state, shippingdetails.ShippingPhone as phone from orders, shippingdetails WHERE orders.OrderId = ? AND shippingdetails.ShippingId = orders.ShippingId;"
                        console.log(billing)
                        helper1.getConnection().query(shipString, [orderId], (err, shipping, fields) => {
                            
                        if(err){
                            console.log("Failed to query: " +err)
                            res.redirect('/Front End/error-500.html')
                            return
                        }    
                            
                            
                        console.log(shipping)
                            res.render('order-template.ejs', {
                                items: result,
                                bills: billing,
                                ships: shipping
                            })
                        })
                    })
                })
            }else{
                 console.log(req.session.username)
                 console.log(accountresult[0].email)
                 res.redirect('../error-500.html');
            }
        }
    })
})

router.get('/orderHistory/:accounts', (req, res) => {

    const account = req.params.accounts
    const queryString = "SELECT DISTINCT orders.EmailAddress as email, orderedparts.OrderId as partid, shippingdetails.ShippingId as ship, shippingdetails.ShippingAddress as address,  orders.OrderId as id from orders, shippingdetails, orderedparts WHERE orders.EmailAddress = ? AND orders.OrderId = orderedparts.OrderId AND orders.ShippingId = shippingdetails.ShippingId"
    
    const quanString = "SELECT parts.ItemName as name, orderedparts.PartId, parts.PartId, orderedparts.OrderId, orders.OrderId, orders.EmailAddress from orders, parts, orderedparts where orders.EmailAddress = ? AND orders.OrderId = orderedparts.OrderId AND parts.PartId = orderedParts.PartId"
    
    //COUNT(orderedparts.PartId) as quan,

    //if the user is not logged in, it will direct them to the login page
    if(!req.session || !req.session.username) {
        res.redirect('../login.html');
    }else{
        if(req.session.username === account){
            helper1.getConnection().query(queryString, [account], (err, result, fields) => {
                
                if(err){
                   console.log("Failed to query: " +err)
                   res.redirect('/Front End/error-500.html')
                   return
                 }    
                
            
                res.render('order-history.ejs',{
                    orders: result,
                   // part: parts
                })
                
            })
        }else{
          console.log(req.session.username)
          console.log(result[0].email)
          //res.redirect('../error-500.html');
        }
    }
})

router.get('/trucks/:id', (req, res) =>{
    console.log("Finding truck with id: " + req.params.id)
    
    //Establish connection to DB
    const connection = helper1.getConnection()
    
    const truckId = req.params.id.trim()
    
    //? allows us to fill in with a different value
    const queryString = "SELECT TruckId as id, TruckName as name, TruckDescription as blah, EmailAddress as email, Brand as brand, DriveType as drive, KMPerHour as km, FuelType as fuel, Color as color, Picture as imgName FROM trucks WHERE TruckId = ?"
    
    //Query DB. First param is query, second is callback
    //[] is used for filling in the ?
    connection.query(queryString, [truckId], (err, result, fields) => {
        
        //check if we succesfully queried
        if(err){
          console.log("Failed to query: " +err)
          res.redirect('/Front End/error-500.html')
          return
        } 
        console.log("Sucessfully queried trucks")
        
        res.render('listing-details.ejs', {
            items: result
        })
        
    })
    //ending response
    
})

router.get('/trailers/:id', (req, res) =>{
    console.log("Finding trailer with id: " + req.params.id)
    
    //Establish connection to DB
    const connection = helper1.getConnection()
    
    const trailerId = req.params.id.trim()
    
    //? allows us to fill in with a different value
    const queryString = "SELECT TrailerId as id, TrailerName as name, TrailerDescription as blah, EmailAddress as email, Brand as brand, Length as length, Width as width, Color as color, Picture as imgName FROM trailers WHERE TrailerId = ?"
    
    //Query DB. First param is query, second is callback
    //[] is used for filling in the ?
    connection.query(queryString, [trailerId], (err, result, fields) => {
        
        //check if we succesfully queried
        if(err){
          console.log("Failed to query: " +err)
          res.redirect('/Front End/error-500.html')
          return
        } 
        console.log("Sucessfully queried trailers")
        
        res.render('trailer-details.ejs', {
            items: result
        })
        
    })
    //ending response
    
})

router.get('/my-account/:email', (req, res) => {
    const connection = helper1.getConnection()
    const accountEmail = req.params.email.trim()
    
    const accountString = "SELECT EmailAddress as email, PhoneNumber as phone from accounts WHERE EmailAddress = ?"
    const truckString = "SELECT TruckId as id, TruckName as name, TruckDescription as blah, EmailAddress as email, Brand as brand, DriveType as drive, KMPerHour as km, FuelType as fuel, Color as color, Picture as imgName FROM trucks WHERE EmailAddress = ?"
    const trailerString = "SELECT TrailerId as id, TrailerName as name, TrailerDescription as blah, EmailAddress as email, Brand as brand, Length as length, Width as width, Color as color, Picture as imgName FROM trailers WHERE EmailAddress = ?"
    
    
    connection.query(accountString, [accountEmail], (err, resulta, fields) => {
        
        if(err){
          console.log("Failed to query: " +err)
          res.redirect('/Front End/error-500.html')
          return
        } 
        
        connection.query(truckString, [accountEmail], (err, resultt, fields) => {
            
            if(err){
              console.log("Failed to query: " +err)
              res.redirect('/Front End/error-500.html')
              return
            } 
            
            connection.query(trailerString, [accountEmail], (err, resultr, fields) => {
                
                if(err){
                  console.log("Failed to query: " +err)
                  res.redirect('/Front End/error-500.html')
                  return
                } 
                
                res.render('my-account.ejs' , {
                    accounts: resulta,
                    trucks: resultt,
                    trailers: resultr
                })
            })
        })
    })
})

module.exports = router
