/*
 * Email Server for Processing and Sending Emails
 * Team pclubGU
 * The MIT License
 */

var c = require('./scripts/config').emailconfig;
var f = require('fs')
var s = require('sendgrid')(c.uname, c.pwd)

module.exports.registration = function(opt){
        s.send({
                to: opt.to,
                from: "admin@gusac.org",
                subject: "Registered | GUSAC CARNIVAL",
                text: "Thank you for registering to GUSAC Carnival 2015, You have completed the process of Registration. After some time you would receive the ticket as an attachment. So Please be patient. NOTE (IGNORE IF YOU HAVE MADE A PAYMENT): If you didnot complete the payment and have only been registered please click on the link and complete the payment, " + opt.link
        }, function(err, json) {
                if(err) {
                        console.error(err);
                }
                else {
                        console.log(json);
                }
        });
}

module.exports.ticketattach = function(opt){
        f.readFile('/home/hector/code/Source-carnival/assets/misc/' + opt.pdf, function(err, data) {
        s.send({
                to: opt.to,
                from: "admin@gusac.org",
                subject: "Payment Completed | GUSAC Carnival",
                text: "Thank you for completing the payment for the respective event of Gusac Carnival 2015. Below we are attaching the ticket of the early bird pass that which you have purchased download it and have a physical copy along with an electronic copy at the time of the event. Thank you and See you soon at the Carinval 2015.",
                files : [{filename: opt.pdf , content: data}]
        }, function(err, json) {
                if(err) {
                        console.error(err);
                }
                else {
                        console.log(json);
                }
        });
        });
}

module.exports.contact = function(opt){
        s.send({
                to: "iamakhil@gusac.org",
                from: "admin@gusac.org",
                subject: "Info | GUSAC Carnival",
                text: "Mailed from " + opt.from  + " and the query is :=>" + opt.query
        }, function(err, json) {
                if(err) {
                        console.error(err);
                }
                else {
                        console.log(json);
                }
        });
}

module.exports.kalakrithireg = function(opt){
        s.send({
                to: opt.to,
                from: "teamkalakrithi@gusac.org",
                subject: "Registered | GUSAC CARNIVAL",
                text: "Thank you for registering Accoustica, Carnival 2015, You are required to bring INR 500 for registering the band on the day of the event. Please remember that this is only for the competition and NOT for the Carnival 2015. If intersted you may buy the pass at http://gusaccarnival.org."
        }, function(err, json) {
                if(err) {
                        console.error(err);
                }
                else {
                        console.log(json);
                }
        });
}

module.exports.kalakrithiinfo = function(opt){
        s.send({
                to: "akhilhector.1@gmail.com",
                from: "admin@gusac.org",
                subject: "Registered | Carnival",
                text: opt.query
        }, function(err, json) {
                if(err) {
                        console.error(err);
                }
                else {
                        console.log(json);
                }
        });
}

module.exports.resetPassword = function(opt){
        s.send({
                to: opt.to,
                from: "admin@gusac.org",
                subject: "Password reset | GUSAC Carnival",
                text: "Your account requested for a password reset, Please click on the link to reset password" + opt.link
        }, function(err, json) {
                if(err) {
                        console.error(err);
                }
                else {
                        console.log(json);
                }
        });
}

module.exports.deleteAccount = function(opt){
	s.send({
                to: opt.to,
                from: "admin@gusac.org",
                subject: "Delete Account | GUSAC Carnival",
                text: "Your account has been deleted, Thank you"
        }, function(err, json) {
                if(err) {
                        console.error(err);
                }
                else {
                        console.log(json);
                }
        });
}

