var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var user = require('../models/user').user;
mongoose.connect('mongodb://localhost/hello');

var userData = {};
/* GET home page. */
router.get('/', function(req, res) {
  	res.render('index', { title: 'index' });
});

/*login*/
router.get('/login', function(req, res) {
 	 res.render('login', { title: 'login' });
});

/*logout*/
router.get('/logout', function(req, res) {
  	res.render('logout', { title: 'logout' });
});

/*hompage*/
router.post('/homepage', function(req, res) {
	var query_doc = {userid: req.body.userid, password: req.body.password};
	(function(){
		user.findOne(query_doc, function(err, doc){
			if(doc){
				console.log(query_doc.userid + ": login success in " + new Date());
				res.render('homepage', { title: 'homepage' });
				userData = doc;
			}else{
				console.log(query_doc.userid + ": login failed in " + new Date());
				res.redirect('/');
			}
		});
	})(query_doc);
});

/*add*/
router.get('/add', function(req, res) {
	res.render('add', { title: 'add' });
})

router.post('/add', function(req, res) {
	var query_doc = {userid: req.body.userid, password: req.body.password};
	var newUser = new user(query_doc);
	newUser.save(function(err) {
		if(err) {
			console.log('error')
		}else {
			res.render('index', { title: 'index' });
		}
	})
})

router.post('/modify', function(req, res) {	
	user.update({_id: userData._id}, {
		$set: {password: req.body.password}
	}, function(err) {
		if(err){
			console.log(err)
		}else{
			console.log('修改成功');
			res.render('homepage', { title: 'homepage' });
		}
	})
})

router.get('/list', function(req, res) {
	user.find(function(err, doc) {
		if(doc) {
			res.render('list', { users: doc});
		}else {
			res.render('list', { users: {}});
		}
	})
})

router.get('/del/:id', function(req, res) {
	user.remove({_id: req.params.id}, function(err, result) {
		if(result) {
			user.find(function(err, doc) {
				if(doc) {
					res.render('list', { users: doc});
				}
			})
		}
	})
})


module.exports = router;