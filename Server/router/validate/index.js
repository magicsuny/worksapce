var crypto=require("crypto"),
    https = require('https'),
    xml=require("../../node_modules/node-xml/lib/node-xml.js");
var APP_ID='wxbf10215040495193',
    APP_SECRET='a251ff67a3e923214086549cd3e6e532',
    TOKEN='magic';
exports.index = function(req,res){
    var query = req.getData;
    console.log(query);
    if(query){
        var echostr = checkSignature(query);
        console.log("echostr:"+echostr);
        if(echostr){
            console.log("checkSignature req.post:"+req.post);
            requestAccessToken();
            console.log(req.method);
            if(req.method=='GET'){
                res.end(echostr);
            }else{
                processMessage(req.post,res);
            }

        }else{
            res.end("Bad Token!");
        }
    }
}

function checkSignature(query){
    console.log(query);
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
        return echostr?echostr:true;
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

        res.on('data', function(d) {
            console.log("request d:"+d);
            console.log("request accesstoken:"+d.access_token);
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
    console.log("menu request:"+accessToken);
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
                "name":"公司简介",
                "key":"V1001_TODAY_MUSIC",
                "url":"http://www.baidu.com/"
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
                        "name":"预约保养",
                        "url":"http://106.187.50.51/orderform.html"
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

function processMessage(data,response){
    var ToUserName="";
    var FromUserName="";
    var CreateTime="";
    var MsgType="";
    var Content="";
    var Location_X="";
    var Location_Y="";
    var Scale=1;
    var Label="";
    var PicUrl="";
    var FuncFlag="";

    var tempName="";
    var parse=new xml.SaxParser(function(cb){
        cb.onStartElementNS(function(elem,attra,prefix,uri,namespaces){
            tempName=elem;
        });

        cb.onCharacters(function(chars){
            chars=chars.replace(/(^\s*)|(\s*$)/g, "");
            if(tempName=="CreateTime"){
                CreateTime=chars;
            }else if(tempName=="Location_X"){
                Location_X=chars;
            }else if(tempName=="Location_Y"){
                Location_Y=chars;
            }else if(tempName=="Scale"){
                Scale=chars;
            }
            console.log(chars);

        });

        cb.onCdata(function(cdata){

            if(tempName=="ToUserName"){
                ToUserName=cdata;
            }else if(tempName=="FromUserName"){
                FromUserName=cdata;
            }else if(tempName=="MsgType"){
                MsgType=cdata;
            }else if(tempName=="Content"){
                Content=cdata;
            }else if(tempName=="PicUrl"){
                PicUrl=cdata;
            }else if(tempName=="Label"){
                Label=cdata;
            }
            console.log("cdata:"+cdata);
        });

        cb.onEndElementNS(function(elem,prefix,uri){
            tempName="";
        });

        cb.onEndDocument(function(){
            console.log("onEndDocument");
            tempName="";
            var date=new Date();
            var yy=date.getYear();
            var MM=date.getMonth() + 1;
            var dd=date.getDay();
            var hh=date.getHours();
            var mm=date.getMinutes();
            var ss=date.getSeconds();
            var sss=date.getMilliseconds();
            var result=Date.UTC(yy,MM,dd,hh,mm,ss,sss);
            var msg="";
            if(MsgType=="text"){
                msg="谢谢关注,你说的是："+Content;
            }else if (MsgType="location"){
                msg="你所在的位置: 经度："+Location_X+"纬度："+Location_Y;
            }else if (MsgType="image"){
                msg="你发的图片是："+PicUrl;
            }
            response.end('<xml><ToUserName><![CDATA['+FromUserName+']]></ToUserName><FromUserName><![CDATA['+ToUserName+']]></FromUserName><CreateTime>'+CreateTime+'</CreateTime><MsgType><![CDATA[text]]></MsgType><Content><![CDATA['+msg+']]></Content></xml>','UTF-8');

        });
    });
    parse.parseString(data);
}