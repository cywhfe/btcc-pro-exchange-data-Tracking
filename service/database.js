/**
 * Created by thomasyu on 2/23/16.
 */


var mysql = require('mysql');
var async = require('async');
var db = require('../db.json');



var pool = mysql.createPool(db.prodDB);


module.exports = {

    getData: function(sql, callback){
        pool.getConnection(function(err, connection) {
            if(connection){
                // Use the connection
                connection.query( sql, function(err, rows) {
                    connection.release();
                    console.log(rows);
                    callback(err, rows);
                });
            }
            else{
                callback(err)
            }
        });
    }


}

