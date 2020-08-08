var lgtv = require('./index.js')({
    url: 'ws://192.168.1.85:3000'
});

lgtv.on('error', function (err) {
    console.log(err);
});

lgtv.on('connecting', function () {
    console.log('connecting');
});

lgtv.on('connect', function () {
    console.log('connected');

    lgtv.subscribe('ssap://com.webos.applicationManager/getForegroundAppInfo', function (err, res) {
        console.log('app', res.appId);
    });
});


lgtv.on('prompt', function () {
    console.log('please authorize on TV');
});

lgtv.on('close', function () {
    console.log('close');
});



export const lgTvOpenYoutube = () => 