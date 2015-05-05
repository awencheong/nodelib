/**
 * Created by awencheong on 2015/4/24.
 */
function json_encode(obj) {
    return JSON.stringify(obj)
}
process.on("message", function(msg) {
    console.log("[worker received]" + json_encode(msg));
})
