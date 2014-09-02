var express = require('express'),
    gm = require('gm'),
    fs = require('fs'),
    app = express();
var imagePath = './images/',
    image404 = 'status404.jpg',
    IMAGE_POOL = fs.readdirSync(imagePath).filter(function(name) {
        return name !== image404;
    }),
    IMAGE_POOL_COUNT = IMAGE_POOL.length;

app.set('view engine', 'ejs')
.use(express.static(__dirname + '/public'))
.get(/[\/i]?\/([0-9]+)\/([0-9]+)/, function(req, res) {
    var width = req.params[0],
        height = req.params[1],
        id = IMAGE_POOL[Math.floor(Math.random() * IMAGE_POOL_COUNT)];
    if (width > 1920) {
        width = 1920;
    }
    if (width < 1) {
        width = 1;
    }
    if (height > 1080) {
        height = 1080;
    }
    if (height < 1) {
        height = 1;
    }
    gm(imagePath + id)
    .resize(width, height, '^')
    .gravity('Center')
    .crop(width, height)
    .compress('BZip')
    .stream(function(err, stdout, stderr) {
        res.set('Content-Type', 'image/jpeg');
        if (err) {
            console.log(err);
        }
        stdout.pipe(res);
    });
})
.get('/', function(req, res) {
    res.render('index.ejs');
})
.use(function(req, res, next) {
    res.status(404);
    gm(imagePath + image404)
    .stream(function(err, stdout, stderr) {
        res.set('Content-Type', 'image/jpeg');
        if (err) {
            console.log(err);
        }
        stdout.pipe(res);
    });
})
.listen(7076);