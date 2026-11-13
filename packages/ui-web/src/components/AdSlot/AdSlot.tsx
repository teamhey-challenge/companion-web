import { Card } from '../Card/Card';
import { Stack } from '../Stack/Stack';
import { StatusPill } from '../StatusPill/StatusPill';
import { Text } from '../Text/Text';
import type { Lang } from '../ThemeProvider/ThemeProvider';

export interface AdItem {
  id: string;
  title: string;
  /** 한 줄 소개. */
  body?: string;
  /** 장소·거리·광고주 같은 작은 글씨 한 줄. */
  meta?: string;
}

export interface AdSlotProps {
  /** "광고" / "Ad" 같은 표시 문구. 항상 보인다. */
  label: string;
  /** 항목 글의 언어. 띄어쓰기 없는 글의 줄바꿈과 글꼴 선택에 쓴다. */
  lang?: Lang;
  /** 광고 항목. 0개면 아무것도 그리지 않는다(표시 문구도 없다). */
  items: AdItem[];
}

/** 승객 화면의 여행 광고 한 칸. 광고임을 표시 문구로 늘 밝히고, 비면 자리도 차지하지 않는다. 눌러서 나가는 곳이 없다. */
export function AdSlot({ label, lang, items }: AdSlotProps) {
  if (items.length === 0) return null;
  return (
    <section aria-label={label}>
      <Stack gap={8}>
        <StatusPill tone="neutral" label={label} />
        <Stack gap={8} as="ul">
          {items.map((item) => (
            <Card key={item.id} tone="sunken" padding={16}>
              <Stack gap={4}>
                <Text variant="bodyStrong" as="p" lang={lang}>
                  {item.title}
                </Text>
                {item.body ? (
                  <Text variant="label" tone="muted" lang={lang}>
                    {item.body}
                  </Text>
                ) : null}
                {item.meta ? (
                  <Text variant="caption" tone="subtle" lang={lang}>
                    {item.meta}
                  </Text>
                ) : null}
              </Stack>
            </Card>
          ))}
        </Stack>
      </Stack>
    </section>
  );
}
