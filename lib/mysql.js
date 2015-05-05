/**
 * Created by awencheong on 2015/4/1.
 */

var Q = require('q');
var MYSQL = require('mysql');
var CFG = require('./config.json');

function Mysql(){}

function conn() {
    return  MYSQL.createConnection({
        host     : CFG.mysql.host,
        user     : CFG.mysql.user,
        password : CFG.mysql.passwd,
        database : CFG.mysql.dbname
    });
}

Mysql.conn = function(){
    return conn();
}

Mysql.query = function (sql) {
    var def = Q.defer();
    var c = conn();
    c.connect(function(err) {
        if (err) {
            c.end();
            def.reject(err);
        }
        c.query(sql, function(err, rows){
            if (err) {
                c.end();
                def.reject(new Error("[error]" + err.message));
            }
            c.end();
            def.resolve(rows);
        })
    });
    return def.promise;
}

module.exports = Mysql;


