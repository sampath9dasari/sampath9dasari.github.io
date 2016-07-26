/*
 * Database Model and Other Operations
 * Team pclubGU
 * The MIT License
 */
var r = require('rethinkdb'),
    moment = require('moment'),
    dbconf = require('./config').db,
    useConnPooling = false,
    connPool = null;

function connection(callback) {
        if(useConnPooling) {
                console.log("[LOGINFO] Starting a Pooled connection");
                connPool.acquire(function(err, conn) {
                        if(err) {
                                callback(err);
                        }
                        else {
                                console.log("[LOGINFO] Pooled a connection %s", conn._id);
                        }
                });
        }

        else {
                r.connect({
                        host: dbconf.host,
                        port: dbconf.port
                }, function(err, conn) {
                        if(err) {
                                console.log("[LOGERR] Couldnot connect to the port %s", dbconf['host'], dbconf['port']);
                                callback(err);
                        }
                        else {
                                conn.use(dbconf.db);
                                console.log("[LOGINFO] Connected");
                                callback(null, conn);
                        }
                });
        }
}

function free(conn) {
        console.log("[LOGINFO] Releasing the connection %s", conn._id);
        if(useConnPooling) {
                connPool.release(conn);
        }
        else {
                conn.close();
        }
}

function md5(str) {
        return crypto.createHash('md5').update(str).digest('hex');
}

function gensalt() {
        crypto.randomBytes('256', function(err, buf) {
                if(err) throw err;
                return buf;
        });
}

function saltandhash(pass, callback) {
        var salt = gensalt();
        callback(salt, md5(pass + salt));
}

function validate(pass, passwithhash, callback) {
        var salt = passwithhash.substr(0, 10);
        var newhash = salt + md5(pass + salt);
        callback(null, passwithhash == newhash);
}

function update(newdata, callback) {
        connection(function(err, conn) {
                if(err) {
                        console.log("[LOGERR] %s:%s", err.name, err.msg);
                        return callback(err);
                }

                r.table("mainaccounts").filter({user: newdata.user}).limit(1).update(newdata).run(conn, function(err, data) {
                                if(err) {
                                        console.log("[LOGERR] %s:%s", err.name, err.msg);
                                        callback(err.msg);
                                }
                                else if(data.replaced == 1) {
                                        callback(null, newdata);
                                }
                                else {
                                        callback(false);
                                }
                                release(conn);
                        }
                )
        });
}

if(typeof dbconf.pool == 'object') {
        var g = require('generic-pool'),
            pool = g.Pool({
                    name: 'rethinkdb',
                    min: dbconf.pool.min || 5,
                    max: dbconf.pool.max || 100,
                    log: dbconf.pool.log || true,
                    idleTimeoutMillis: dbconf.pool.idleTimeoutMillis || 60000,
                    reapIntervalMillis: dbconf.pool.reapIntervalMillis || 30000,
                    create: function(callback) {
                            r.connect({
                                    host: dbconf.host,
                                    port: dbconf.port
                            }, function(err,conn) {
                                    if(err) {
                                            var msg = "Connection failed !";
                                            console.log("[LOGERR] Couldn't connect to the rethinkdb pool");
                                            callback(new Error(msg));
                                    }
                                    else {
                                            var id = Math.floor(Math.random()*10000);
                                            conn.use(dbconf.db);
                                            console.log("[LOGINFO] connected to the database %s", dbconf.db);
                                            callback(null, conn);
                                    }
                            });
                    },
                    destroy: function(conn) {
                            console.log("[LOGINFO] connection has been closed");
                            conn.close(conn);
                    }
            })
}

module.exports.alogin = function(user, pass, callback) {
        connection(function(err, conn) {
                if(err) {
                        console.log("[LOGERR] %s:%s", err.name, err.msg);
                        return callback(null);
                }

                r.table("mainaccounts").filter({user: user}).run(conn, function(err, data) {
                        if(err) {
                                console.log("[LOGERR] Couldnot login %s:%s", err.name, err.msg);
                                return callback(null);
                        }
                        if(!data.hasNext()) {
                                console.log("[LOGERR] User %s not available", user);
                                release(conn);
                                return callback(null);
                        }

                        data.next(function(err, res) {
                                if(err) {
                                        console.log("[OGERR] %s:%s", err.name, err.msg);
                                        callback(null);
                                }
                                else {
                                        if(data.pass === pass) {
                                                callback(res);
                                        }
                                        else {
                                                console.log("[LOGERR] User %s's password doesn't match", user);
                                                callback(null);
                                        }
                                }
                                release(conn);
                        });
                });
        });
}

