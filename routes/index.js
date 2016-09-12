var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var user = require('../models/user').user;
mongoose.connect('mongodb://localhost/hello');

var userData = {};
var result = {};
result.data = {};

//页面路由
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

router.get('/list', function(req, res) {
  	res.render('list', { title: 'list', users: {} });
});

/*add*/
router.get('/add', function(req, res) {
	res.render('add', { title: 'add' });
})

/*hompage*/
router.get('/homepage', function(req, res) {
	res.render('homepage', { title: 'homepage', userData });
});

//api，其实路由和api都差不多的，路由是单纯请求页面，api则是对数据库操作，然后返回json
router.post('/add', function(req, res) {
	var query_doc = {userid: req.body.userid, password: req.body.password};
	var newUser = new user(query_doc);
	newUser.save(function(err) {
		if(err) {
			result.status = -1;
			res.send(result);
		}else {
			result.status = 1;
			result.data = query_doc;
			res.send(result);
		}
	})
})

router.post('/login', function(req, res) {
	var query_doc = {userid: req.body.userid, password: req.body.password};
	user.findOne(query_doc, function(err, doc){
			if(doc){
				userData = doc;
				result.data = doc;
				result.status = 1;
				res.send(result)
			}else{
				//res.redirect('/');
				result.status = -1;
				res.send(result);
			}
		});
})

router.post('/modify', function(req, res) {	
	user.update({_id: userData._id}, {
		$set: {password: req.body.password}
	}, function(err) {
		if(err){
			result.status = -1;
			res.send(result);
		}else{
			result.status = 1;
			result.data = {
				userid: userData._id,
				password: req.body.password
			};
			res.send(result);
		}
	})
})

router.get('/getUsers', function(req, res) {
	user.find(function(err, doc) {
		if(doc) {
			result.status = 1;
			result.data = doc;
			res.send(result);
		}else {
			result.status = -1;
			res.send(result);
		}
	})
})

//第一种del api的写法
router.get('/del/:id', function(req, res) {
	user.remove({_id: req.params.id}, function(err, doc) {
		if(doc) {
			result.status = 1;
			result.data = doc;
			res.send(result);
		}else{
			result.status = -1;
			res.send(result);
		}
	})
})

//第二种del api的写法
router.post('/del', function(req, res) {
	var query_doc = {userid: req.body.userid};
	user.findOne(query_doc, function(err, doc){
			if(doc){
				user.remove({_id: doc._id}, function(err, doc2) {
					if(doc2) {
						result.status = 1;
						result.data = query_doc;
						res.send(result);
					}else{
						result.status = -1;
						result.data.text = '删除失败'
						res.send(result);
					}
				})
			}else{
				result.status = -1;
				result.data.text = '没找到用户'
				res.send(result);
			}
		});
})

module.exports = router;