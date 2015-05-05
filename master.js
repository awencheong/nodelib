/**
 * Created by awencheong on 2015/4/17.
 *
 * 主进程，用于协调各个模块进程的通讯
 */

var child_process = require('child_process');
var Log = require('./log.js');
Log = new Log(null);    //console.log


var fetcher = child_process.fork("./fetch_data_from_log.js");
var server = child_process.fork("./http_server.js");
var sender = child_process.fork("./process_data_and_mail.js");

/*
 * 消息通道
 */
var msg_channels = {
    'master': null,  // required ,  null表示消息的接收人是本进程
    'fetcher': fetcher,
    'server': server,
    'sender': sender
}

function post(msg) {
    if (msg_channels[msg.receiver] === null) {
        process(msg)
        return;
    }
    if (msg_channels[msg.receiver]) {
        msg_channels[msg.receiver].send(msg);
    } else {
        Log.error("unknown message receiver:" + msg.receiver)
    }
}

/*
 * 主进程对消息的处理
 */
function process(msg) {

}

/* 自动重启 */
fetcher.on("exit", function(){
    fetcher = child_process.fork("./fetch_data_from_log.js");
    fetcher.send("start");
})



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

fetcher.on("message", post)

server.on("message", post)

sender.on("message", post)




