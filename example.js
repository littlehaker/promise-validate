var V = require('./index');
var Q = require('Q');

// custom async validator
function myValidate(msg) {
    return function(val) {
        var dfd = Q.defer();
        setTimeout(function() {
            if (Math.random() > 0.5) {
                dfd.resolve(val);
            } else {
                dfd.reject(new Error(msg));
            }
        }, 1000);
        return dfd.promise;
    };
}

// Compose validator
validateEmail = V.pipe(
    V.isEmail('Please input a valid Email'),
    V.isLength('6-20 characters', 6, 20),
    myValidate('Oops')
);

validateEmail('foo@bar.com').then(V.log, V.log);
validateEmail('foobar').then(V.log, V.log);

// Direct use of validator
V.isIP('Please input an IP address')('127.0.0.1').then(V.log, V.log);
