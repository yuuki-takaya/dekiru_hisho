var express = require('express');
var router = express.Router();

const User = require('../models/user');

var google = require('googleapis');
var googleAuth = require('google-auth-library');
var auth = new googleAuth();

var oauth2Client = new auth.OAuth2(null,null, null);


/* GET users listing. */
router.get('/', function(req, res, next) {
    console.log("in chat");
    
    var testUserId = 'testId';
    var testUserName = 'testName';
    var testPass = 'testPass';
    var oauth = null;
    var buf=null;


    User.find({"userid" : testUserId},function(err,user){
        if(err) console.log(err);
        oauth = user[0].oauth;
        // var oauth2Client = new auth.OAuth2(oauth.clientId_ ,oauth.clientSecret_, oauth.redirectUri_);
        oauth2Client.clientId_ = oauth.clientId_;
        oauth2Client.clientSecret_ = oauth.clientSecret_;
        oauth2Client.redirectUri_ = oauth.redirectUri_;
        oauth2Client.credentials = oauth.credentials;
        // oauth2Client.transporter = DefaultTransporter {}; 本来はtransporterも格納しないといけないが，なしでもいけた
        oauth2Client.opts = oauth.opts;
        
        console.log(oauth2Client);
        listEvents(oauth2Client);
        insertEvents(oauth2Client);
        res.redirect("https://172.20.11.235:3000/chat/room");
    });

    function listEvents(auth) {
        var calendar = google.calendar('v3');
        // console.log("authの中身だよ〜\n");
        // console.log(auth);
        calendar.events.list({
          auth: auth,
          calendarId: 'primary',
          timeMin: (new Date()).toISOString(),
          maxResults: 10,
          singleEvents: true,
          orderBy: 'startTime'
        }, function(err, response) {
          if (err) {
            console.log('The API returned an error: ' + err);
            return;
          }
          var events = response.items;
        //   console.log(response.items);
          if (events.length == 0) {
            console.log('No upcoming events found.');
          } else {
            console.log('Upcoming 10 events:');
            for (var i = 0; i < events.length; i++) {
              var event = events[i];
              var start = event.start.dateTime || event.start.date;
              console.log('%s - %s', start, event.summary);
            }
          }
        //   res.send(events[1]);
        });
      }



      function insertEvents(auth) {
        var calendar = google.calendar('v3');
        
        var event = {
            'summary': 'Google I/O 2015',
            'location': '同志社大学京田辺キャンパス',
            'description': 'テスト用',
            'start': {
              'dateTime': '2017-12-31T09:00:00-07:00',
              'timeZone': 'Asia/Tokyo',
            },
            'end': {
              'dateTime': '2018-01-01T17:00:00-07:00',
              'timeZone': 'Asia/Tokyo',
            }
          };



        calendar.events.insert({
            auth: auth,
            calendarId: 'primary',
            resource: event,
          }, function(err, event) {
            if (err) {
              console.log('There was an error contacting the Calendar service: ' + err);
              return;
            }
            console.log('Event created: %s', event.htmlLink);
          });
      }
});


router.get('/room', function(req, res, next) {
    res.render('main', { title: 'Express' });


});


router.post('/', function(req, res, next) {
    console.log("in chat");
    console.log(req.body);
    res.send('respond with a resource');
});





module.exports = router;
