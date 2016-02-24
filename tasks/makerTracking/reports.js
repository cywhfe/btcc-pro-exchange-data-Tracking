/**
 * Created by thomasyu on 2/23/16.
 */



var mysql = require('mysql');
var async = require('async');
var db = require('./../../db.json');
var makerInfo = require('../../config/maker/makerInfo.json');
var makerChecklist = require("./makerChecklist.js");
var email = require("./../../service/email.js");
var moment = require('moment-timezone');


var data = {};

module.exports = {

    initialize: function(callback){

        var data = [];

        // 1. GET MAKER USER LIST
        async.forEachLimit(makerInfo.makers, 1, function(maker, callback){
            console.log(maker.account);
            // 2. RUN THROUGH MAKER REPORT TASK LIST
            async.series({
                name: makerChecklist.getMakerInfo.bind(null, maker.name),
                account: makerChecklist.getMakerInfo.bind(null, maker.account),
                email: makerChecklist.getMakerInfo.bind(null, maker.email),
                company: makerChecklist.getMakerInfo.bind(null, maker.company),

                totalTrades: makerChecklist.getTotalTrades.bind(null, maker.account),
                makeOrdersInLastDay: makerChecklist.getMakeOrdersInLastDay.bind(null, maker.account),
                takeOrdersInLastDay: makerChecklist.getTakeOrdersInLastDay.bind(null, maker.account),
                profitAudit: makerChecklist.getProfitAudit.bind(null, maker.account)
                    /* .bind make it possible to pass value */
            },function(err, results) {
                //console.log(err,results);
                data.push(results);
                callback(err, results);
            });


        }, function(err){
            callback(err,data);
        });

    },

    // GET MAKER ACCOUNT LIST
    generateEmail: function(data, callback){
        //console.log(data);

        var msg = "\n";

        async.forEach(data, function(info, callback){
            msg += "\nMaker: " + info.company + " (" + info.email + ")";

            msg += "\n\nLast 24h Trading Data" +
            "\n- Maker Order:  " + info.makeOrdersInLastDay +
            "\n- Taker Order:  " + info.takeOrdersInLastDay;

            msg += "\n\nProfit and Loss" +
            "\n- Gross Profit: " + info.profitAudit.gross_profit +
            "\n- Fee Total: " + info.profitAudit.fee_total +
            "\n- Net Profit: " + info.profitAudit.net_profit;

            msg += "\n\n\n";
        });

        msg += "Thomas Yu\n";
        msg += moment.tz(Date.now(), "Asia/Shanghai").format();

        console.log(msg);
        email.sendEmail(msg);

        callback(null, data);







    }
}