module.exports.login = function(user, pass, callback) {
        connection(function(err, conn) {
                if(err) {
                        console.log("[LOGERR] %s:%s", err.name, err.msg);
                        callback(null);
                        return;
                }

                r.table("mainaccounts").filter({user: user}).limit(1).run(conn, function(err, data) {
                        if(err) {
                                console.log("[LOGERR] %s:%s", err.name, err.msg);
                                callback(null);
                        }
                        else {
                                if(data.hasNext()) {
                                        data.next(function(err, val) {
                                                if(err) {
                                                        console.log("[LOGERR] %s:%s", err.name, err.msg);
                                                        release(conn);
                                                }
                                                else {
                                                        validate(pass, val.pass, function(err, res) {
                                                                if(res) {
                                                                        callback(null, val);
                                                                }
                                                                else {
                                                                        callback("invalid password");
                                                                }
                                                                release(conn);
                                                        });
                                                }
                                        });
                                }
                                else {
                                        console.log("[LOGINFO] User %s not found, %s", err.name, err.msg);
                                        callback("user not found");
                                        release(conn);
                                }
                        }
                });
        });
}

module.exports.getData = function(callback) {
        connection(function(err, conn) {
                if(err) {
                        return callback(err);
                }

                r.table("mainaccounts").run(conn, function(err, data) {
                        if(err) {
                                release(conn);
                                return callback(err);
                        }

                        data.toArray(function(err, res) {
                                if(err) {
                                        callback(err);
                                }
                                else {
                                        callback(null, res);
                                }
                                release(conn);
                        });
                });
        });
}

module.exports.accAdd = function(newdata, callback) {
        connection(function(err, conn) {
                if(err) {
                        console.log("[LOGERR] %s:%s", err.name, err.msg);
                        callback(err);
                        return
                }

                r.table("mainaccounts").filter(function(doc) { return r.or(doc('user').eq(newdata.user), doc('email').eq(newdata.email));})
                .limit(1).run(conn, function(err, data) {
                        if(err) {
                                console.log("[LOGERR] %s:%s", err.name, err.msg);
                        }
                        else {
                                if(data.hasNext()) {
                                        data.next(function(err, res) {
                                                if(err) {
                                                        console.log("[LOGERR] %s:%s", err.name, err.msg);
                                                }
                                                else {
                                                        if(res.user == newdata.user) {
                                                                callback("username taken");
                                                        }
                                                        else {
                                                                callback("email taken");
                                                        }
                                                }
                                                release(conn);
                                        });
                                }
                                else {
                                        saltandhash(newdata.pass, function(hash) {
                                                newdata.pass = hash;
                                                newdata.date = moment().format('MMMM Do YYYY, h:mm:ss a');

                                                r.table("accounts").insert(newdata).run(conn, function(err, res) {
                                                        if(res && res.inserted == 1) {
                                                                newdata['id'] = res['generatedkeys'][0];
                                                                callback(null, newdata);
                                                        }
                                                        else {
                                                                console.log("[LOGERR] %s:%s", err.name, err.msg);
                                                                callback(null);
                                                        }
                                                        release(conn);
                                                });
                                        });
                                }
                        }
                });
        });
}

module.exports.accInfo = function(email, pwd, callback) {
        connection(function(err, conn) {
                if(err) {
                        return callback(null);
                }

                r.table("mainaccounts").filter({email: email, pass: pwd}).limit(1).run(conn, function(err, data) {
                        if(err) {
                                console.log("[LOGERR] %s:%s", err.name, err.msg);
                                callback(null);
                                release(conn);
                        }
                        else {
                                data.next(function(err, res) {
                                        if(err) {
                                                callback(err);
                                        }
                                        else {
                                                callback('ok');
                                        }
                                        release(conn);
                                });
                        }
                }
        )
        });
}

module.exports.accUpdate = function(newdata, callback) {
        if(newdata.pass === '') {
                delete newdata.pass;
                update(newdata, callback);
        }
        else {
                saltandhash(newdata.pass, function(hash) {
                        newdata.pass = hash;
                        update(newdata, callback);
                })
        }
}

module.exports.accUpdatePwd = function(email, newpwd, callback) {
        saltandhash(newpwd, function(hash) {
                connection(function(err, conn) {
                        if(err) {
                                console.log("[LOGERR] %s:%s", err.name, err.msg);
                                return callback(err);
                        }

                        r.table("mainaccounts").filter({email: email}).limit(1).update({pass: hash}).run(conn, function(err, res) {
                                if(res && res.replaced === 1) {
                                        callback(true);
                                }
                                else {
                                        callback(false);
                                }
                                release(conn);
                        }
                );
        });
});
}

module.exports.accDelete = function(id, callback) {
        connection(function(err, conn) {
                if(err) {
                        return callback(err);
                }

                r.table("mainaccounts").get(id).delete().run(conn, function(err, res) {
                        if(err || res.deleted !== 1) {
                                callback(false);
                        }
                        else {
                                callback(null, true);
                        }
                        release(conn);
                });
        });
}


