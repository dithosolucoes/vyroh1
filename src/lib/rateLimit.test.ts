import { describe, expect, it } from 'vitest';
import { checkRateLimit } from './rateLimit';

describe('checkRateLimit (Marco 7 — Segurança)', () => {
  it('permite requisições dentro do limite', () => {
    const key = `test-${Date.now()}-a`;
    const result = checkRateLimit(key, 3, 60_000);
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(2);
  });

  it('bloqueia depois de exceder o limite', () => {
    const key = `test-${Date.now()}-b`;
    checkRateLimit(key, 2, 60_000);
    checkRateLimit(key, 2, 60_000);
    const third = checkRateLimit(key, 2, 60_000);
    expect(third.allowed).toBe(false);
    expect(third.retryAfterSeconds).toBeGreaterThan(0);
  });

  it('cada chave (ex.: IP) tem contador independente', () => {
    const keyA = `test-${Date.now()}-c1`;
    const keyB = `test-${Date.now()}-c2`;
    checkRateLimit(keyA, 1, 60_000);
    const resultB = checkRateLimit(keyB, 1, 60_000);
    expect(resultB.allowed).toBe(true);
  });
});
