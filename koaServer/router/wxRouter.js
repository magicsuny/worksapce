var crypto=require("crypto"),
    https = require('https'),
    url = require('url'),
   parse = require('co-body'),
    xml=require("../node_modules/node-xml/lib/node-xml.js");
var APP_ID='wxf72e9f4c5958f96d',
    APP_SECRET='bcdac03ae24bd1f04a462b2baf20cc04',
    TOKEN='magic';

function WXHandler(db) {

  this.index = function *(){

    var query = url.parse(this.req.url,true).query;
    //
    console.log(query);
    if(query){
      var echostr = checkSignature(query);
      if(echostr){
        requestAccessToken();
        if(this.req.method=='GET'){
          this.body = echostr;
        }else{

          var postQuery = yield parse.other(this);
          this.type = 'text/xml; charset=utf-8';
          this.body = yield processMessage(postQuery);
        }

      }else{
        this.body = "Bad Token!";
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
      var body = "";
      res.on('data', function(data) {
        body+=data;
      }).on('end',function(){
        body = JSON.parse(body);
        console.log("request expired:"+body.expires_in);
        console.log("request expired:"+body.access_token);
        if(body.access_token){
          createMenu(body.access_token);
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
    console.log("menu request options:");
    console.log(options);
    var req = https.request(options, function(res) {
      console.log("statusCode: ", res.statusCode);
      console.log("headers: ", res.headers);

      res.on('data', function(d) {

        if(d.access_token){

        }
      });
    });
    req.write(JSON.stringify({
      "button":[

        {
          "type":"view",
          "name":"服务预约",
          "url":"http://106.187.50.51/neworder"
        },
        {
          "type":"click",
          "name":"服务简介",
          "key":"M201_SERVICE_DETAIL"
        },
        {
          "type":"click",
          "name":"我",
          "sub_button":[
            {
              "type":"view",
              "name":"服务记录",
              "url":"http://v.qq.com/"
            },
            {
              "type":"click",
              "name":"我的爱车",
              "key":"V1001_GOOD"
            }]
        }]
    }));
    req.end();

    req.on('error', function(e) {
      console.error(e);
    });
  }

  function processMessage(data){
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


    return function(callback) {


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

            callback(null,'<xml><ToUserName><![CDATA['+FromUserName+']]></ToUserName><FromUserName><![CDATA['+ToUserName+']]></FromUserName><CreateTime>'+CreateTime+'</CreateTime><MsgType><![CDATA[text]]></MsgType><Content><![CDATA['+msg+']]></Content></xml>');

          });
        });
        parse.parseString(data);
    }
  }
}

module.exports = WXHandler;