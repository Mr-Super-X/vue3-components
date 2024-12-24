// block 代码块  element 元素  modifier 装饰  state 状态
// c-button
// c-button__element
// c-button__element--disabled
// is-checked is-enabled

// :class="[bem.b()]"


/**
 * 前缀名字 c-button-box__element--modifier
 * @param prefixName 前缀名
 * @param block 代码块名
 * @param element 元素名
 * @param modifier 装饰符名
 * @returns  说白了 ，就是提供一个函数，用来拼接三个字符串，并用不同的符号进行分隔开来
 */
function _bem(prefixName: string, block: string, element: string, modifier: string) {
  if (block) {
    prefixName += `-${block}`
  }
  if (element) {
    prefixName += `__${element}`
  }
  if (modifier) {
    prefixName += `--${modifier}`
  }

  return prefixName
}

function createBEM(prefixName: string) {
  const b = (block: string = '') => _bem(prefixName, block, '', '')
  const e = (element: string = '') => element ? _bem(prefixName, '', element, '') : ''
  const m = (modifier: string = '') => modifier ? _bem(prefixName, '', '', modifier) : ''


  const be = (block: string = '', element: string = '') => block && element ? _bem(prefixName, block, element, '') : ''
  const bm = (block: string = '', modifier: string = '') => block && modifier ? _bem(prefixName, block, '', modifier) : ''
  const em = (element: string = '', modifier: string = '') => element && modifier ? _bem(prefixName, '', element, modifier) : ''
  const bem = (block: string = '', element: string = '', modifier: string = '') => block && element && modifier ? _bem(prefixName, block, element, modifier) : ''

  const is = (name: string, state: string | boolean) => (state ? `is-${name}` : '')

  return {
    b,
    e,
    m,
    be,
    bm,
    em,
    bem,
    is,
  }
}

export function createNamespace(name: string) {
  const prefixName = `c-${name}`
  return createBEM(prefixName)
}


// 测试用例
// const bem = createNamespace('button')
// console.log(bem.b())
// console.log(bem.e('ele'))
// console.log(bem.m('modify'))
// console.log(bem.be('box', 'ele'))
// console.log(bem.bm('box', 'mod'))
// console.log(bem.em('ele', 'mod'))
// console.log(bem.bem('box', 'ele', 'mod'))
// console.log(bem.is('checked', true))
