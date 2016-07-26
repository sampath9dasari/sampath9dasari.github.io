/*
 * Express Router for serving the templates
 * Team pclubGU
 * The MIT License
 */
var http = require('http'),
    express = require('express'),
    session = require('express-session'),
    fs = require('fs'),
    mysql = require('mysql'),
    em = require('./emailserver'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser');

module.exports.app = function() {
        var port = process.env.PORT || 8000;
        var app = express();
        var router = express.Router();
        var errorPage = fs.readFileSync("404.html", "UTF-8");

        app.use(express.static('assets'));
        app.set('title', "GUSAC Carnival 4");
        app.set('view engine', 'ejs');
        app.use(session({
                secret : 'gusac123!@#',
                resave : true,
                saveUninitialized : true
        }));
        app.use(cookieParser());
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({extended: true}));

        router.get('/', function(req, res) {
                res.render('index.ejs');
        });

        router.get('/about', function(req, res) {
                res.render('about.ejs');
        });

        router.get('/contact', function(req, res) {
                res.render('contact.ejs');
        });

        router.post('/controller/contact', function(req, res) {
                var name  = req.body['inputName'],
                    email = req.body['inputEmail'],
                    phone = req.body['inputPhoneNumber'],
                    inputtext = req.body['inputText'];

                var data = {
                    from : email,
                    query : inputtext
                };

                em.contact(data);

                res.render('responsecontact', {
                            cname : name,
                            cmail : email,
                            cphone : phone
                       });
        });

        router.get('/events', function(req, res) {
                res.render('events.ejs');
        });

        router.get('/iamingc', function(req, res) {
        		res.render('unknownfilename.ejs');
        })

        router.get('/ff', function(req, res) {
                res.render('ff.ejs');
        });

        router.get('/register', function(req, res) {
                res.render('register.ejs');
        });

        router.post('/controller/finalregister', function(req, res) {
                      var name = req.body['regname'],
                       email = req.body['regemail'],
                       phone = req.body['regcontact'],
                       evnt = req.body['regevent'],
                       year = req.body['regyear'],
                       dept = req.body['regcollege'],
					   str = ", ",
                       fullinfo = name  + str + email + str + phone + str + evnt + str + year + str + dept;

                       var data = {
                            query : fullinfo
                       }

                       em.kalakrithiinfo(data);

	  					res.render('response', {
	                            regname : name,
	                            regemail : email,
	                            regphone : phone
	                    });

        });

        router.post('/controller/register', function(req, res) {
                      var name = req.body['inputName'],
                       user = req.body['inputEmail'],
                       pass = req.body['inputPassword'],
                       email = req.body['inputEmail'],
                       phone = req.body['inputPhoneNumber'],
                       state = req.body['stateName'],
                       college = req.body['collegeName'],
                       dept = req.body['deptName']

                       var data = {
                            to : email,
                            link : "https://in.explara.com/e/gusaccarnival2015/checkout"
                       }

                       res.render('response', {
                            regname : name,
                            regemail : email,
                            regphone : phone
                       });

                       em.registration(data);
        });

        router.post('/controller/cultregister', function(req, res) {
                      var name = req.body['bandname'],
                       email = req.body['bandemail'],
                       contact = req.body['bandcontact'],
                       mem1 = req.body['bandmem1'],
                       mem2 = req.body['bandmem2'],
                       mem3 = req.body['bandmem3'],
                       mem4 = req.body['bandmem4'],
                       mem5 = req.body['bandmem5'],
                       str = ", ",
                       fullinfo = name  + str + email + str + contact + str + mem1 + str + mem2 + str + mem3 + str + mem4 + str + mem5;

                       var data = {
                            to : email,
                            query : fullinfo
                       }

                       var data1 = {
                            to : email
                       }

                       res.render('responsecult', {
                            regemail : email,
                            regphone : contact
                       });

                       em.kalakrithireg(data1);
                       em.kalakrithiinfo(data);
        });

        router.post('/controller/dramaregister', function(req, res) {
                      var name = req.body['bandname'],
                       email = req.body['bandemail'],
                       contact = req.body['bandcontact'],
                       inst = req.body['bandinst'],
                       evntname = "Albela, The Mono Acting Competition",
                       dd = req.body['dd'],
                       mm = req.body['mm'],
                       yy = req.body['yy'],
                       str = ", ",
                       str1 = "-",
                       dob = dd + str1 + mm + str1 + yy;

                       var fullinfo = evntname + str + name  + str + email + str + contact + str + dob + str + inst;

                       var data = {
                            to : email,
                            query : fullinfo
                       }

                       var data1 = {
                            to : email
                       }

                       res.render('responsecult1', {
                            regevent : "Albela, The Mono Acting Competition",
                            regemail : email,
                            regphone : contact
                       });

                       em.kalakrithireg(data1);
                       em.kalakrithiinfo(data);
        });

        router.post('/controller/danceregister', function(req, res) {
                      var name = req.body['bandname'],
                       email = req.body['bandemail'],
                       contact = req.body['bandcontact'],
                       evnt = req.body['bandevent'],
                       mem1 = req.body['bandmem1'],
                       mem2 = req.body['bandmem2'],
                       mem3 = req.body['bandmem3'],
                       mem4 = req.body['bandmem4'],
                       mem5 = req.body['bandmem5'],
                       mem6 = req.body['bandmem6'],
                       mem7 = req.body['bandmem7'],
                       mem8 = req.body['bandmem8'],
                       str = ", ",
                       fullinfo = name  + str + email + str + contact + str + evnt + str + mem1 + str + mem2 + str + mem3 + str + mem4 + str + mem5 + str + mem6 + str + mem7 + str + mem8;

                       var data = {
                            to : email,
                            query : fullinfo
                       }

                       var data1 = {
                            to : email
                       }

                       res.render('responsecult1', {
                            regevent : evnt,
                            regemail : email,
                            regphone : contact
                       });

                       em.kalakrithireg(data1);
                       em.kalakrithiinfo(data);
        });

        router.post('/controller/workshopregister', function(req, res) {
                      var name = req.body['inputName'],
                       user = req.body['inputEmail'],
                       workshopname = req.body['workshopname'],
                       email = req.body['inputEmail'],
                       phone = req.body['inputPhoneNumber'],
                       state = req.body['stateName'],
                       college = req.body['collegeName'],
                       dept = req.body['deptName']

                       res.render('responsework', {
                            regname : name,
                            regemail : email,
                            regworkshop : workshopname,
                            regphone : phone
                       });

                       em.registration(data);

        });

        router.get('/[0-9]', function(req, res) {
                res.redirect(errorPage);
        });

        router.get('*', function(req, res) {
                var match = 'views/' + req.params[0] + '.ejs';
                fs.exists(match, function(present) {
                        if(present) {
                                fs.readFile(match, function(err, data) {
                                        if(err) {
                                                res.send(errorPage.toStrng(), "UTF-8");
                                        }
                                        else {
                                                res.end(data, "UTF-8");
                                        }
                                });
                        }
                        else {
                                res.end(errorPage.toString(), "UTF-8");
                        }
                });
        });

        app.use('/', router);

        http.createServer(app).listen(port, function() {
                console.log("Front End Application Server started");
        });
}
