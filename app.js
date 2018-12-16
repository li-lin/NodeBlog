var express = require('express');
var http = require('http');
var path = require('path');

var app = express();
app.set('appName', 'blogsystem');
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

var resData = {
    title: 'Express.js Guide',
    body: 'The comprehensive book on Express.js',
    url:'/logout',
    isActive:true,
    isChecked:false
};
app.all('*', function (req, res) {
    res.render('home', resData);
});

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