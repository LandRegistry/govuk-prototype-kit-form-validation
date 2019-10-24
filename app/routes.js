const express = require('express')
const router = express.Router()

// Add your routes here - above the module.exports line
router.use('/node_modules', express.static('node_modules'))


// /////////////////////////
// form validation example page
// /////////////////////////

router.post('/form-handler', function (req, res) {
  
  // serverside routing logic here

  // redirect to form complete page
	res.redirect('form-submitted')

})



module.exports = router
