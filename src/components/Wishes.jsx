import { useEffect, useState } from 'react';
import { OrnCard, SectionHead } from './ui';

const SEEDS = [
  { id: 's1', n: 'Neha & Rohan', m: 'May your home always be full of chai, laughter and good music. So happy for you both!', s: 1 },
  { id: 's2', n: 'Dadi', m: 'Sada khush raho. Bhagwan ka ashirwad hamesha tumhare saath rahe.', s: 1 },
  { id: 's3', n: 'Kabir', m: 'Cannot wait to dance at the sangeet. Get ready, you two!', s: 1 },
];

function loadMine() {
  try {
    return JSON.parse(localStorage.getItem('inv-wishes') || '[]').map((w, i) => ({ id: w.id || 'l' + i, ...w }));
  } catch (e) {
    return [];
  }
}

export default function Wishes({ tr, hidden, burst }) {
  const [mine, setMine] = useState(loadMine);
  const [name, setName] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    try { localStorage.setItem('inv-wishes', JSON.stringify(mine)); } catch (e) { /* ignore */ }
  }, [mine]);

  const post = (e) => {
    e.preventDefault();
    const m = msg.trim();
    if (!m) { document.getElementById('wMsg').focus(); return; }
    setMine((list) => [{ id: 'w' + Date.now(), n: name.trim() || 'A friend', m }, ...list].slice(0, 30));
    setMsg('');
    burst(window.innerWidth / 2, window.innerHeight * 0.6, 40);
  };

  return (
    <section className="sec" id="wishes" hidden={hidden}>
      <SectionHead eyebrow={tr('wish')} title={tr('wishh')} />

      <form onSubmit={post} noValidate>
        <OrnCard className="max-w-[560px] mx-auto mt-[30px] text-left grid gap-[18px]">
          <div>
            <label className="lab" htmlFor="wName">{tr('rname')}</label>
            <input id="wName" type="text" maxLength={40} className="field" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="lab" htmlFor="wMsg">{tr('wmsg')}</label>
            <textarea id="wMsg" maxLength={240} className="field min-h-[92px] resize-y" value={msg} onChange={(e) => setMsg(e.target.value)} />
          </div>
          <button className="btn" type="submit">{tr('post')}</button>
          <p className="hint">{tr('wnote')}</p>
        </OrnCard>
      </form>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-3.5 mt-[30px] text-left">
        {[...mine, ...SEEDS].map((x) => (
          <div key={x.id} className="relative bg-surface border border-line rounded-md p-5 animate-pop">
            <p className="mb-2.5 font-display text-[1.18rem] leading-[1.45] italic [overflow-wrap:anywhere]">“{x.m}”</p>
            <b className="font-medium text-[.8rem] tracking-[.14em] uppercase text-gold">{x.n}</b>
            {x.s && <em className="absolute top-2.5 right-3 text-[.62rem] tracking-[.16em] uppercase text-muted not-italic">{tr('sample')}</em>}
          </div>
        ))}
      </div>
    </section>
  );
}
