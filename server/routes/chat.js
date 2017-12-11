var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    console.log("in chat");
    res.render('main', { title: 'Express' });
});




router.post('/', function(req, res, next) {
    console.log("in chat");
    console.log(req.body);
    res.send('respond with a resource');
});


function listEvents(auth) {
    var calendar = google.calendar('v3');
    console.log("authの中身だよ〜\n");
    console.log(auth);
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
      console.log(response.items);
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
    });
  }


module.exports = router;
