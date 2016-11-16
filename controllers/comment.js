var Blog = require('../models/blog');
var Comment = require('../models/comment');

exports.showComments = function (req, res) {
    var blog_id = req.params.id;
    Blog.findOne({_id: blog_id}, function (err1, blog) {
        if (err1) console.log(err1);

        Comment.find({blog: blog_id}, function (err2, comments) {
            if (err2) console.log(err2);
            res.render('blog_comment', {
                title: '博客详情页',
                blog: blog,
                comments: comments
            })
        })
    })
};

exports.addComment = function (req, res) {
    var blog_id = req.body.blog._id;
    var blog_title = req.body.blog.title;
    var comment_content = req.body.comment.content;
    var user = req.session.user;

    //保存评论
    var comment = new Comment();
    comment.blog = blog_id;
    comment.blogTitle = blog_title;
    comment.from = user._id;
    comment.fromName = user.username;
    comment.content = comment_content;
    comment.save(function (err3) {
        if (err3) console.log(err3);
        else {
            console.log('评论添加成功');
        }
    });

    //更新博客评论数
    Blog.findOne({_id: blog_id}, function (err, blog) {
        if (err) console.log(err);
        var update = {$set: {commentNum: blog.commentNum + 1}};
        Blog.update({_id: blog_id}, update, function (err2) {
            if (err2) console.log(err2);
            else {
                res.redirect('/comment/show/' + blog_id);
            }
        });
    });
};
