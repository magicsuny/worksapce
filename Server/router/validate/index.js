var crypto=require("crypto"),
    https = require('https');
var APP_ID='wxbf10215040495193',
    APP_SECRET='a251ff67a3e923214086549cd3e6e532',
    TOKEN='magic';
exports.index = function(req,res){
    var query = req.getData;
    if(query){
        if(checkSignature(query)){
            console.log(req.post);
            res.end(echostr);
        }else{
            res.end("Bad Token!");
        }
    }
}

function checkSignature(query){
    var signature = query.signature;
    var echostr = query.echostr;
    var timestamp = query['timestamp'];
    console.log(req.getData);
    console.log(signature+"  "+echostr+"  "+timestamp);
    var nonce = query.nonce;
    var oriArray = new Array();
    oriArray[0] = nonce;
    oriArray[1] = timestamp;
    oriArray[2] = TOKEN;//这里填写你的token
    oriArray.sort();

    var original = oriArray[0]+oriArray[1]+oriArray[2];
    console.log("Original Str:"+original);
    console.log("signature:"+signature);
    var hasher=crypto.createHash("sha1");
    hasher.update(original);
    var scyptoString=hasher.digest('hex');
    if (signature == scyptoString) {
        return true;
    }
    else {
        return false;
    }
}

function requestAccessToken(){
    var options = {
        hostname: 'api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='+APP_ID+'&secret='+APP_SECRET,
        port: 443,
        path: '/',
        method: 'GET'
    };

    var req = https.request(options, function(res) {
        console.log("statusCode: ", res.statusCode);
        console.log("headers: ", res.headers);

        res.on('data', function(d) {

        });
    });
    req.end();

    req.on('error', function(e) {
        console.error(e);
    });
}