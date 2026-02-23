const test = require('node:test');
const assert = require('node:assert/strict');

const { getPagination } = require('../src/utils/pagination');

test('getPagination regresa null si no recibe page/limit', () => {
  assert.equal(getPagination({}), null);
});

test('getPagination normaliza valores válidos', () => {
  assert.deepEqual(getPagination({ page: '2', limit: '25' }), {
    page: 2,
    limit: 25,
    offset: 25
  });
});

test('getPagination usa fallback con valores inválidos', () => {
  assert.deepEqual(getPagination({ page: '-1', limit: '0' }), {
    page: 1,
    limit: 10,
    offset: 0
  });
});
