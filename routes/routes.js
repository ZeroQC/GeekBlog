var Index = require('../controllers/index');
var User = require('../controllers/users');
var Blog = require('../controllers/blog');
var Comment = require('../controllers/comment');

module.exports = function (app) {

    //会话持久
    app.use(function (req, res, next) {
        var _user = req.session.user;
        app.locals.user = _user;
        next()
    });

    //Index
    app.get('/', Index.index);
    app.get('/search', Index.search);

    //User
    app.post('/user/signup', User.singUp);
    app.post('/user/signin', User.signIn);
    app.post('/user/update', User.update);
    app.get('/signup', User.showSignup);
    app.get('/signin', User.showSignin);
    app.get('/user/show/update/:username', User.checkSignIn, User.showUpdate);
    app.get('/logout', User.logout);
    app.get('/user/info/:username', User.userInfo);
    app.get('/user/list/info', User.userListInfo);
    app.get('/user/delete/:username', User.delete);

    //Blog
    app.get('/blog/show', Blog.showBlog);
    app.get('/blog/show/paging/:p', Blog.showBlogByPaging);
    app.get('/blog/show/category', Blog.showBlogCategory);
    app.get('/blog/show/new', User.checkSignIn, Blog.showBlogNew);
    app.post('/blog/new', Blog.new);
    app.get('/blog/add/praise/:id', User.checkSignIn, Blog.addPraise);
    app.get('/blog/show/update', User.checkSignIn, Blog.showBlogUpdate);
    app.post('/blog/update', Blog.updateBlog);
    app.get('/blog/detail/:id', Comment.showComments);

    //Comment
    app.get('/comment/show/:id', User.checkSignIn, Comment.showComments);
    app.post('/comment/add', User.checkSignIn, Comment.addComment);
};
