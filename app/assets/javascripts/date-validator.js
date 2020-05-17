// https://github.com/uxitten/polyfill/blob/master/string.polyfill.js
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padStart
if (!String.prototype.padStart) {
    String.prototype.padStart = function padStart(targetLength, padString) {
        targetLength = targetLength >> 0; //truncate if number, or convert non-number to 0;
        padString = String(typeof padString !== 'undefined' ? padString : ' ');
        if (this.length >= targetLength) {
            return String(this);
        } else {
            targetLength = targetLength - this.length;
            if (targetLength > padString.length) {
                padString += padString.repeat(targetLength / padString.length); //append to original to ensure we are longer than needed
            }
            return padString.slice(0, targetLength) + String(this);
        }
    };
}

validate.validators.date = function(value, options, key, attributes) {
  var day = document.querySelector('[name=' + options.namePrefix + '-day]')
  var month = document.querySelector('[name=' + options.namePrefix + '-month]')
  var year = document.querySelector('[name=' + options.namePrefix + '-year]')

  var dateIsValid = moment(day.value.padStart(2, '0') + '/' + month.value.padStart(2, '0') + '/' + year.value, 'DD/MM/YYYY', true).isValid()
//  console.log(day.value.padStart(2, '0') + '/' + month.value.padStart(2, '0') + '/' + year.value, dateIsValid)
 
 	if (!dateIsValid) {
 		return options.message ? options.message : 'should be a valid date'
 	}
};
