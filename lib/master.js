/**
 * Created by awencheong on 2015/4/24
 *
 * 主进程，用于协调各个模块进程的通讯
 */

var child_process = require('child_process');

var children = {
    'master': {
        path: null,     /* required */
        process: process,   /* required */
        status: 'init',  /* required */
        on_error: function(err){}
    }
}

/*
 * @param   on_mymsg,   function(msg){},    optional, 用于处理主进程所接收到的消息
 * @param   on_error,   function(err){},    optional, 用于传递错误信息
 */
function Master(on_mymsg, on_error){
    if (on_mymsg && typeof on_mymsg != "function") {
        throw new Error("wrong message callback, should be a function")
    }
    if (on_error && typeof on_error != "function") {
        throw new Error("wrong error handler, should be a function")
    }

    /*
     * 主进程是父进程，不需要向其父进程发消息， 故重写其 send(), 用于处理 发给它 的 消息
     */
    if (on_mymsg) {
        process.send = on_mymsg;
    }
    if (on_error) {
        children['master'].on_error = on_error;
    }
}

Master.prototype.add_child = function (name, path) {
    children[name] = {
        path: path,
        process: null,
        status: 'init'
    }
    children[name].process = child_process.fork(path);
}

Master.prototype.child = function(name) {
    if (name != 'master' && children[name]) {
        return children[name].process;
    }
    return false;
}

Master.prototype.start = function(){

    /* 传递消息给各个进程 */
    var post = function(msg) {
        if (children[msg.receiver]) {
            children[msg.receiver].process.send(msg);

            /* 如果找不到目标进程，将会把消息发送给主进程 */
        } else {
            children['master'].process.send(msg);
        }
    }

    /* 建立起消息通道, 以方便协调各个子进程的通讯 */
    for (var c in children) {
        if (c != 'master') {
            children[c].process.on("message", post);
        }
    }

    /* 自动重启 */
    Object.keys(children).forEach(function(c){
        if (c != 'master') {
            c = children[c];
            c.process.on("exit", function() {
                c.process = child_process.fork(c.path);
            });

        }
    })

}

exports.Master = Master




/* 模块之间的交互
 *
 *  msg {
 *      succ: true  or false,  任务是否成功
 *      data: {         //任务对象
 *          id: 0faaa,  //任务ID
 *
 *          start: 2014-04-01 00:00 //log开始时间
 *          end: 2014-04-02 00:00   //log结束时间
 *          type: install   //log类型
 *          level: info     //log等级
 *          filter: {}  //过滤条件
 *
 *          target: ./data/0faaa.csv  or  ./data/0faaa.zip   //生成的目标文件
 *          target_size: 120k  or 100M or 1.5G  //生成的目标文件大小（可选）
 *      }
 *      errmsg: 错误信息
 *  }
 *
 */



