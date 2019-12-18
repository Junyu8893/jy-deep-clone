// 根据目标原型复制目标
export const handleTarget = target => {
  return new target.constructor()
}

// 复制布尔类型
export const handleBoolean = target => {
  return new Boolean(Boolean.prototype.valueOf.call(target))
}

// 复制字符串类型
export const handleString = target => {
  return new String(String.prototype.valueOf.call(target))
}

// 复制数值类型
export const handleNumber = target => {
  return new Number(Number.prototype.valueOf.call(target))
}

// 复制正则类型
export const handleRegExp = target => {
  const { source, flags } = target
  return new RegExp(source, flags)
}

// 复制错误类型
export const handleError = target => {
  const { message } = target
  return new Error(message)
}

// 复制日期类型
export const handleDate = target => {
  return new Date(target)
}

// 复制函数
export const handleFunction = target => {
  // 箭头函数直接返回
  if (!target.prototype) return target
  // 函数体和参数正则匹配
  const paramReg = /(?<=\().+(?=\)\s+\{)/
  const bodyReg = /(?<={)(.|\n)+(?=})/m
  const funcString = target.toString()
  const paramString = funcString.match(paramReg)
  const bodyString = funcString.match(bodyReg)
  const params = paramString ? paramString[0].split(',') : []
  const body = bodyString ? bodyString[0] : ''
  return new Function(...params, body)
}
