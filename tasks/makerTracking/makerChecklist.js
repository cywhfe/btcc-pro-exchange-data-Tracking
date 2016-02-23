/**
 * Created by thomasyu on 2/23/16.
 */


var mysql = require('mysql');
var async = require('async');
var db = require('./../../db.json');

var connection = mysql.createConnection(db.prodDB);

var count = 0;

module.exports = {

    getMakerInfo: function(data, callback){
        callback(null, data);
    },



    // TOTAL TRADES: total trade since ever
    getTotalTrades: function(account, callback){
        //console.log(account);
        var sql = 'select sum(size) from trades';
        connection.query(sql, function(err, rows) {
            console.log(count ++);
            if (!err){
                var o = rows[0];
                callback(null, o['sum(size)']);
            }else{
                callback(null, err);
            }
        });
    },

    // MAKE ORDERS IN LAST DAY: Rolling Trades of a Maker in last 24 hours
    getMakeOrdersInLastDay: function(account, callback){
        var sql = 'select sum(size) from trades\n' +
            'where maker_order_id in\n' +
            '(\n' +
            'select order_id from reports\n' +
            "where account = '" +
            account +
            "' and status <> '4'\n" +
            ')' +
            'and to_days(now()) - to_days(date(timestamp)) < 1;' +
            '';
        connection.query(sql, function(err, rows) {
            console.log(count++);
            if (!err){
                var o = rows[0];
                callback(null, o['sum(size)']);
            }else{
                callback(null, err);
            }
        });

    },

    // TAKE ORDERS IN LAST DAY: Rolling Trades of a Maker in last 24 hours
    getTakeOrdersInLastDay: function(account, callback){
        var sql = 'select sum(size) from trades\n' +
            'where Taker_order_id in\n' +
            '(\n' +
            'select order_id from reports\n' +
            "where account = '" +
            account +
            "' and status <> '4'\n" +
            ')' +
            'and to_days(now()) - to_days(date(timestamp)) < 1;' +
            '';
        //console.log(sql);
        connection.query(sql, function(err, rows) {
            console.log(count++);
            if (!err){
                var o = rows[0];
                callback(null, o['sum(size)']);
            }else{
                callback(null, err);
            }
        });

    },

    /*
     PROFIT AUDIT:
     - gross_profit
     - fee_total
     - net_profit
     */

    getProfitAudit: function(account, callback){
        var sql = 'select *, gross_profit + fee_total as net_profit\n' +
            'from (\n' +
            ' select sum(profit_and_loss) gross_profit\n' +
            'from settlementdetails\n' +
            "where account = '" + account + "' and date(timestamp) >= utc_date()) pl\n" +
            'left join (\n' +
            'select sum(fee_total) fee_total from tradefeelogs\n' +
            "where account = '" +
            account + "' and to_days(now()) - to_days(date(created)) < 1) ft on 1=1;" +
            '';
        //console.log(sql);
        connection.query(sql, function(err, rows) {
            console.log(count++);
            if (!err){
                var o = rows[0];
                callback(null, o);
            }else{
                callback(null, err);
            }
        });

    }
}