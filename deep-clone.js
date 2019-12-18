import * as utils from './lib/utils'
import * as copy from './lib/copy'
import {
  MAP_TAG,
  SET_TAG,
  BOOLEAN_TAG,
  REGEXP_TAG,
  STRING_TAG,
  NUMBER_TAG,
  DATE_TAG,
  ERROR_TAG,
  FUNCTION_TAG,
  ARRAY_TAG,
  OBJECT_TAG
} from './lib/type'

const deepClone = (target, map = new WeakMap()) => {
  // 非引用类型，直接返回
  if (!utils.isObject(target)) {
    return target
  }

  let cloneTarget
  let type = utils.getType(target)

  switch (type) {
    case BOOLEAN_TAG:
      cloneTarget = copy.handleBoolean(target)
      break
    case STRING_TAG:
      cloneTarget = copy.handleString(target)
      break
    case NUMBER_TAG:
      cloneTarget = copy.handleNumber(target)
      break
    case REGEXP_TAG:
      cloneTarget = copy.handleRegExp(target)
      break
    case FUNCTION_TAG:
      cloneTarget = copy.handleFunction(target)
      break
    case ERROR_TAG:
      cloneTarget = copy.handleError(target)
      break
    case DATE_TAG:
      cloneTarget = copy.handleDate(target)
      break
    case OBJECT_TAG:
      cloneTarget = {}
      break
    case ARRAY_TAG:
      cloneTarget = new Array(target.length)
      break
    case MAP_TAG:
      cloneTarget = new Map()
      break
    case SET_TAG:
      cloneTarget = new Set()
      break
    default:
      cloneTarget = copy.handleTarget(target)
      break
  }

  // 处理循环引用问题，防止循环引用导致递归时内存栈溢出
  if (map.get(target)) {
    return map.get(target)
  }
  map.set(target, cloneTarget)

  // 处理Map对象
  if (type === MAP_TAG) {
    target.forEach((item, key) => {
      cloneTarget.set(deepClone(key, map), deepClone(item, key))
    })
  }

  // 处理Set对象
  if (type === SET_TAG) {
    target.forEach(item => {
      target.add(deepClone(item, map))
    })
  }

  // 处理原型，防止原型丢失
  utils.copyPrototype(cloneTarget, target)

  // 处理属性，普通属性 & Symbol属性
  const defaultProps = Object.getOwnPropertyNames(target)
  const symbolProps = Object.getOwnPropertySymbols(target)
  const props = [...defaultProps, ...symbolProps]
  for (let prop of props) {
    const desc = Object.getOwnPropertyDescriptor(target, prop)
    Object.defineProperty(cloneTarget, prop, {
      writable: desc.writable,
      enumerable: desc.enumerable,
      configurable: desc.configurable,
      value: deepClone(desc.value, map)
    })
  }

  return cloneTarget
}

export default deepClone
