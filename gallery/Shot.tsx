// 수집한 그림(차 앱 스냅샷·시안)을 이야기에서 보이는 얇은 틀. 이야기 파일은 scripts/collect-gallery.ts 가 만든다.
// 색·간격은 토큰(var(--hey-*))만 쓴다. 그림 주소는 상대 경로라 /storybook/ 아래에서도 맞는다.
import type { CSSProperties, ReactNode } from 'react';

type Img = { file: string; width: number; height: number };
type Mock = Img & { label: string };

const page: CSSProperties = {
  padding: 'var(--hey-space-16)',
  background: 'var(--hey-color-bg-page)',
  color: 'var(--hey-color-fg-default)',
  fontFamily: 'var(--hey-font-family)',
  minHeight: '100vh',
  boxSizing: 'border-box',
};
const label: CSSProperties = { fontSize: 'var(--hey-type-label-size)', lineHeight: 'var(--hey-type-label-line)', fontWeight: 600, margin: '0 0 var(--hey-space-4)' };
const small: CSSProperties = { fontSize: 'var(--hey-type-label-size)', color: 'var(--hey-color-fg-muted)', margin: 'var(--hey-space-8) 0 0' };
const frame: CSSProperties = { display: 'block', width: '100%', height: 'auto', border: 'var(--hey-border-hairline) solid var(--hey-color-border-default)', borderRadius: 'var(--hey-radius-sm)', background: 'var(--hey-color-bg-surface)' };

function Picture({ img, alt }: { img: Img; alt: string }) {
  return <img src={img.file} alt={alt} width={img.width} height={img.height} loading="lazy" decoding="async" style={frame} />;
}

function Pane({ title, children }: { title: string; children: ReactNode }) {
  return (
    <figure style={{ margin: 0, minWidth: 0 }}>
      <figcaption style={label}>{title}</figcaption>
      {children}
    </figure>
  );
}

const sources = (car?: string, ui?: string) =>
  [car && `companion-car ${car.slice(0, 7)}`, ui && `hey-companion-ui ${ui.slice(0, 7)}`].filter(Boolean).join(' · ');

/** 차 앱 부품: 라이트·다크 스냅샷을 나란히. */
export function CarPart({ name, light, dark, sha }: { name: string; light: Img | null; dark: Img | null; sha: string }) {
  return (
    <div style={page}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--hey-space-16)' }}>
        {light && (
          <Pane title="라이트">
            <Picture img={light} alt={`${name} 라이트`} />
          </Pane>
        )}
        {dark && (
          <Pane title="다크">
            <Picture img={dark} alt={`${name} 다크`} />
          </Pane>
        )}
      </div>
      <p style={small}>Paparazzi 스냅샷 · {sources(sha)}</p>
    </div>
  );
}

/** 차 앱 화면: 시안이 있으면 앱('앱')과 시안('시안')을 같은 폭으로 나란히. 테마는 같은 것끼리 짝지었다. */
export function CarScreen({ name, theme, px, app, mock, note, sha, uiSha }: { name: string; theme: string; px: number; app: Img; mock: Mock | null; note: string; sha: string; uiSha: string }) {
  return (
    <div style={page}>
      <div style={{ display: 'grid', gridTemplateColumns: mock ? 'repeat(auto-fit, minmax(420px, 1fr))' : 'minmax(0, 1fr)', gap: 'var(--hey-space-16)' }}>
        <Pane title="앱">
          <Picture img={app} alt={`${name} 앱 ${theme}`} />
        </Pane>
        {mock && (
          <Pane title="시안">
            <Picture img={mock} alt={`${name} 시안 ${theme}: ${mock.label}`} />
          </Pane>
        )}
      </div>
      <p style={small}>
        {name} · {theme} · {px}dp 스냅샷{mock ? ` · 시안 “${mock.label}”` : ''}
        {note ? ` · ${note}` : ''} · {sources(sha, mock ? uiSha : undefined)}
      </p>
    </div>
  );
}

/** 시안 한 장. */
export function MockupShot({ label: title, file, width, height, sha }: { label: string; file: string; width: number; height: number; sha: string }) {
  return (
    <div style={page}>
      <Pane title={title}>
        <Picture img={{ file, width, height }} alt={title} />
      </Pane>
      <p style={small}>디자이너 시안 delivery-v05 · {sources(undefined, sha)}</p>
    </div>
  );
}

/** 폰 웹: 실제 이야기(앱)를 iframe 으로 불러와 시안 옆에 같은 폭으로 놓는다. */
export function PhoneCompare({ name, theme, storyId, mock, uiSha }: { name: string; theme: string; storyId: string; mock: Mock; uiSha: string }) {
  const width = 390;
  const height = Math.round((width * mock.height) / mock.width);
  return (
    <div style={page}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--hey-space-24)', alignItems: 'flex-start' }}>
        <figure style={{ margin: 0, width }}>
          <figcaption style={label}>앱</figcaption>
          <iframe
            title={`${name} 앱`}
            src={`iframe.html?id=${storyId}&viewMode=story&globals=theme:${theme}`}
            loading="lazy"
            style={{ ...frame, width, height: Math.min(height, 844) }}
          />
        </figure>
        <figure style={{ margin: 0, width }}>
          <figcaption style={label}>시안</figcaption>
          <img src={mock.file} alt={`${name} 시안: ${mock.label}`} width={width} height={height} loading="lazy" decoding="async" style={{ ...frame, width, height }} />
        </figure>
      </div>
      <p style={small}>
        {name} · {theme} · 앱은 이 Storybook의 실제 이야기, 시안 “{mock.label}” · {sources(undefined, uiSha)}
      </p>
    </div>
  );
}
