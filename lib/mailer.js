/**
 * Created by awencheong on 2015/4/1.
 */
var nodemailer = require('nodemailer');
var CFG = require('./config.json');
var Q = require('q');

/*
 * options: {
 *      "mailto": string,   //收信人,
 *      "url": [],          //链接数组,
 * }
 */
function Mailer (options) {
    if (!options) {
        options = {};
    }
    var def = Q.defer();

    var transporter = nodemailer.createTransport({
        service: CFG.email.service,
        auth: {
            user: CFG.email.user,
            pass: CFG.email.passwd
        }
    });

    var mailOptions = {
        from: CFG.email.username + '<'+ CFG.email.user +'>', // sender address
        to: options.mailto ? options.mailto : CFG.email.mailto, // list of receivers
        subject: CFG.email.subject, // Subject line
        text: CFG.email.text, // plaintext body
        html: options.html ?  options.html : CFG.email.html // html body
    };

    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            def.reject(error);
        }else{
            def.resolve(info);
        }
    });
    return def.promise;
}

module.exports = Mailer;
