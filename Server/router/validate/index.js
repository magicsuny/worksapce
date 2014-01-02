exports.index = function(req,res){
    var query = req.post;
    if(query){
        var signature = query.signature;
        var echostr = query.echostr;
        var timestamp = query['timestamp'];
        var nonce = query.nonce;
        var oriArray = new Array();
        oriArray[0] = nonce;
        oriArray[1] = timestamp;
        oriArray[2] = "magic";//这里填写你的token
        oriArray.sort();
        var original = oriArray[0]+oriArray[1]+oriArray[2];
        console.log("Original Str:"+original);
        console.log("signature:"+signature);
        var scyptoString = sha1(original);
        if (signature == scyptoString) {
            res.send(echostr);
        }
        else {
            res.send("Bad Token!");
        }
    }
}
