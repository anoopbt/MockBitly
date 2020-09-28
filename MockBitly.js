
// References:
// https://www.tutorialsteacher.com/nodejs/expressjs-web-application
// https://www.digitalocean.com/community/tutorials/how-to-use-ejs-to-template-your-node-application

var express = require('express');
var app = express();

var dbConn = require('./mysqlDbConfig');

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: false}));

app.set('view engine', 'ejs');

app.get('/', function (req, res) {
    res.render('pages/index');
});

app.get('/error', function (req, res) {
    res.render('pages/error');
});

app.get('/MockBitlyUrl/:shortUrl', function (req, res, next) {
    dbConn.query("SELECT LONGURL FROM URLMAP where SHORTURL = '" + req.params.shortUrl + "'", function (err, result, fields) {
        if (err)
        {
            console.log(err);
            res.redirect('/error');
        } else {
            var originalUrl = result[0].LONGURL;
            //originalUrl = encodeURIComponent(originalUrl);
            res.redirect(301, originalUrl);
        }
    });
});

app.get('/mockBitly/:shortUrl/:originalUrl', function (req, res) {
    res.render('pages/mockBitly', {shortUrl: req.params.shortUrl, originalUrl: req.params.originalUrl});
});

app.get('/mockBitly', function (req, res) {
    res.render('pages/mockBitly', {shortUrl: '', originalUrl: ''});
});

app.post('/createShortUrl', function (req, res) {
    var longUrl = req.body.longUrl;
    var longUrlEncoded = encodeURIComponent(longUrl);
    var shortUrl = "http://localhost:5000/MockBitlyUrl/";

    dbConn.query("SELECT ID, SHORTURL FROM URLMAP where LONGURL = '" + longUrl + "'", function (err, result, fields) {

        if (err)
        {
            //throw err;
            console.log(err);
            res.redirect('/error');
        } else
        {
            if (result.length > 0)
            {
                // Existing entry
                shortUrl = shortUrl + result[0].SHORTURL;
                shortUrl = encodeURIComponent(shortUrl);
                res.redirect('/mockBitly/Created Short URL is: ' + shortUrl + '/' + longUrlEncoded);

            } else {
                // New entry
                var sql = "INSERT INTO URLMAP(LONGURL, SHORTURL, DATETIME) values ('" + longUrl + "', 'errorInShortUrl', sysdate()) ";
                dbConn.query(sql, function (err1, result1, fields1) {
                    if (err1)
                    {
                        //throw err;
                        console.log(err1);
                        res.redirect('/error');
                    } else {
                        var getIdSql = "select ID from URLMAP where LONGURL = '" + longUrl + "'";
                        dbConn.query(getIdSql, function (err2, result2, fields2) {
                            if (err2)
                            {
                                console.log(err2);
                                res.redirect('/error');
                            } else {
                                if (result2.length > 0)
                                {
                                    var shortUrlId = result2[0].ID;
                                    var newShortUrl = shortUrlId.toString(36);

                                    var updateSql = "update URLMAP set SHORTURL = '" + newShortUrl + "' where ID = " + shortUrlId;

                                    dbConn.query(updateSql, function (err3, result3, fields3) {
                                        if (err3) {
                                            console.log(err3);
                                            res.redirect('/error');
                                        } else {
                                            shortUrl = shortUrl + newShortUrl;
                                            shortUrl = encodeURIComponent(shortUrl);
                                            res.redirect('/mockBitly/Created Short URL is: ' + shortUrl + '/' + longUrlEncoded);
                                        }
                                    });
                                } else {
                                    console.log("ERROR in fetching the new entry from database");
                                    res.redirect('/error');
                                }
                            }
                        });
                    }
                });

            }

        }

    });

});

/*var birds = require('./birds')
 app.use('/birds', birds)*/

app.all('*', function (req, res) {
    res.redirect('/error');
});

var server = app.listen(5000, function () {
    console.log('Mock bitly is running..');
});
