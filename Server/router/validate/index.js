var crypto=require("crypto");
exports.index = function(req,res){
    var query = req.post;
    if(query){
        var signature = query.signature;
        var echostr = query.echostr;
        var timestamp = query['timestamp'];
        console.log(req.getData);
        console.log(signature+"  "+echostr+"  "+timestamp);
        var nonce = query.nonce;
        var oriArray = new Array();
        oriArray[0] = nonce;
        oriArray[1] = timestamp;
        oriArray[2] = "magic";//这里填写你的token
        oriArray.sort();

        var original = oriArray[0]+oriArray[1]+oriArray[2];
        console.log("Original Str:"+original);
        console.log("signature:"+signature);
        var hasher=crypto.createHash("sha1");
        hasher.update(original);
        var scyptoString=hasher.digest('hex');
        if (signature == scyptoString) {
            res.end(echostr);
        }
        else {
            res.end("Bad Token!");
        }
    }
}
