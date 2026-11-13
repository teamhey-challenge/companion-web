#!/usr/bin/env bash
# Chiron GoRound TC 가변 글꼴(shared 토큰 패키지, 1.8 MB)을 앱이 쓰는 굵기(400~700)로 줄이고 라틴·자주 쓰는 한글(KS X 1001 2,350자) 두 조각으로 나눈다.
# 일본어·중국어와 드문 한글은 글꼴 대체 목록(sans-serif)의 시스템 글꼴을 쓰므로 싣지 않는다.
# 필요: python3 + fonttools + brotli.  사용: scripts/build-fonts.sh   (결과는 git에 커밋한다)
set -euo pipefail
root="$(cd "$(dirname "$0")/.." && pwd)"
src="$root/shared/packages/tokens/fonts/ChironGoRoundTC-KoreanLatin.woff2"
out="$root/packages/ui-web/src/fonts"
tmp="$(mktemp -d)"; trap 'rm -rf "$tmp"' EXIT
mkdir -p "$out"
nice -n 19 fonttools varLib.instancer "$src" wght=400:700 -o "$tmp/lim.woff2"
# KS X 1001 완성형 한글 2,350자(자주 쓰는 글자)
python3 - "$tmp/common.txt" <<'PY'
import sys
s=set()
for hi in range(0xB0,0xC9):
    for lo in range(0xA1,0xFF):
        try: s.add(bytes([hi,lo]).decode('cp949'))
        except UnicodeDecodeError: pass
open(sys.argv[1],'w').write(''.join(sorted(s)))
PY
sub() { nice -n 19 pyftsubset "$tmp/lim.woff2" --flavor=woff2 --layout-features='*' --output-file="$1" "${@:2}"; }
sub "$out/chiron-latin.woff2" --unicodes="U+0020-007E,U+00A0-00FF,U+0100-024F,U+1EA0-1EF9,U+0131,U+0152-0153,U+2010-2027,U+2030-203A,U+20A9,U+20AC,U+2190-2193,U+2212,U+3000-303F"
sub "$out/chiron-hangul.woff2" --text-file="$tmp/common.txt" --unicodes="U+3130-318F"
# 드문 한글 음절(약 9,000자, 1.1 MB)은 싣지 않고 시스템 글꼴 대체에 맡긴다.
ls -l "$out"
