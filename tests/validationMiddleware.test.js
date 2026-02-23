const test = require('node:test');
const assert = require('node:assert/strict');

const {
  validateLoginPayload,
  validateEmployeePayload,
  validateProfilePayload
} = require('../src/middlewares/validationMiddleware');

const createRes = () => {
  const response = {
    statusCode: 200,
    body: null
  };

  response.status = (code) => {
    response.statusCode = code;
    return {
      json: (payload) => {
        response.body = payload;
        return response;
      }
    };
  };

  return response;
};

test('validateLoginPayload acepta payload válido y limpia nómina', () => {
  const req = { body: { num_nomina: ' 1234 ', password: 'secret' } };
  const res = createRes();
  let nextCalled = false;

  validateLoginPayload(req, res, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, true);
  assert.equal(req.body.num_nomina, '1234');
});

test('validateEmployeePayload rechaza rol inválido', () => {
  const req = { body: { num_nomina: '1234', password: 'abc', rol: 'ROOT' } };
  const res = createRes();
  let nextCalled = false;

  validateEmployeePayload(req, res, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, false);
  assert.equal(res.statusCode, 400);
  assert.deepEqual(res.body, { message: 'Rol no válido' });
});

test('validateProfilePayload exige al menos un campo permitido', () => {
  const req = { body: { nombre: 'No permitido' } };
  const res = createRes();
  let nextCalled = false;

  validateProfilePayload(req, res, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, false);
  assert.equal(res.statusCode, 400);
});
