/**
 * 返回传入目标的类型 -> [object Type]
 * @param {target} target 目标
 */
export const getType = target => Object.prototype.toString.call(target)

/**
 * 判断目标是否为引用类型
 * @param {target} target 目标
 */
export const isObject = target => (typeof target === 'object' || typeof target === 'function') && target !== null

/**
 * 拷贝一个对象原型拷贝另一个原型
 * @param {Object} obj 接收原型的目标
 * @param {Object} prototypeObj 提供原型的目标
 */
export const copyPrototype = (obj, prototypeObj) => {
  const proto = Object.getPrototypeOf(prototypeObj)
  Object.setPrototypeOf(obj, proto)
}
