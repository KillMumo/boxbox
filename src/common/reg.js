export const HttpReg = /^https?:/
export const UserNameReg = /^([0-9A-Za-z]|[\u4e00-\u9fa5]){6,20}$/
export const PwdReg = /^[a-zA-Z0-9#@!~%^&*_]{8,16}$/
export const EmailReg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/

// 密码正则
//export const PasswordReg = /^(?!([a-zA-Z]+|\d+)$)[a-zA-Z\d]{6,20}$/
export const PasswordReg = /(?!^(\d+|[a-zA-Z]+|[~!@#$%^&*?]+)$)^[\w~!@#$%^&*?]{8,16}$/

// 管理员姓名
export const AdminNameReg = /^([a-z]|[A-Z]|[\u4e00-\u9fa5]){1,20}$/

// 身份证号
export const IDCardReg = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/

// 手机号正则
export const PhoneReg = /^((13[0-9])|(14[5,7,9])|(15([0-3]|[5-9]))|(166)|(17[0,1,3,5,6,7,8])|(18[0-9])|(19[8|9]))\d{8}$/

// 短信验证码
export const VerifyCodeReg = /^\d{6}$/

// 组织机构码
export const OrgCodeReg = /^([0-9a-zA-Z]){8}(-)([0-9]|[A-Z])$/i

// 银行卡号
export const BankCodeReg = /^[0-9]{8,30}$/

// 文件名称正则
export const FileNameReg = /^([0-9]|[a-z]|[A-Z]|[-]|[_]|[{[\]}()<>《》{}【】（）]|[\u4e00-\u9fa5]){1,30}$/

//所属支行
// export const SubBranch = /^\s|\s$/
export const SubBranch = /^[^/\s](.*[^/\s])?$/

//用户姓名正则
export const UserName = /^([a-z]|[A-Z]|[\u4e00-\u9fa5]){1,20}$/

//企业名称正则
export const cmyNameReg = /^([0-9]|[a-z]|[A-Z]|[\u4e00-\u9fa5]|\(|\)|（|）){1,50}$/

//金额正则
export const amountReg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/

// 银行流水
export const bankStreamReg = /^[0-9]{0,30}$/

// 带负数金额失焦校验
export const negMoneyReg = /^((-?\d+(\.\d{0,2})?)|\s)$/
