/* 空函数 */
export function noop() { }

/* 增强版类型判断 */
export const enhanceTypeof = (function () {
  const objectTypeTagMap = {};
  'Array Date RegExp Object Error'.split(' ').forEach((tag) => {
    objectTypeTagMap[`[object ${tag}]`] = tag.toLowerCase();
  });
  return function (target) {
    if (target === null) return 'null';
    const typeofType = typeof target;
    return typeofType === 'object' ? (objectTypeTagMap[Object.prototype.toString.call(target)] || 'object') : typeofType;
  };
}());

/* key-value object类型 */
export function isObject(obj) {
  return enhanceTypeof(obj) === 'object';
}

/* Function类型 */
export function isFunction(func) {
  return enhanceTypeof(func) === 'function';
}

/* 元素el是否支持事件，eg. 'click' */
export function isSupportEvent(eventName, el) {
  let result = false;
  if (eventName && el && el.tagName) {
    result = `on${eventName}` in el;
  }
  return result;
}

const inBrowser = typeof window !== 'undefined';
// eslint-disable-next-line import/no-mutable-exports
export let supportsPassive = false;
if (inBrowser) {
  try {
    const opts = {};
    Object.defineProperty(opts, 'passive', {
      // eslint-disable-next-line getter-return
      get() {
        supportsPassive = true;
      },
    }); // https://github.com/facebook/flow/issues/285
    window.addEventListener('test-passive', null, opts);
  // eslint-disable-next-line no-empty
  } catch (e) { }
}
