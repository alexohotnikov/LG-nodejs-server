var express = require('express')
var app = express()
var lgtv = require('../index.js')({
    url: 'ws://192.168.1.85:3000'
});

// default static: 
PORT = 3000

lgtv.on('connect', (err, res) => {
    console.log('LGTV conected')
})


app.get('/', function(req, res){
    res.send('index route of app...')
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

    const { value =  6 } = req.query
    lgtv.request('ssap://audio/setVolume', {volume: Number(value) })
    res.send({ code: 200, value })
})

app.get('/current', function(request, resolve)  {
    lgtv.subscribe('ssap://com.webos.applicationManager/getForegroundAppInfo', function (err, res) {
        resolve.send({ app_name: res.appId })
    })
})


  app.listen(PORT, () => {
      console.log(`Listen on port ${PORT}`)
  })