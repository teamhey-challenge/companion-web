/** 내부 전용: 부품 안에서 모듈 클래스 이름을 합친다. 밖으로 내보내지 않는다. */
export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}
