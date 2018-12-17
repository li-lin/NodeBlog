var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var mongoskin = require('mongoskin');

var session = require('express-session'),
    logger = require('morgan'),
    errorHandler = require('errorhandler'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override');

var db = mongoskin.db('mongodb://localhost:27017/blog', {
    native_parser: true
});
var collections = {
    articles: db.collection('articles'),
    users: db.collection('users')
};

var app = express();
app.locals.appTitle = 'Blog-Express';
app.set('appName', 'blogsystem');
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(function (req, res, next) {
    if (!collections.articles || !collections.users) return next(new Error('No collections'));
    req.collections = collections;
    return next();
});
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(methodOverride());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
if ('development' == app.get('env')) {
    app.use(errorHandler());
}

//routes for pages
app.get('/', routes.index);
app.get('/login', routes.user.login);
app.post('/login', routes.user.authenticate);
app.get('/logout', routes.user.logout);
app.get('/admin', routes.article.admin);
app.get('/post', routes.article.post);
app.post('/post', routes.article.postArticle);
app.get('/articles/:slug', routes.article.show);

//routes for Web API
app.get('/api/articles', routes.article.list);
app.post('/api/articles', routes.article.add);
app.put('/api/articles/:id', routes.article.edit);
app.delete('/api/articles/:id', routes.article.del);

app.all('*', function (req, res) {
    res.send(404);
});

// var resData = {
//     title: 'Express.js Guide',
//     body: 'The comprehensive book on Express.js',
//     url: '/logout',
//     isActive: true,
//     isChecked: false
// };
// app.all('*', function (req, res) {
//     res.render('home', resData);
// });

var server = http.createServer(app);
var boot = function () {
    server.listen(app.get('port'), function () {
        console.log('Express.js server listening on port ' + app.get('port'));
    });
};
var shutdown = function () {
    server.close();
};
if (require.main === module) {
    boot();
} else {
    console.info('Running app as a module');
    exports.boot = boot;
    exports.shutdown = shutdown;
    exports.port = app.get('port');
}