// block 代码块  element 元素  modifier 装饰  state 状态
// c-button
// c-button__element
// c-button__element--disabled
// is-checked is-enabled

// :class="[bem.b()]"


/**
 * 前缀名字 c-button-box__element--modifier
 * @param prefixName 前缀名
 * @param blockSuffix 代码块名
 * @param element 元素名
 * @param modifier 装饰符名
 * @returns  说白了 ，就是提供一个函数，用来拼接三个字符串，并用不同的符号进行分隔开来
 */
function _bem(prefixName: string, blockSuffix: string, element: string, modifier: string) {
  if (blockSuffix) {
    prefixName += `-${blockSuffix}`
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
  const b = (blockSuffix: string = '') => _bem(prefixName, blockSuffix, '', '')
  const e = (element: string = '') => element ? _bem(prefixName, '', element, '') : ''
  const m = (modifier: string = '') => modifier ? _bem(prefixName, '', '', modifier) : ''


  const be = (blockSuffix: string = '', element: string = '') => blockSuffix && element ? _bem(prefixName, blockSuffix, element, '') : ''
  const bm = (blockSuffix: string = '', modifier: string = '') => blockSuffix && modifier ? _bem(prefixName, blockSuffix, '', modifier) : ''
  const em = (element: string = '', modifier: string = '') => element && modifier ? _bem(prefixName, '', element, modifier) : ''
  const bem = (blockSuffix: string = '', element: string = '', modifier: string = '') => blockSuffix && element && modifier ? _bem(prefixName, blockSuffix, element, modifier) : ''

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
