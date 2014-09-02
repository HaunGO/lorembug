var express = require('express'),
    gm = require('gm'),
    fs = require('fs'),
    app = express();
var imagePath = './images/';
var MAX_ID = fs.readdirSync(imagePath).length - 2;

function generateImage(res, url, width, height, options) {
    var handle = gm(imagePath + url)
    .resize(width, height, '^')
    .gravity('Center')
    .crop(width, height)
    .fill('white');
    options.forEach(function(option) {
    	var fn = Object.keys(option)[0];
    	handle[fn](option[fn]);
    })
    handle.stream(function(err, stdout, stderr) {
        res.set('Content-Type', 'image/jpeg');
        if (err) {
            console.log(err);
        }
        stdout.pipe(res);
    });
}

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.get(/[\/i]?\/([0-9]+)\/([0-9]+)/, function(req, res) {
    var width = req.params[0],
        height = req.params[1];
    var options = ['blur','contrast','matte','matteColor','monochrome','negative','quality','sepia','swirl'].map(function(key) {
    	if( key in req.query ) {
    		var obj = {};
    		obj[key] = !req.query[key] ? true : req.query[key];
    		return obj;
    	}
    	return false;
    }).filter(Boolean);

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
    var id = Math.floor(Math.random() * MAX_ID) + 1;
    if (id < 10) {
        id = '0' + id;
    }
    console.log(options);
    generateImage(res, id + '.jpg', width, height, options);
});
app.get('/', function(req, res) {
    res.render('index.ejs');
});
app.use(function(req, res, next) {
    res.status(404);
    generateImage(res, 'status404.jpg', 404, 300);
});
app.listen(7076);