var forms = document.querySelectorAll('[data-validate]');
// Element.closest polyfill
if (!Element.prototype.matches) {
  Element.prototype.matches = Element.prototype.msMatchesSelector ||
                              Element.prototype.webkitMatchesSelector;
}
if (!Element.prototype.closest) {
  Element.prototype.closest = function(s) {
    var el = this;
    do {
      if (el.matches(s)) return el;
      el = el.parentElement || el.parentNode;
    } while (el !== null && el.nodeType === 1);
    return null;
  };
}

function getSubmitHandler(form, constraints) {
  return function submitHandler(e) {
    e.preventDefault()
    ;[].forEach.call(form.elements, function(el) {
      reset(el)
    })
    removeHiddenFormElements()
    var errors = validate(form, constraints)
    // Raise error summary
    errorSummary(errors)
    // Raise individual form errors
    if(errors) {
      for (name in errors) {
        if (errors.hasOwnProperty(name)) {
          raiseError(form, name, errors[name][0])
        }
      }
    } else {
      form.removeEventListener('submit', submitHandler)
      form.submit()
    }
  }
}
function removeHiddenFormElements() {
  // remove weird hidden inputs that the govuk prototype kit uses to remember unchecked $inputs
  ;[].forEach.call(document.querySelectorAll("input[value='_unchecked']"), function(item) {
    item.parentNode.removeChild(item)
  })
}
;[].forEach.call(forms, function(form) {
  var constraints = JSON.parse(document.getElementById(form.getAttribute('data-validate')).innerHTML)
  form.addEventListener('submit', getSubmitHandler(form, constraints))
})
function reset(element) {
  element.classList.remove('govuk-input--error')
  element.classList.remove('govuk-select--error')
  element.classList.remove('govuk-textarea--error')

  var formGroup =  element.closest('.govuk-form-group')

  if (element.classList.contains('govuk-date-input__input')) {
  	// Date inputs are doubly grouped - we want the parent one
  	formGroup = formGroup.parentNode.closest('.govuk-form-group')

  	// Mark all date inputs in this group as errored, not just the one
  	var allDateInputs = formGroup.querySelectorAll('.govuk-date-input__input')
  	;[].forEach.call(allDateInputs, function(input) {
  		input.classList.remove('govuk-input--error')
  	})
  }

  formGroup && formGroup.classList.remove('govuk-form-group--error')
  var errorMessage = element.parentNode.querySelector('.govuk-error-message')
  errorMessage && errorMessage.parentNode.removeChild(errorMessage)
}
function raiseError(form, name, error) {
  var elementErrorClass = false
  var element = NodeList.prototype.isPrototypeOf(form[name]) ? form[name][0] : form[name]
  var formGroup =  element.closest('.govuk-form-group')


  if (element.classList.contains('govuk-input')) {
    elementErrorClass = 'govuk-input--error'
  }
  if (element.classList.contains('govuk-select')) {
    elementErrorClass = 'govuk-select--error'
  }
  if (element.classList.contains('govuk-textarea')) {
    elementErrorClass = 'govuk-textarea--error'
  }
  if (elementErrorClass) {
    element.classList.add(elementErrorClass)
  }

  if (element.classList.contains('govuk-date-input__input')) {
  	// Date inputs are doubly grouped - we want the parent one
  	formGroup = formGroup.parentNode.closest('.govuk-form-group')

  	// Mark all date inputs in this group as errored, not just the one
  	var allDateInputs = formGroup.querySelectorAll('.govuk-date-input__input')
  	;[].forEach.call(allDateInputs, function(input) {
  		input.classList.add(elementErrorClass)
  	})
  }

  formGroup.classList.add('govuk-form-group--error')
  var errorMessage = document.createElement('span')
  errorMessage.classList.add('govuk-error-message')
  errorMessage.innerHTML = '<span class="govuk-visually-hidden">Error:</span> ' + error
  if (element.classList.contains('govuk-radios__input')) {
    element.closest('.govuk-radios').parentNode.insertBefore(errorMessage, element.closest('.govuk-radios'))
  } else if (element.classList.contains('govuk-date-input__input')) {
  	var dateGroup = element.closest('.govuk-date-input')
  	dateGroup.parentNode.insertBefore(errorMessage, dateGroup)
  } else if (element.classList.contains('govuk-checkboxes__input')) {
    element.closest('.govuk-checkboxes').parentNode.insertBefore(errorMessage, element.closest('.govuk-checkboxes'))
  } else {
    formGroup.insertBefore(errorMessage, form[name])
  }
}
function errorSummary(errors) {
  // Remove any previous error summary__body
  var previousSummary = document.querySelector('.govuk-error-summary')
  previousSummary && previousSummary.parentNode.removeChild(previousSummary)
  if (!errors) {
    return
  }
  var newErrorSummary = document.createElement('div')
  newErrorSummary.classList.add('govuk-error-summary')
  newErrorSummary.setAttribute('aria-labelledby', "error-summary-title")
  newErrorSummary.setAttribute('role', "alert")
  newErrorSummary.setAttribute('tabindex', "-1")
  newErrorSummary.setAttribute('data-module', "govuk-error-summary")
  newErrorSummary.innerHTML = '<h2 class="govuk-error-summary__title" id="error-summary-title">There is a problem</h2><div class="govuk-error-summary__body"><ul class="govuk-list govuk-error-summary__list"></ul></div>'
  newErrorSummaryList = newErrorSummary.querySelector('ul')
  for (name in errors) {
    if (errors.hasOwnProperty(name)) {
      var errorItem = document.createElement('li')
      var errorLink = document.createElement('a')
      errorLink.setAttribute('href', '#' + name)
      errorLink.textContent = errors[name][0]
      errorLink.addEventListener('click', function(e) {
        e.preventDefault()
        removeHiddenFormElements()
        var formGroup = document.querySelector('[name="' + this + '"]').closest('.govuk-form-group')
        var targetElement = document.getElementById(this)
        // date inputs are doubly grouped - we want the parent
        if (targetElement.classList.contains('govuk-date-input__input')) {
        	formGroup = formGroup.parentNode.closest('.govuk-form-group')
        }
        // put keyboard focus in the form control
        targetElement.focus()
        window.scrollTo(0, formGroup.offsetTop)
      }.bind(name))
      errorItem.appendChild(errorLink)
      newErrorSummaryList.appendChild(errorItem)
    }
  }
  document.querySelector('h1').parentNode.insertBefore(newErrorSummary, document.querySelector('h1'))
  newErrorSummary.focus()
}
