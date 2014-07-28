var later = require("later"),
    http = require("../utils/httpHelper"),
    async = require("async"),
    mysqlDAO = require("../db/MysqlDAO");

/**
 * 分析汽車之家的汽車類別js腳本
 */
function touchJS(callback){
    http.get("http://car.autohome.com.cn/javascript/sale_new.js",30000,function(err,data){
        if(err){
            console.error("请求车型数据错误："+err);
            return false;
        }
        callback(err,data);
    },"GBK");

}

/**
 * 導入數據庫
 */
function importToDB(data){
    var startTime = new Date().getTime();
    mysqlDAO.getConnection(function(connection){
        connection.query("DELETE FROM CarBrand",function(err,result){
            console.log("delete carbrand");
        });
        connection.query("DELETE FROM CarSubBrand",function(err,result){
            console.log("delete carsubbrand");
        });
        connection.query("DELETE FROM CarModel",function(err,result){
            console.log("delete carmodel");
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
        for (var loop = 0; loop < tmp_brands.length; loop += 2) {
            var brandId = tmp_brands[loop];
            connection.query("INSERT INTO CarBrand SET ?",{ID:brandId,NAME:tmp_brands[loop+1]});
            //var tpm_subBrands = br[brandId].splite(',');

        }
        //汽车子品牌
        for (var sub_brand_index in br){
            var sub_brands = br[sub_brand_index].split(',');
            for (var loop = 0; loop < sub_brands.length; loop += 2) {
                var subBrandId = sub_brands[loop];
                connection.query("INSERT INTO CarSubBrand SET ?",{ID:subBrandId,NAME:sub_brands[loop+1],BRAND_ID:sub_brand_index});
            }
        }

        //预处理时间分类
        var spec_year_tmp_array = new Array();
        for(var spec_year_name_index in spec_year_name){
            var spec_year = spec_year_name[spec_year_name_index].split(',');
            for(var loop = 0; loop<spec_year.length;loop+=2){
                spec_year_tmp_array[spec_year[loop]]=spec_year_name_index;
            }
        }

        //处理车辆具体型号
        for(var spl_index in spl){
            var spl_array = spl[spl_index].split(',');
            for(var loop= 0;loop<spl_array.length;loop+=2){
                var splId = spl_array[loop];
                connection.query("INSERT INTO CarModel SET ?",{ID:splId,NAME:spl_array[loop+1],SUBBRAND_ID:spec_year_tmp_array[spl_index]});
            }
        }
        var endTime = new Date().getTime();

        console.log(endTime - startTime);


    },false);

}

function clearHistoryData(){

}


/**
 * 執行任務
 */
exports.doJob=function(){
    var sched = later.parse.recur().on(1).hour().and().on(1).dayOfWeek();
    t = later.setInterval(function() {
        touchJS(function(err,data){
            importToDB(data);
        });
    }, sched);
    //启动时执行一次
    touchJS(function(err,data){
        importToDB(data);
    });
}