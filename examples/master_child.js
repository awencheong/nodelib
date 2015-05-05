/**
 * Created by awencheong on 2015/4/24.
 */
function json_encode(obj) {
    return JSON.stringify(obj)
}
process.on("message", function(msg){
    console.log("[child received]" + json_encode(msg))
    process.send({receiver:"master", data:"[child] i got you ..."})
    process.send("msg to unknown .....")
    process.send({receiver:"worker", data:"[child] i got worker ..."})
})

setInterval(function(){
    process.send({receiver:"worker", data:"here we go , i'm child"})
}, 1000)
