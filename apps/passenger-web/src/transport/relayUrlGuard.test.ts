import { describe, expect, test } from 'bun:test';
import { assertSecureRelayUrl } from './relayUrlGuard';

describe('M3 운영 빌드의 중계 서버 주소', () => {
  test('운영 빌드에서 http 주소는 실패한다', () => {
    expect(() => assertSecureRelayUrl('http://relay.example.com', 'production')).toThrow('https');
  });
  test('운영 빌드에서 주소가 없으면 실패한다', () => {
    expect(() => assertSecureRelayUrl(undefined, 'production')).toThrow();
  });
  test('https와 localhost는 통과한다', () => {
    expect(() => assertSecureRelayUrl('https://relay.example.com', 'production')).not.toThrow();
    expect(() => assertSecureRelayUrl('http://localhost:8787', 'production')).not.toThrow();
  });
  test('개발·시험 모드는 막지 않는다', () => {
    expect(() => assertSecureRelayUrl('http://10.0.0.5:8787', 'development')).not.toThrow();
  });
});
