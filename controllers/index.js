var Blog = require('../models/blog');

exports.index = function (req, res) {
    res.render('index', {
        title: '首页'
    });
};

exports.search = function (req, res) {
    if (req.query.q) {
        var reg = new RegExp(req.query.q, 'i');
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
            res.render('search_result', {
                title: '搜索结果',
                blogs: blogs
            })
        }
    })
};
