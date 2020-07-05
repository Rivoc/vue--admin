// 过滤特殊字符
export function stripscript (s) {
  var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@ %#￥……&*（）&;—|{}【】‘；：”“'。，、？]")
  var rs = "";
  for (var i = 0; i < s.length; i++) {
    rs = rs + s.substr(i, 1).replace(pattern, '');
  }
  return rs;
}
//验证邮箱
export function validateEmail (val) {
  let reg = /^([a-zA-Z]|[0-9])(\w|\d-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
  //如果验证不通过就返回true
  return !reg.test(val) ? true : false
}
//验证密码 6-20位的字母+数字
export function validatePassword (val) {
  let reg = /^(?!\D+$)(?![^a-zA-Z]+$)\S{6,20}$/
  //如果验证不通过就返回true
  return !reg.test(val) ? true : false
}
export function validateVerifyCode (val) {
  let reg = /^[a-z0-9]{6}$/
  //如果验证不通过就返回true
  return !reg.test(val) ? true : false
} 
