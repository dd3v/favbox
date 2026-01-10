import { describe, expect, it } from 'vitest';
import hashCode from '@/services/hash';

describe('hashCode', () => {
  it('should generate hash for single string', () => {
    const hash = hashCode('test');
    expect(hash).toBeTypeOf('string');
    expect(hash).not.toBe('0');
  });

  it('should generate same hash for same input', () => {
    const hash1 = hashCode('domain', 'example.com');
    const hash2 = hashCode('domain', 'example.com');
    expect(hash1).toBe(hash2);
  });

  it('should generate different hash for different inputs', () => {
    const hash1 = hashCode('domain', 'example.com');
    const hash2 = hashCode('domain', 'google.com');
    expect(hash1).not.toBe(hash2);
  });

  it('should generate different hash for different keys with same value', () => {
    const hash1 = hashCode('domain', 'test');
    const hash2 = hashCode('tag', 'test');
    expect(hash1).not.toBe(hash2);
  });

  it('should concatenate multiple strings', () => {
    const hash1 = hashCode('domain', 'example.com');
    const hash2 = hashCode('domainexample.com');
    expect(hash1).toBe(hash2);
  });

  it('should trim whitespace from strings', () => {
    const hash1 = hashCode('domain', 'example.com');
    const hash2 = hashCode('domain', '  example.com  ');
    expect(hash1).toBe(hash2);
  });

  it('should filter out empty strings', () => {
    const hash1 = hashCode('domain', 'example.com');
    const hash2 = hashCode('domain', '', 'example.com', '');
    expect(hash1).toBe(hash2);
  });

  it('should return "0" for empty string', () => {
    expect(hashCode('')).toBe('0');
  });

  it('should return "0" for array of empty strings', () => {
    expect(hashCode('', '', '')).toBe('0');
  });

  it('should return "0" for no arguments', () => {
    expect(hashCode()).toBe('0');
  });

  it('should return "0" for non-string arguments', () => {
    expect(hashCode(123)).toBe('0');
    expect(hashCode(null)).toBe('0');
    expect(hashCode(undefined)).toBe('0');
    expect(hashCode({})).toBe('0');
    expect(hashCode([])).toBe('0');
  });

  it('should return "0" for mixed string and non-string arguments', () => {
    expect(hashCode('test', 123)).toBe('0');
    expect(hashCode('test', null)).toBe('0');
    expect(hashCode('test', undefined)).toBe('0');
  });

  it('should handle special characters', () => {
    const hash = hashCode('tag', 'test-tag_123');
    expect(hash).toBeTypeOf('string');
    expect(hash).not.toBe('0');
  });

  it('should handle unicode characters', () => {
    const hash = hashCode('tag', 'тест');
    expect(hash).toBeTypeOf('string');
    expect(hash).not.toBe('0');
  });

  it('should always return positive number as string', () => {
    const hash = hashCode('test');
    expect(parseInt(hash, 10)).toBeGreaterThanOrEqual(0);
  });
});
