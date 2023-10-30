const { test, expect } = require('@jest/globals')
const { JSDOM } = require('jsdom')
const { normalizeUrl } = require('./crawl.js')
const {getURLsFromHTML} = require('./crawl.js')

test('normalizeUrl test case 1', () => {
  expect(normalizeUrl('https://blog.boot.dev/path/')).toBe('blog.boot.dev/path');
});

test('normalizeUrl test case 2', () => {
    expect(normalizeUrl('https://blog.boot.dev/path')).toBe('blog.boot.dev/path');
});

test('normalizeUrl test case 3', () => {
    expect(normalizeUrl('http://blog.boot.dev/path/')).toBe('blog.boot.dev/path');
});

test('normalizeUrl test case 4', () => {
    expect(normalizeUrl('http://blog.boot.dev/path')).toBe('blog.boot.dev/path');
});

test('normalizeUrl test case 5', () => {
    expect(normalizeUrl('https://www.youtube.com/watch?v=2JYT5f2isg4&t=221s')).toBe('www.youtube.com/watch');
});

test('normalizeUrl test case 6', () => {
    expect(normalizeUrl('https://jestjs.io/docs/getting-started')).toBe('jestjs.io/docs/getting-started');
});

test('getURLsFromHTML test case 1', () => {
    const dom = new JSDOM('htmlBody')
    expect(getURLsFromHTML(dom, 'https://blog.boot.dev')).toBe('foo');
});
