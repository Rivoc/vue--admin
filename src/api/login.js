import service from '../utils/request';

//获取验证码
export function GetSms (data) {
  return service.request({
    method: 'post',
    url: "/getSms",
    data
  })
}
//获取验证码
export function Register (data) {
  return service.request({
    method: 'post',
    url: "/register",
    data
  })
}