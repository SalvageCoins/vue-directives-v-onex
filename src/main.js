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
      if (args !== null && args !== undefined) {
        directiveParams.handlerArgs = Array.isArray(args) ? args : [args];
      }
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
    handler, eventName, modifiers, options,
  } = directiveParams;
  let { handlerArgs } = directiveParams;
  if (!eventName || !isSupportEvent(eventName, el) || !handler) return;
  function beforeExecuteHandler(e) {
    if (modifiers.stop) {
      e.stopPropagation();
    }
    if (modifiers.prevent) {
      e.preventDefault();
    }
  }
  function handleEvent(e) {
    handlerArgs = handlerArgs.length ? handlerArgs : [e];
    if (!modifiers.self) {
      handler.call(vnode.context, ...handlerArgs);
    } else if (e.target === el) {
      handler.call(vnode.context, ...handlerArgs);
    }
  }
  let wrappedHandler = function (e) {
    beforeExecuteHandler(e);
    handleEvent(e);
  };
  if (modifiers.debounce || modifiers.throttle) {
    const { wait = 400, leading = false, trailing = true } = options;
    if (modifiers.debounce) {
      const debounceHandler = debounce(handleEvent, wait, { leading, trailing }); // leading 是否延迟开始前调用, trailing 是否在延迟结束后调用
      wrappedHandler = function (e) {
        beforeExecuteHandler(e);
        debounceHandler(e);
      };
    } else if (modifiers.throttle) {
      const throttleHandler = throttle(handleEvent, wait);
      wrappedHandler = function (e) {
        beforeExecuteHandler(e);
        throttleHandler(e);
      };
    }
  }
  if (modifiers.once) {
    wrappedHandler = function (e) {
      beforeExecuteHandler(e);
      handleEvent(e);
      // eslint-disable-next-line no-param-reassign
      el[`on${eventName}`] = null;
      // el.removeEventListener(eventName, wrappedHandler);
    };
  }
  // eslint-disable-next-line no-param-reassign
  el[`on${eventName}`] = wrappedHandler;
  // el.addEventListener(eventName, wrappedHandler, supportsPassive
  //   ? { capture: modifiers.capture, passive: modifiers.passive }
  //   : modifiers.capture);
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
