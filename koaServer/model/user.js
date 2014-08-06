/**
 * Created by sunharuka on 14-8-6.
 */
function User(){
  //用户open id
  this._id = "";
  //用户姓名
  this.name = "";
  //用户昵称
  this.nickName = "";
  //是否订阅
  this.subscribe="";
  //性别 1男 2女 0未知
  this.sex=0;
  //使用语言
  this.language = "";
  //详细地址
  this.address = "";
  //区
  this.area = "";
  //城市
  this.city = "";
  //省
  this.province="";
  //国家
  this.country="";
  //头像地址
  this.headimgurl = "";
  //订阅时间
  this.subscribe_time = "";

}

var initWidthWechatUserInfo=function(wechatUserInfo){
  var user = new User();
  user._id = wechatUserInfo.openid;
  user.nickName = wechatUserInfo.nickname;
  user.sex = wechatUserInfo.sex;
  user.language = wechatUserInfo.language;
  user.city = wechatUserInfo.city;
  user.province = wechatUserInfo.province;
  user.country = wechatUserInfo.country;
  user.headimgurl = wechatUserInfo.headimgurl;
  user.subscribe_time = wechatUserInfo.subscribe_time;
  user.subscribe = wechatUserInfo.subscribe;
  return user;
}

module.exports = User;
module.exports.initWidthWechatUserInfo = initWidthWechatUserInfo;