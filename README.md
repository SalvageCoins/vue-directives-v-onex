# v-onex

## Intro
`v-onex` 是一个因v-on不支持防抖、节流修饰符而开发的扩展性自定义指令。
采用原生的事件注册机制，暂不支持用于自定义事件。推荐使用v1.0.5

## log
v1.0.3：默认事件处理方法传参为event, wait默认时间改为400
v1.0.4：fix 事件重复绑定bug, 事件绑定改为覆盖式绑定（一个事件只允许绑定一个回调）, 移除capture passive修饰符支持
v1.0.5：prevent、stop不参与防抖、节流，每次都触发

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
- self

### 参数(options)
| 参数名称 | 数据类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| leading | Boolean | false | false | 是否延迟开始前调用(仅debounce生效) |
| trailing | Boolean | false | true | 是否在延迟结束后调用(仅debounce生效) |
| args | Any | false | null | 传给handler的参数 |
| wait | Number | false | 400 | 等待时间 |