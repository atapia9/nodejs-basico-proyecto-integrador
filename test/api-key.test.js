// Pruebas del middleware de API key (Manual §4.2, Ej. 4.2): 401 sin la clave correcta.
const { describe, it, before, after, mock } = require('node:test');
const assert = require('node:assert/strict');

// Clave de prueba, sin relación con ninguna clave real. Se define antes de cargar la app.
// La base de pruebas es la misma que usa libros.test.js (ver el aviso en ese archivo).
process.env.MONGODB_URI = process.env.MONGODB_URI_PRUEBAS || 'mongodb://127.0.0.1:27017/biblioteca_test';
process.env.API_KEY = 'clave-de-prueba';

const app = require('../src/app');
const { conectar, desconectar } = require('../src/db');

let servidor;
let base;

before(async () => {
  mock.method(console, 'log', () => {});
  await conectar();
  await new Promise((resolver) => {
    servidor = app.listen(0, '127.0.0.1', resolver);
  });
  base = `http://127.0.0.1:${servidor.address().port}`;
});

after(async () => {
  servidor.close();
  await desconectar();
  mock.restoreAll();
});

const libro = JSON.stringify({ titulo: 'Aura', autor: 'Carlos Fuentes' });

describe('Autenticación por x-api-key', () => {
  it('GET /libros no exige la clave', async () => {
    const respuesta = await fetch(`${base}/libros`);
    assert.equal(respuesta.status, 200);
  });

  it('POST sin el header x-api-key responde 401', async () => {
    const respuesta = await fetch(`${base}/libros`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: libro,
    });
    assert.equal(respuesta.status, 401);
  });

  it('POST con una clave incorrecta responde 401', async () => {
    const respuesta = await fetch(`${base}/libros`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-api-key': 'otra-clave' },
      body: libro,
    });
    assert.equal(respuesta.status, 401);
  });

  it('POST con la clave correcta responde 201', async () => {
    const respuesta = await fetch(`${base}/libros`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-api-key': 'clave-de-prueba' },
      body: libro,
    });
    assert.equal(respuesta.status, 201);
  });

  it('DELETE sin la clave responde 401', async () => {
    const respuesta = await fetch(`${base}/libros/1`, { method: 'DELETE' });
    assert.equal(respuesta.status, 401);
  });
});
