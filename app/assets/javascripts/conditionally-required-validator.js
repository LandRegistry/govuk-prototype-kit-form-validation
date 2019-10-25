
validate.validators.conditionallyRequired = function(value, options, key, attributes) {
 var dependent = document.querySelector('[name=' + options.dependentOn.name + ']:checked')

 var message = options.message || this.message || "is required";

 if(dependent) {
	 if (dependent.value === options.dependentOn.value) {
	 	return message
	 }
	}
};
