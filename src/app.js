import express from 'express';
import gm from 'gm';
import fs from 'fs';

let app = express();
let imagePath = __dirname + '/images/';
// let imagePath = __dirname + 'http://www.brandonhaun.com/lab/lorembug/images/';
let image404 = 'notfound.jpg';
let imagePool = fs.readdirSync(imagePath).filter(fname => fname !== image404);

// number, high boundary, low boundary
let clamp = (n, h, l) => Math.max(Math.min(n, h), l);
// takes list and returns a random value. pretty inefficiently as well. 
let randomFromList = list => [...list].sort(() => Math.random() > .5).pop();

function streamImage(req, res, img = randomFromList(imagePool)) {
    let height = Number(req.params.height);
    let width = Number(req.params.width);
    // invalid values
    if (!height || !width) {
        return notfound(req, res);
    }
    width = clamp(width, 1920, 1);
    height = clamp(height, 1080, 1);
    gm(imagePath + img)
    .resize(width, height, '^')
    .gravity('Center')
    .crop(width, height)
    .stream(function (err, stdout, stderr) {
        res.set('Content-Type', 'image/jpeg');
        if (err) {
            console.log(err);
        }
        stdout.pipe(res);
    });
}

function notfound(req, res, next) {
    // this isn't working and I have no clue why
    //res.set('Content-Type', 'image/jpeg');
    res.status(404);
    //fs.createReadStream(imagePath + image404, 'utf-8').pipe(res);
    res.end('404');
}

app.set('view engine', 'ejs')
.use(express.static(__dirname + '/public'))
.get('/', (req, res) => {
    res.render('index.ejs');
})
.get('/:width/:height', (req, res) => {
    streamImage(req, res); // I optionally accept a third param, I cannot be passed directly. 
})
.get('/:width/:height/:id', (req, res) => {
    let id = Number(req.params.id);
    if( isNaN(id) ) {
        id = (req.params.id + 'salt').split('').map(c=>c.charCodeAt(0)).join('');
    }
    streamImage(req, res, imagePool[parseInt(id, 10) % imagePool.length]);
})
.use(notfound)
.listen(process.env.PORT || 7003);