/**
 * Created by awencheong on 2015/4/23.
 */
function json_encode(obj) {
    return JSON.stringify(obj)
}

var Master = require("../lib/master.js").Master;
Master = new Master(function(msg){
    console.log("[master received]" + json_encode(msg))
}, function(err) {
    console.log(err.stack)
})

Master.add_child("child", "./child.js")
Master.add_child("worker", "./workera.js")
Master.start();
Master.child('child').send({act:"start"});
Master.child('child').send({act:"start"});

//var d = new Date();
//target = "/path/to/{YYYY-MM HH}/here_/{YYY-YY}/{DD-HH:mm}.log";
//var chips = target.match(/\{[^{}]*\}/g)
//var replace = [];
//chips.forEach(function(c){
//    var m = c;
//    c = c.replace(/Y+/g, d.getFullYear());
//    c = c.replace(/M+/g, d.getMonth());
//    c = c.replace(/D+/g, d.getDate());
//    c = c.replace(/H+/g, d.getHours());
//    c = c.replace(/m+/g, d.getMinutes());
//    c = c.replace(/[{}]/g, "");
//    replace.push({
//        'match': m,
//        'replace': c
//    })
//})
//
//replace.forEach(function(r){
//    target = target.replace(r.match, r.replace);
//})
//
//console.log(target)
//
//
//
//
