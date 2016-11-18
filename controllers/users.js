var User = require('../models/user');
var Blog = require('../models/blog');
var bcrypt = require('bcryptjs');

exports.showSignup = function (req, res) {
    res.render('signup', {
        title: '注册页面'
    })
};

exports.showSignin = function (req, res) {
    res.render('signin', {
        title: '登录页面'
    })
};

exports.showUpdate = function (req, res) {
    var username = req.params.username;
    // if (username == req.session.user.username) {
        res.render('user_update', {
            title: '用户更新页面',
            username: username
        })
    // } else {
    //     res.render('signin', {title: '请登录您自己的账号，方可更新'})
    // }
};

exports.update = function (req, res) {
    var _user = req.body.user;

    //对密码加盐
    bcrypt.genSalt(10, function (err, salt) {
        if (err) console.log(err);
        bcrypt.hash(_user.password, salt, function (err, hash) {
            if (err) console.log(err);
            _user.password = hash;
            console.log(_user.password);

            User.findOne({username: _user.username}, function (err, user) {
                if (err) console.log(err);
                var conditions = {username: _user.username};
                var update = {
                    $set: {
                        password: _user.password,
                        email: _user.email,
                        address: _user.address,
                        meta: {
                            updateAt: Date.now()
                        }
                    }
                };
                var options = {upsert: true};

                user.password = _user.password;
                user.email = _user.email;
                user.address = _user.address;
                user.meta.updateAt = Date.now();

                User.update(conditions, update, options, function (err) {
                    if (err) console.log(err);
                    req.session.user = user;
                    res.redirect('/user/info/' + user.username);
                })
            });

        });
    });
};

exports.delete = function (req, res) {
    var username = req.params.username;
    User.remove({username: username}, function (err) {
        if (err) console.log(err);
        res.redirect('/user/list/info');
    })
};

exports.singUp = function (req, res) {
    var _user = req.body.user;
    console.log(_user);
    User.findOne({username: _user.username}, function (err, user) {
        if (err) console.log(err);

        if (user) {
            console.error("用户名已存在!");
            res.redirect('/signin');
        }
        else {
            user = new User(_user);
            user.save(function (err, user) {
                if (err) console.log(err);
                console.info("注册成功，请重新登录。");
                res.redirect('/signin');
            })
        }
    })
};

exports.signIn = function (req, res) {
    var _user = req.body.user;
    console.log(_user);
    var username = _user.username;
    var password = _user.password;

    User.findOne({username: username}, function (err, user) {
        if (err) console.log(err);

        if (!user) {
            console.error('请先注册再登录');
            res.redirect('/signup');
        } else {
            user.comparePassword(password, function (err, isMatch) {
                if (err) console.log(err);
                if (isMatch) {
                    console.info('password is matched.');
                    req.session.user = user;
                    return res.redirect('/');
                } else {
                    console.error('密码错误，请重新登录');
                    res.redirect('/signin');
                }
            })
        }
    })
};

exports.logout = function (req, res) {
    delete req.session.user;
    res.redirect('/');
};

exports.userInfo = function (req, res) {
    var username = req.params.username;
    User.findOne({username: username}, function (err, user) {
        if (err) console.log(err);
        if (!user) {
            console.log('没有这个用户');
        } else {
            Blog.find({author: username}, function (err, blogs) {
                if (err) console.log(err);
                else {
                    res.render('user_info', {
                        title: '用户信息',
                        _user: user,
                        blogs: blogs
                    })
                }
            });
        }
    })
};

exports.userListInfo = function (req, res) {
    User.fetch(function (err, users) {
        if (err) console.log(err);
        res.render('users_info', {
            title: '用户管理页',
            users: users
        })
    })
};

exports.checkSignIn = function (req, res, next) {
    var user = req.session.user;
    if (!user) {
        return res.redirect('/signin')
    }
    next()
};
