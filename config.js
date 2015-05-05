/**
 * Created by awencheong on 2015/4/17.
 */

var DEBUG = 1;
if (DEBUG) {
    exports = require('./config.debug.js');
} else {
    exports = require('./config.release.js');
}