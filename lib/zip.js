/**
 * Created by awencheong on 2015/4/9.
 */
var EXEC = require('child_process').exec;

function Zip(){}

/*
 * @param   dir
 * @param   target_file, example: "some.zip"
 * @param   callback,   example: function(err){console.log(err.message);}
 */
Zip.compress = function(dir, target_file, callback) {
    EXEC('zip ' + target_file + ' ' + dir + ' -j -r -q', function(err, stdin, stdout){
        if (err) {
            callback(err);
            return;
        }
        callback(null);
    })
}

module.exports = Zip;

