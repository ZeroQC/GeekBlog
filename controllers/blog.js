var Blog = require('../models/blog');

exports.showBlog = function (req, res) {
    Blog.fetch(function (err, blogs) {
        if (err) console.log(err);
        res.render('blog', {
            title: '博客页',
            blogs: blogs
        });
    });
};

exports.showBlogByPaging = function (req, res) {
    var search = {};
    var page = {
        limit: 4,
        num: 1
    };
    if (req.params.p) {
        page['num'] = req.params.p < 1 ? 1 : req.params.p;
    }

    var skip = (page.num * page.limit) - page.limit;
    var query = Blog.find(search).sort({'meta-updateAt': -1}).skip(skip).limit(page.limit);

    query.exec(function (err, results) {
        if (err) console.log(err);
        else {
            Blog.count(search, function (err, count) {
                if (err) console.log(err);
                else {
                    var pageCount = Math.ceil(count / page.limit);
                    page['pageCount'] = pageCount;
                    page['size'] = results.length;
                    page['numberOf'] = pageCount > 5 ? 5 : pageCount;
                    return res.render('blog', {
                        title: '博客页分页',
                        blogs: results,
                        page: page
                    });
                }
            })
        }
    });
};

exports.showBlogCategory = function (req, res) {
    Blog.fetch(function (err, blogs) {
        if (err) console.log(err);
        res.render('blog_category', {
            title: '博客分类页',
            blogs: blogs
        });
    });
};

exports.showBlogNew = function (req, res) {
    res.render('blog_new', {
        title: '添加博客页'
    });
};

exports.new = function (req, res) {
    var _blog = req.body.blog;
    var user = req.session.user;
    Blog.findOne({title: _blog.title}, function (err, blog) {
        if (err) console.log(err);
        if (blog) {
            console.error("博客标题已存在，请换一个");
            res.redirect('/blog/show/new');
        } else {
            blog = new Blog(_blog);
            blog.author = user.username;
            blog.save(function (err) {
                console.log('博客发布成功');
                res.redirect('/blog/show/paging/1');
            })
        }
    })
};

exports.showBlogUpdate = function (req, res) {
    var blog_title = req.query.title;
    var username = req.query.username;
    res.render('blog_update', {
        title: '博客更新页面',
        blog_title: blog_title,
        username: username
    })
};

exports.updateBlog = function (req, res) {
    var blog = req.body.blog;
    var conditions = {title: blog.title};
    var update = {
        $set: {
            content: blog.content,
            meta: {
                updateAt: Date.now()
            }
        }
    };
    Blog.findOne({title: blog.title}, function (err, _blog) {
        if (err) console.log(err);
        else {
            Blog.update(conditions, update, function (err) {
                if (err) console.log(err);
                else {
                    res.redirect('/comment/show/' + _blog._id);
                }
            })
        }
    })
};

exports.addPraise = function (req, res) {
    var id = req.params.id;
    Blog.findOne({_id: id}, function (err, blog) {
        if (err) console.log(err);
        var update = {$set: {praise: blog.praise + 1}};
        Blog.update({_id: id}, update, function (err) {
            if (err) console.log(err);
            res.redirect('/blog/show/paging/1');
        })
    })
};
