var mongoose = require('mongoose');
var config = require('./config');

var db_conn = mongoose.createConnection(config.DB_URI.fitsleep);

var dbs = [{ conn: db_conn, url: config.DB_URI.fitsleep }];

dbs.forEach(function (db) {
    var conn = db.conn;
    conn.on('connected', function () {
        console.log('-- mongoDB connection opened: %s --', db.url);
    });

    conn.on('error', function (err) {
        console.log('-- mongoDB error: %s --', err);
    });

    conn.on('disconnected', function () {
        console.log('-- mongoDB connection closed: %s', db.url);
    });

    process.on('SIGINT', function () {
        conn.close(function () {
            console.log('mongoDB connection closed through app termination, %s', db.url);
            process.exit(0);
        })
    });
});

module.exports = {
    db_conn: db_conn
};
