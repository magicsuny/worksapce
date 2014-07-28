var later = require("later"),
  http = require("./httpHelper");

/**
 * 分析汽車之家的汽車類別js腳本
 */
function touchJS(callback) {
  http.get("http://car.autohome.com.cn/javascript/sale_new.js", 30000, function (err, data) {
    if (err) {
      console.error("请求车型数据错误：" + err);
      return false;
    }
    callback(err, data);
  }, "GBK");

}

/**
 * 導入數據庫
 */
function importToDB(db, data) {
  var startTime = new Date().getTime();
  var cars = db.collection("cars");
  var carBrands_c = db.collection("carBrands");
  var carSubBrands_c = db.collection("carSubBrands");
  cars.remove({}, function (err, result) {
  });
  carBrands_c.remove({}, function (err, result) {
  });
  carSubBrands_c.remove({}, function (err, result) {
  });
  /**
   * 执行取回的汽车之家的js脚本，
   * fct为汽车品牌
   * br为汽车子品牌
   */
  eval(data);
  var tmp_brands = fct['0'].split(',');
  var brand = new Array();

  //汽车品牌
  var carBrands = [];
  for (var loop = 0; loop < tmp_brands.length; loop += 2) {
    var brandId = tmp_brands[loop];
    var carBrand = {};
    carBrand['id'] = parseInt(brandId);
    carBrand['name'] = tmp_brands[loop + 1];
    carBrands[brandId] = carBrand
    carBrands_c.insert(carBrand,function(err,result){

    });
  }


  var carSubBrands = [];
  //汽车子品牌
  for (var sub_brand_index in br) {
    var sub_brands = br[sub_brand_index].split(',');
    for (var loop = 0; loop < sub_brands.length; loop += 2) {
      var carSubBrand = {};
      carSubBrand['id'] = parseInt(sub_brands[loop]);
      carSubBrand['name'] = sub_brands[loop + 1];
      carSubBrand['brandId'] = parseInt(sub_brand_index);
      carSubBrands[sub_brands[loop]] = carSubBrand;
      carSubBrands_c.insert(carSubBrand,function(err,result){

      });
    }
  }


  //预处理时间分类
  var spec_year_tmp_array = new Array();
  for (var spec_year_name_index in spec_year_name) {
    var spec_year = spec_year_name[spec_year_name_index].split(',');
    for (var loop = 0; loop < spec_year.length; loop += 2) {
      spec_year_tmp_array[spec_year[loop]] = spec_year_name_index;
    }
  }

  var results = [];
  //处理车辆具体型号
  for (var spl_index in spl) {
    var spl_array = spl[spl_index].split(',');
    for (var loop = 0; loop < spl_array.length; loop += 2) {
      var splId = spl_array[loop];
      var sp = {};
      sp['id'] = parseInt(splId);
      sp['name'] = spl_array[loop + 1];
      var subBrand = carSubBrands[spec_year_tmp_array[spl_index]];
      sp['sub_brand'] = subBrand;
      var brand = carBrands[subBrand['brandId']];
      sp['brand'] = brand;
      results.push(sp);
    }
  }


  cars.insert(results, function(err, result) {
    "use strict";
    var endTime = new Date().getTime();
    console.log('import to mongodb last:'+(endTime - startTime));
    if (err) {
      console.log(err);
      return;
    };


  });




}

function clearHistoryData() {

}


/**
 * 執行任務
 */
exports.doJob = function (db) {
  var sched = later.parse.recur().on(1).hour().and().on(1).dayOfWeek();
  t = later.setInterval(function () {
    touchJS(function (err, data) {
      importToDB(db, data);
    });
  }, sched);
  //启动时执行一次
  touchJS(function (err, data) {
    importToDB(db,data);
  });
}