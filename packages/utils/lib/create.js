'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.createNamespace = createNamespace
function _bem(prefixName, block, element, modifier) {
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
function createBEM(prefixName) {
  const b = (block = '') => _bem(prefixName, block, '', '')
  const e = (element = '') => (element ? _bem(prefixName, '', element, '') : '')
  const m = (modifier = '') => (modifier ? _bem(prefixName, '', '', modifier) : '')
  const be = (block = '', element = '') => (block && element ? _bem(prefixName, block, element, '') : '')
  const bm = (block = '', modifier = '') => (block && modifier ? _bem(prefixName, block, '', modifier) : '')
  const em = (element = '', modifier = '') => (element && modifier ? _bem(prefixName, '', element, modifier) : '')
  const bem = (block = '', element = '', modifier = '') =>
    block && element && modifier ? _bem(prefixName, block, element, modifier) : ''
  const is = (name, state) => (state ? `is-${name}` : '')
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
function createNamespace(name) {
  const prefixName = `c-${name}`
  return createBEM(prefixName)
}
