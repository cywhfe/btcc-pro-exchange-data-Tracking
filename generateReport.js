/**
 * Created by thomasyu on 2/23/16.
 */

var mysql = require('mysql');
var async = require('async');
var reports = require("./tasks/makerTracking/reports.js");

// TO CHECK A MAKER'S TRADING INFO, WE NEED TO RUN THROUGH THIS TASK LIST,
// ADD MORE TASK INTO THIS LIST AS YOU NEED

// TRAVERSE


//
//// THIS SERIES RUN TROUGH THE TASKLIST
async.waterfall([
    reports.initialize,
    reports.generateEmail
], function(err, result){
   //console.log(err, result);
});


process.exit();

//connection.end();


