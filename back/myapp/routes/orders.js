const mysql   = require('mysql');
const express = require('express');
const router = express.Router();
const database = require('./db.js');


//Can not make [values] statement with sendQuery().
//so let's make connection again until fix:
const con = mysql.createConnection({
    host     : process.env.DB_HOST,
    user     : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_DATABASE
});
con.connect(function (err) {
    if (err) throw err;
    console.log('connected');
});



/* post order */
router.post('/new', function(req, res, next) {

    let deadlineDate = req.body.order.deadlineDate;
    let deadlineTime = req.body.order.deadlineTime;
    let clientId = req.body.order.clientId;
    let saved = req.body.order.saved;
    let orderName = req.body.order.orderName;
    let products = req.body.order.products;

    database.sendQuery(`INSERT INTO orders (clientId, deadlineDate, deadlineTime, saved, orderName, createdDate)
    VALUES ('${clientId}', '${deadlineDate}', '${deadlineTime}', '${saved}', '${orderName}', NOW())`,
    function (err, results) {
      if (err) {
        console.log(err);
        return
      } else {
          console.log('inserted to order, now let\' insert to product order');
          insertProductsOrder(err, results);
        }
    });

    function insertProductsOrder(err, results) {
        let rowId = results.insertId

        var sql = "INSERT INTO orderedProducts (orderId, productId, quantity) VALUES ?";
        //In order to make multiple query at once, i need to have an array for each
        //product in object products like ['[orderId]', '[product.id]', '[product.quantity]']
        //so :
        let values = [];
        for (let i = 0; i<products.length; i++) {
            let subArray = [];
            subArray.push(rowId, products[i].id, products[i].quantity);
            values.push(subArray);
        }
        console.log(values);

        con.query(sql, [values], function (err, result) {
            if (err){
                console.log(err)
                return
            }
            console.log("Number of records inserted: " + result.affectedRows);
            return
        });
    };
});


// /* get pending orders */
router.get('/', function(req, res, next) {
      database.sendQuery(`SELECT
                            O.createdDate as createdDate,
                            O.deadlineDate as Date,
                            O.deadlineTime as Time,
                            C.name as clientName,
                            O.id as OrderId,
                            O.statusId as status
                          FROM orders O
                          LEFT JOIN clients C ON C.id = O.clientId
                          WHERE O.statusId NOT IN(3,4)
                          ORDER BY createdDate DESC`, function (err, results) {
          if (err) {
            console.log(err)
          } else {
              res.json(results)
          }
      })
});

/* get an order's details */
router.get('/:orderId', function(req, res, next) {
    let orderId = req.params.orderId
      database.sendQuery(`SELECT
                            OP.quantity as ProductQuantity,
                            P.name, P.price,
                            O.id as orderId,
                            O.deadlineDate as date,
                            O.deadlineTime as time,
                            OS.status as status,
                            C.name as clientName
                          FROM orderedProducts OP
                          LEFT JOIN products P ON OP.productId=P.id
                          LEFT JOIN orders O on OP.orderId = O.id
                          LEFT JOIN clients C on O.clientId = C.id
                          LEFT JOIN ordersStatus OS on O.statusId = OS.id
                          WHERE OP.orderId LIKE '${orderId}'`, function (err, results) {
          if (err) {
            console.log(err)
          } else {
              res.json(results)
          }
      })
});


/* get an order's details */
router.get('/details/:orderId', function(req, res, next) {
    let orderId = req.params.orderId
      database.sendQuery(`SELECT
                            O.id as orderId,
                            O.deadlineDate as date,
                            O.deadlineTime as time,
                            OS.status as status,
                            C.name as clientName
                          FROM orders O
                          LEFT JOIN clients C ON C.id = O.clientId
                          LEFT JOIN ordersStatus OS on O.statusId = OS.id
                          WHERE O.id LIKE '${orderId}'`, function (err, results) {
          if (err) {
            console.log(err)
          } else {
              res.json(results)
          }
      })
});


/* change an order's status */
router.patch('/changestatus', function(req, res, next) {

    let orderId = req.body.order.orderId
    let newCategory = req.body.order.newCategory

    console.log(orderId);
    console.log(newCategory);

    console.log('working so far');
      database.sendQuery(`UPDATE orders SET statusId = '${newCategory}' WHERE id = '${orderId}'`, function (err, results) {
          if (err) {
            console.log(err)
          } else {
              let notifInfo = {
                  message : 'vous avez accepté la commande',
                  type : 'success'
              };
              if (newCategory == 3) {
                notifInfo.message = 'vous avez terminé la commande'
              }
              res.json(notifInfo);
          }
      })
});


// WHERE clientId LIKE '${clientId}'


// /* get saved orders */
router.get('/saved/:clientId', function(req, res, next) {
    let clientId = req.params.clientId
      database.sendQuery(`SELECT
                            *
                          FROM orders
                          WHERE saved = 1
                          AND clientId LIKE '${clientId}' `, function (err, results) {
          if (err) {
            console.log(err)
          } else {
              res.json(results)
          }
      })
});



module.exports = router;
