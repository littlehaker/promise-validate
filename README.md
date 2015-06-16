# promise-validate

Promise based validation solution.

## Install

`npm install promise-validate`

## Example

```javascript
var V = require('promise-validate');
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

// Pipe validators to a new validator.
validateEmail = V.pipe(V.isEmail('Please input a valid Email'), V.isLength('6-20 characters', 6, 20), myValidate('Oops'));

validateEmail('foo@bar.com').then(V.log, V.log); // [Error: Oops] or foo@bar.com
validateEmail('foobar').then(V.log, V.log); // [Error: Please input a valid Email]
```
