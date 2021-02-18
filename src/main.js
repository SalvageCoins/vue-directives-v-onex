import { debounce, throttle } from 'lodash';
import {
  enhanceTypeof, isSupportEvent, supportsPassive,
} from './lib/util';

const directive = {};

function makeDirectiveParams(binding, ctx = {}) {
  if (!binding) return {};
  const {
    value, expression, arg: eventName, modifiers,
  } = binding || {};
  const directiveParams = {
    eventName,
    // handler,
    handlerArgs: [],
    expression,
    modifiers,
    options: {},
    // extraOptions
  };
  const valueType = enhanceTypeof(value);
  if (valueType === 'function') {
    directiveParams.handler = value;
  } else if (valueType === 'object') {
    const { handlerName, options, args } = value;
    if (enhanceTypeof(ctx[handlerName]) === 'function') {
      directiveParams.handler = ctx[handlerName];
      directiveParams.handlerArgs = Array.isArray(args) ? args : [args];
    } else {
      console.warn(`method【${handlerName}】is not define`);
    }
    if (options) {
      directiveParams.options = options;
    }
  }
  return directiveParams;
}

function bindNativeEvent(el, binding, vnode) {
  const directiveParams = makeDirectiveParams(binding, vnode.context);
  const {
    handler, handlerArgs, eventName, modifiers, options,
  } = directiveParams;
  if (!eventName || !isSupportEvent(eventName, el) || !handler) return;
  function handleEvent(e) {
    if (modifiers.stop) {
      e.stopPropagation();
    }
    if (modifiers.prevent) {
      e.preventDefault();
    }
    if (!modifiers.self) {
      handler.call(vnode.context, ...handlerArgs);
    } else if (e.target === el) {
      handler.call(vnode.context, ...handlerArgs);
    }
  }
  let wrappedHandler = handleEvent;
  if (modifiers.debounce || modifiers.throttle) {
    const { wait = 200, leading = false, trailing = true } = options;
    if (modifiers.debounce) {
      wrappedHandler = debounce(handleEvent, wait, { leading, trailing }); // leading 是否延迟开始前调用, trailing 是否在延迟结束后调用
    } else if (modifiers.throttle) {
      wrappedHandler = throttle(handleEvent, wait);
    }
  }
  if (modifiers.once) {
    wrappedHandler = function (e) {
      handleEvent(e);
      el.removeEventListener(eventName, wrappedHandler);
    };
  }
  el.addEventListener(eventName, wrappedHandler, supportsPassive
    ? { capture: modifiers.capture, passive: modifiers.passive }
    : modifiers.capture);
}

function bindEvent(el, binding, vnode) {
  bindNativeEvent(el, binding, vnode);
}

directive.install = function (Vue) {
  Vue.directive('onex', {
    bind(el, binding, vnode) {
      bindEvent(el, binding, vnode);
    },
    update(el, binding, vnode) {
      bindEvent(el, binding, vnode);
    },
  });
};

export default directive;
