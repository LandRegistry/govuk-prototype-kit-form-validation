
validate.validators.postcode = function(value, options, key, attributes) {
 console.log(value);
 console.log(options);
 console.log(key);
 console.log(attributes);
 return "^postcode format is totally wrong";
};
