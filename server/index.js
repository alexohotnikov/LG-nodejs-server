var express = require('express')
var app = express()
var path = require('path')

var cors = require('cors')
var lgtv = require('../index.js')({
    url: 'ws://192.168.1.85:3000'
});

var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })


// default static: 
PORT = 5000

lgtv.on('connect', (err, res) => {
    console.log('LGTV conected')
})


app.use(cors())

app.use(bodyParser.json()); // support json encoded bodies

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, "public", "react-page", "build"))
})

app.get('/ping', function (req, res) {
    lgtv.request('ssap://system.notifications/createToast', {message: 'Pong test succesfull!'});
    res.send({ code: 200 })
  })


app.get('/youtube', function (req, res) {
    res.send({ code: 200 })
    lgtv.request('ssap://system.launcher/launch', {id: 'youtube.leanback.v4'})
})



app.get('/volume', function(req, res) {
    lgtv.subscribe('ssap://audio/getVolume', function (err, resS) {
        res.send({ volume: resS.volume, status: 200 })
    })
})

app.post('/volume', urlencodedParser, function(req, res) {
    lgtv.request('ssap://audio/volumeDown', function(err, succ) {
        res.sendStatus(200)
    });
})

app.get('/current', function(request, resolve)  {
    lgtv.subscribe('ssap://com.webos.applicationManager/getForegroundAppInfo', function (err, res) {
        resolve.send({ app_name: res.appId })
    })
})


  app.listen(PORT, () => {
      console.log(`Listen on port ${PORT}`)
  })



  function actionInfo(type, value = null) {
      console.log(`Trying do ${type}${value ? ` with value: ${value}` : ''}`)
  }