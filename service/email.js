/**
 * Created by thomasyu on 2/23/16.
 */

var nodemailer = require('nodemailer');
var reportReceiver = require('./../config/maker/reportReceiver.json');
var async = require('async');

var toEmail  = "";


module.exports = {

    sendEmail: function(msg){
        // GMAIL SMTP
        var transporter = nodemailer.createTransport({
            service: 'Gmail',
            secureConnection: true, // use SSL
            port: 465,
            auth: {
                //user: 'cms@btcc.com',
                //pass: 'cmsbtcc1234'

                user: 'no-reply@btcc.com',
                pass: 'WRd6NdaWhqU2S97'
            }
        }, {
            // default values for sendMail method
            from: "Thomas Yu" + " <thomas.yu@btcc.com>",
            headers: {
                'My-Awesome-Header': 'Pro Exchange Market Maker Daily Report',
                'From': "Thomas Yu <thomas.yu@btcc.com>",
                'Reply-To': "Thomas Yu <thomas.yu@btcc.com>"
            }
        });

        async.forEach(reportReceiver.reportReceiver, function(receiver, callback){
            toEmail += receiver.email + ", "

        });

        console.log(toEmail);


        transporter.sendMail({
            from: "Thomas Yu <thomas.yu@btcc.com>",
            to: toEmail,
            bcc: 'thomas.yu@btcc.com',
            subject: "[Info] Pro Exchange Market Maker Daily Report",
            text: msg
        }, function(error, info){
            if(error){
                return console.log(error);
            }
            console.log('Message sent: ' + info.response);

        });

        transporter.close(); // close the pool
    }
}