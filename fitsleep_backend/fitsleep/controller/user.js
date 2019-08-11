var model = require('../model');
var User = model.User;
var crypto = require('crypto');

var getMd5Str = function(str){
    var md5 = crypto.createHash('md5');
    return md5.update(str.trim()).digest('hex');
};

exports.initUser = function(req, res){
    User.update({name: 'atlas'}, {$set: {
        name: 'atlas',
        email: 'api@atlasyun.com',
        nickname: '測試帳號',
        phone:'0910123456',
        group:'護理師',
        password: getMd5Str('atlas123'),
        isAdmin: true
    }},{upsert: true}, function(err, ret ){
        if(err){
            res.json(500, {message: err.toString()});
        }else{
            res.json(201, ret);
        }
    });
};

exports.addNewUser = function(req, res){
    var newName = req.body.name,
        nickname = req.body.nickname,
        group = req.body.nickname,
        phone = req.body.phone,
        pwd = req.body.pwd,
        email = req.body.email;
    if(!newName || !pwd){
        return res.json(500, {message: 'Error: Lost args.'});
    }
    var newUser = new User({
        name: newName,
        email: email,
        nickname: nickname,
        phone: phone,
        group: group,
        password: pwd,
        isAdmin: false
    });
    newUser.save(function(err, ret){
        if(err){
            res.json(500, {message: err.toString()});
        }else{
            res.json(201, ret);
        }
    })
};

exports.updateUser = function(req, res){
    var id = req.body._id,
        newName = req.body.name,
        pwd = req.body.pwd,
        email = req.body.email || '',
        nickname = req.body.nickname || '',
        group = req.body.group || '',
        phone = req.body.phone || '',
        enabled = req.body.enabled || true;
    if(!newName){
        return res.json(500, {message: 'Error: Lost args.'});
    }
    var update;
    if(pwd){
        update = {
            name: newName,
            nickname: nickname,
            phone: phone,
            group: group,
            email : email,
            password: pwd,
            enabled: enabled
        }
    }else{
        update = {
            name: newName,
            nickname: nickname,
            phone: phone,
            group: group,
            email: email,
            enabled: enabled
        }
    }
    User.update({_id: id},{$set: update},function(err, ret){
        if(err){
            res.json(500, {message: err.toString()});
        }else{
            res.json(200, {message: 'ok'});
        }
    })
};

exports.getAllUsers = function(req, res){
    User.getAll(function(err, ret){
        if (err) {
            res.json(500, {message: err.toString()});
        }else{
            res.json(200, { data: ret});
        }
    })
};

exports.checkUser = function(req, res){
    var userName = req.body.userName;
    var pwd = req.body.pwd;
    
    User.getOneByNameAndPassword(userName, pwd, function (err, ret) {
        if (err) {
            res.json(403, { message: err.toString() });
        } else if (ret == null)
        {
            res.json(403, { message: 'Unauthorized' });
        }else{
            req.session.loginUser = ret;
            res.json(200, 'success');
        }
    })

};

exports.delUser = function (req, res) {

    var id = req.body._id;

    User.remove({_id: id}, function (err) {
        if (err) {
            res.json(500, { message: err.toString() });
        } else {
            res.json(200, 'success');
        }
    })

};

exports.loginOut = function(req, res){
    req.session.destroy();
    res.json({message: 'ok'});
};

exports.isOnline = function(req, res){
    var flag = false;
    if(req.session.loginUser){
       flag = true;
    }
    res.jsonp(200, {status: flag});
}
