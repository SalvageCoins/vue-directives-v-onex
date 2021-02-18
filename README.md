# v-onex

## Intro
`v-onex` 是一个因v-on不支持防抖、节流修饰符而开发的扩展性自定义指令。
v1.0.0版本采用原生的事件注册机制，暂不支持定义事件。

## Getting started
1. install
```bash
npm install v-onex -S
```
2. use
```ecmascript 6
import vueOnEx from 'v-onex'
Vue.use(vueOnEx)
```
3. examples
- object params
```html
<button v-onex:click.debounce="{handlerName: 'onCardClick', options: {leading: true, trailing: false}}"></button>
```

- string params
```html
<button v-onex:click="onClick"></button>
<button v-onex:click.debounce="onClick"></button>
```

## APIs
```html
<button v-onex:[arg].[modifierA].[modifierB]="[funcName]"></button>
<button v-onex:[arg].[modifierA].[modifierB]="{handlerName: [funcName], options: {}"></button>
```
### 事件名(arg)
- 原生Dom事件名，eg. click、hover ...

### 修饰符(modifiers)
- debounce(防抖)
- throttle(节流)
- stop(取消冒泡)
- prevent(阻止默认事件)
- once(触发一次后销毁)
- passive
- capture
- self

### 参数(options)
| 参数名称 | 数据类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| leading | Boolean | false | false | 是否延迟开始前调用(仅debounce生效) |
| trailing | Boolean | false | true | 是否在延迟结束后调用(仅debounce生效) |
| args | Any | false | null | 传给handler的参数 |
| wait | Number | false | 200 | 等待时间 |