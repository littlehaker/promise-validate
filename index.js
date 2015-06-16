var R = require('ramda');
var validator = require('validator');
var Q = require('Q');

var pickMethods = R.pipe(R.keys, R.filter(R.test(/^is/)));

// get all validate methods;
var methods = pickMethods(validator);
methods = R.concat(['equals', 'matches', 'contains'], methods);

var V = {};

function promisify(fn) {
    var new_fn = function() {
        var args = Array.prototype.slice.call(arguments);
        var msg = args[0];
        return function(val) {
            var new_args = R.concat([val], R.drop(1, args));
            var dfd = Q.defer();
            if (fn.apply(this, new_args)){
                dfd.resolve(val);
            } else {
                dfd.reject(new Error(msg));
            }
            return dfd.promise;
        };
    };
    return new_fn;
}

function makeFn(key) {
    var fn = validator[key];
    var new_fn = promisify(fn);
    V[key] = new_fn;
    return new_fn;
}

R.map(makeFn, methods);

if (console && console.log) {
    V.log = console.log.bind(console);
}
V.R = R;
V.promisify = promisify;
V.pipe = R.pipeP;
V.compose = R.composeP;
V.validator = validator;
module.exports = V;

/* custom validator
function myValidate(msg) {
    return function(val) {
        var dfd = Q.defer();
        setTimeout(function() {
            dfd.reject(new Error(msg));
        }, 1000);
        return dfd.promise;
    };
}
*/

// validateEmail = V.pipe(V.isEmail('请输入邮箱'), V.isLength('最长8个字符', 0, 20), myValidate('出错啦'));
// validateEmail('foo@bar').then(V.log, V.log);
