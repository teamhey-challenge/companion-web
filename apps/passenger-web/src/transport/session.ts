import type { CharacterInfo } from '@teamhey/hey-protocol';

const TOKEN_KEY = 'hey.phoneToken';
const CHARACTER_KEY = 'hey.character';

/** 이 폰 하나의 연결 정보. 토큰은 서버에 해시로만 있고, 폰에서는 localStorage에 둔다. */
export interface Session {
  getToken(): string | null;
  getCharacter(): CharacterInfo | null;
  save(token: string, character: CharacterInfo): void;
  clear(): void;
}

type Store = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

export function createSession(store: Store): Session {
  return {
    getToken() {
      try {
        return store.getItem(TOKEN_KEY) || null;
      } catch {
        return null;
      }
    },
    getCharacter() {
      try {
        const raw = store.getItem(CHARACTER_KEY);
        if (!raw) return null;
        const v = JSON.parse(raw) as Partial<CharacterInfo>;
        if (typeof v.name !== 'string' || (v.bodyColor !== 0 && v.bodyColor !== 1)) return null;
        return { name: v.name, bodyColor: v.bodyColor };
      } catch {
        return null;
      }
    },
    save(token, character) {
      store.setItem(TOKEN_KEY, token);
      store.setItem(CHARACTER_KEY, JSON.stringify(character));
    },
    clear() {
      try {
        store.removeItem(TOKEN_KEY);
        store.removeItem(CHARACTER_KEY);
      } catch {
        /* 저장소를 못 쓰는 브라우저: 지울 것도 없다 */
      }
    },
  };
}
