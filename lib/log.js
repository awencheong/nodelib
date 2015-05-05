/**
 * Created by awencheong on 2015/4/8.
 *
 */


var fs = require("fs");
var path = require('path');

/*
 * @param   target,  文件路径，其中可以使用 'Y'(年份), 'M'(月份), 'D'(日期), 'H'(小时), 'm'(分钟) 来确定文件的格式
 *
 *          例如： 值为 /path/to/log/{YYYY-MM-DD_hh:mm}.log   的   target参数表示模块将在目录  /path/to/log/下面生成下列的文件
 *                  2014-01-02_11:11.log    2014-01-02_11:12.log    2014-01-02_11:13.log    2014-01-02_11:14.log    ...
 *
 *                值为 /path/to/log/{YYYY-MM-DD}/myprefix_{hh:mm}.log 的 target参数则会创建一个目录
 *                2014-01-02, 然后在改目录下按照分钟切分，生成log
 *                  2014-01-02/myprefix_11:11.log   2014-01-02/myprefix_11:12.log   2014-01-02/myprefix_11:13.log
 *
 *
 */
function Log(target){
    if (!target) {
        this.w = console_log_writer();
    } else if (typeof target == "string") {
        this.w = file_log_writer(this);
        this.target = target;
    } else {
        throw new Error("wrong Log param[target]: " + target);
    }
}

function console_log_writer(){
    return {
        write: function(str) {
            console.log(str);
        }
    }
}

function file_log_writer(log){
    return {
        log: log,
        write: function(str) {
            //获得log file path
            var d = new Date();
            var target = this.log.target;
            var chips = target.match(/\{[^{}]*\}/g)
            var replace = [];
            chips.forEach(function(c){
                var m = c;
                c = c.replace(/Y+/g, d.getFullYear());
                c = c.replace(/M+/g, d.getMonth());
                c = c.replace(/D+/g, d.getDate());
                c = c.replace(/H+/g, d.getHours());
                c = c.replace(/m+/g, d.getMinutes());
                c = c.replace(/[{}]/g, "");
                replace.push({
                    'match': m,
                    'replace': c
                })
            })
            replace.forEach(function(r){
                target = target.replace(r.match, r.replace);
            })

            fs.appendFile(target, content + "\n", function(err){
                if (err) {
                    console.log(err.stack);
                }
            });
        }
    }
}

function join_args(args) {
    var mem_usage = process.memoryUsage();
    if (CFG.show_mem) {
        var usage = parseInt(mem_usage.heapUsed / 1024 / 1024);
        var rss = parseInt(mem_usage.rss / 1024 / 1024);
        str = '[mem_usage][heapUsed:' + usage + 'm rss:' + rss + 'm]';
    } else {
        var str = '';
    }
    for (var i in args) {
        str +=  conf.split + args[i] ;
    }
    return str;
}

function time(){
    var now = new Date();
    return "[" + now.toUTCString() + "]";
}

Log.prototype.debug = function() {
    this.w.write(time() + "[DEBUG]" + join_args(arguments));
}

Log.prototype.info = function(){
    var tag = arguments[0];
    delete arguments[0];
    this.w.write(time() + "[" + tag + "]" + join_args(arguments));
}

Log.prototype.error = function() {
    this.w.write(time() + "[ERROR]" + join_args(arguments));
}

module.exports = Log;
