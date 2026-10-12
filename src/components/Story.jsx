import { Icon, OrnCard, SectionHead } from './ui';

const CHAPTERS = [
  { ic: 'i-umb', t: 's1t', p: 's1' },
  { ic: 'i-chai', t: 's2t', p: 's2' },
  { ic: 'i-heart', t: 's3t', p: 's3' },
];

export default function Story({ tr, hidden }) {
  return (
    <section className="sec" id="story" hidden={hidden}>
      <SectionHead eyebrow={tr('story')} title={tr('storyh')} />
      <div className="grid grid-cols-[repeat(auto-fit,minmax(230px,1fr))] gap-[18px] mt-[34px] text-center">
        {CHAPTERS.map((c) => (
          <OrnCard key={c.t} className="group !px-[22px] !py-[30px]">
            <div className="w-[54px] h-[54px] mx-auto rounded-full grid place-items-center border border-gold text-gold transition group-hover:bg-gold group-hover:text-onacc">
              <Icon id={c.ic} className="w-[26px] h-[26px] fill-none stroke-current [stroke-width:1.5]" />
            </div>
            <h3 className="font-display font-medium text-[1.55rem] mt-[.5em] mb-[.2em]">{tr(c.t)}</h3>
            <p className="text-muted m-0">{tr(c.p)}</p>
          </OrnCard>
        ))}
      </div>
    </section>
  );
}
