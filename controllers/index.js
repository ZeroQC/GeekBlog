var Blog = require('../models/blog');

exports.index = function (req, res) {
    res.render('index', {
        title: '首页'
    });
};

exports.search = function (req, res) {
    var reg;
    if (req.query.q) {
        reg = new RegExp(req.query.q, 'i');
    } else {
        return res.render('search_result', {
            title: '搜索结果',
            blogs: "",
            message: '搜索内容不能为空'
        })
    }
    var query = {
        $or: [
            {title: {$regex: reg}},
            {content: {$regex: reg}}
        ]
    };

    Blog.find(query, function (err, blogs) {
        if (err) console.log(err);
        else {
            if (blogs == "") {
                res.render('search_result', {
                    title: '搜索结果',
                    blogs: blogs,
                    message: '抱歉，没有找到和' + req.query.q + '有关的内容'
                })
            } else {
                res.render('search_result', {
                    title: '搜索结果',
                    blogs: blogs
                })
            }
        }
    })
};
