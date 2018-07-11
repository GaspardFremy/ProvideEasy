const mysql      = require('mysql');
const connection = mysql.createConnection({
    host     : process.env.DB_HOST,
    user     : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_DATABASE
});

connection.connect(function (err) {
    if (err) throw err;
    console.log('connected');
});

function sendQuery(query, callback) {
    connection.query(query, function (error, results, fields) {
        if(error){
            callback(error)
        }else {
            callback(null, results)
        }
    })
}

module.exports = ({sendQuery: sendQuery});



//
// {
//     "OrderId" : 29,
//     "ClientName" : "Théâtre de L'Oeuvre",
//     "OrderDate" : "18/09/2018",
//     "OrderTime" : "19:10",
//     "details" : {
//             "productInfo" : {
//                 "ProductName" : "Baguette",
//                 "ProductPrice" : 1,
//                 "ProductQuantity" : 14
//             },
//             "productInfo" : {
//                 "ProductName" : "Tra",
//                 "ProductPrice" : 1,
//                 "ProductQuantity" : 14
//             },
//             "productInfo" : {
//                 "ProductName" : "Baguette",
//                 "ProductPrice" : 1,
//                 "ProductQuantity" : 14
//             },
//             "productInfo" : {
//                 "ProductName" : "Baguette",
//                 "ProductPrice" : 1,
//                 "ProductQuantity" : 14
//             },
//         }
//     }
// }
