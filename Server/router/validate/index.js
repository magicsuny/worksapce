var crypto=require("crypto"),
    https = require('https');
var APP_ID='wxbf10215040495193',
    APP_SECRET='a251ff67a3e923214086549cd3e6e532',
    TOKEN='magic';
exports.index = function(req,res){
    var query = req.getData;
    if(query){
        var echostr = checkSignature(query);
        if(echostr){
            console.log(req.post);
            requestAccessToken();
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
        return echostr;
    }
    else {
        return false;
    }
}

function requestAccessToken(){
    var options = {
        hostname: 'api.weixin.qq.com',
        port: 443,
        path: '/cgi-bin/token?grant_type=client_credential&appid='+APP_ID+'&secret='+APP_SECRET,
        method: 'GET'
    };

    var req = https.request(options, function(res) {
        console.log("statusCode: ", res.statusCode);
        console.log("headers: ", res.headers);

        res.on('data', function(d) {
            if(d.access_token){
                createMenu(d.access_token);
            }
        });
    });
    req.end();

    req.on('error', function(e) {
        console.error(e);
    });
}


function createMenu(accessToken){
    var options = {
        hostname: 'api.weixin.qq.com',
        port: 443,
        path: '/cgi-bin/menu/create?access_token='+accessToken,
        method: 'POST'
    };
    var req = https.request(options, function(res) {
         console.log("statusCode: ", res.statusCode);
         console.log("headers: ", res.headers);

         res.on('data', function(d) {
             if(d.access_token){

             }
         });
    });
    req.write({
        "button":[
            {
                "type":"click",
                "name":"今日歌曲",
                "key":"V1001_TODAY_MUSIC"
            },
            {
                "type":"click",
                "name":"歌手简介",
                "key":"V1001_TODAY_SINGER"
            },
            {
                "name":"菜单",
                "sub_button":[
                    {
                        "type":"view",
                        "name":"搜索",
                        "url":"http://www.soso.com/"
                    },
                    {
                        "type":"view",
                        "name":"视频",
                        "url":"http://v.qq.com/"
                    },
                    {
                        "type":"click",
                        "name":"赞一下我们",
                        "key":"V1001_GOOD"
                    }]
            }]
    });
    req.end();

    req.on('error', function(e) {
        console.error(e);
    });
}