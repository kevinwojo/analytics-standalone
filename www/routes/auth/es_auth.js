//require('dotenv').config();
var express = require('express');
var router = express.Router();
var fetch = require('node-fetch');

router.get('/login/es', function(req,res,next){
	//mock
	req.session.es_access_token = 'placeholder';
	req.session.es_access_token_secret = 'placeholder';
	req.session.save();
	
	res.redirect('/query');
});

module.exports = router;