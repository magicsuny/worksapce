var fs = require('fs');

exports.carInfo = function(req,res){
  res.writeHead(200, { 'Content-type': 'text/html'});
  res.end(fs.readFileSync(__dirname + '/../../template/html/orderform.html'));
}


exports.orderInfo = function(req,res){
  res.writeHead(200, { 'Content-type': 'text/html'});
  res.end(fs.readFileSync(__dirname + '/../../template/html/orderform.html'));
}

exports.getCarBand = function(req,res){

}

exports.save = function(req,res){
  console.log(111);
}