import { useEffect, useRef, useState } from "react";
import { EVENTS, at, fmt } from "../lib/date";
import { T } from "../lib/i18n";
import { copyText, reduceMotion } from "../lib/utils";
import { OrnCard, Pill, SectionHead } from "./ui";

export default function Rsvp({ state, tr, hidden, toast, burst }) {
  const [name, setName] = useState("");
  const [att, setAtt] = useState("yes");
  const [guests, setGuests] = useState(1);
  const [picked, setPicked] = useState({
    mehendi: true,
    sangeet: true,
    wedding: true,
    reception: true,
  });
  const [note, setNote] = useState("");
  const [result, setResult] = useState(null);
  const nameRef = useRef(null);
  const resRef = useRef(null);

  useEffect(() => {
    if (result && resRef.current)
      resRef.current.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "center",
      });
  }, [result]);

  const submit = (e) => {
    e.preventDefault();
    const nm = name.trim();
    if (!nm) {
      toast(tr("needname"));
      nameRef.current && nameRef.current.focus();
      return;
    }
    const yes = att === "yes";
    const evs = EVENTS.filter((ev) => picked[ev.k]).map((ev) => T.en[ev.k]);
    const { bride, groom } = state;
    const msg =
      `Namaste! This is ${nm}. ` +
      (yes
        ? `We will be happy to attend ${bride} & ${groom}'s wedding. Guests: ${guests}.` +
          (evs.length ? ` Events: ${evs.join(", ")}.` : "")
        : `Sadly I will not be able to attend ${bride} & ${groom}'s wedding, but I send my love and best wishes.`) +
      (note.trim() ? "\n\n" + note.trim() : "");
    setResult({
      text: msg,
      link:
        "https://wa.me/" +
        (state.phone || "").replace(/\D/g, "") +
        "?text=" +
        encodeURIComponent(msg),
    });
    if (yes) burst(window.innerWidth / 2, window.innerHeight * 0.6, 60);
  };

  return (
    <section className="sec" id="rsvp" hidden={hidden}>
      <SectionHead eyebrow="RSVP" title={tr("rsvph")} />

      <form onSubmit={submit} noValidate>
        <OrnCard className="max-w-[560px] mx-auto mt-[30px] text-left grid gap-[18px]">
          <div>
            <label className="lab" htmlFor="rName">
              {tr("rname")}
            </label>
            <input
              id="rName"
              ref={nameRef}
              type="text"
              autoComplete="name"
              required
              className="field"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <span className="lab">{tr("attend")}</span>
            <div className="flex flex-wrap gap-2">
              <Pill
                type="radio"
                name="att"
                value="yes"
                checked={att === "yes"}
                onChange={() => setAtt("yes")}
              >
                {tr("accept")}
              </Pill>
              <Pill
                type="radio"
                name="att"
                value="no"
                checked={att === "no"}
                onChange={() => setAtt("no")}
              >
                {tr("decline")}
              </Pill>
            </div>
          </div>

          <div>
            <span className="lab">{tr("guests")}</span>
            <div className="inline-flex items-center border border-line rounded-full overflow-hidden">
              <button
                type="button"
                aria-label="Fewer guests"
                onClick={() => setGuests((g) => Math.max(1, g - 1))}
                className="w-[42px] h-[42px] border-0 bg-transparent text-[1.3rem] cursor-pointer text-gold"
              >
                −
              </button>
              <output
                aria-live="polite"
                className="min-w-[40px] text-center font-display text-[1.4rem]"
              >
                {guests}
              </output>
              <button
                type="button"
                aria-label="More guests"
                onClick={() => setGuests((g) => Math.min(10, g + 1))}
                className="w-[42px] h-[42px] border-0 bg-transparent text-[1.3rem] cursor-pointer text-gold"
              >
                +
              </button>
            </div>
          </div>

          <div>
            <span className="lab">{tr("which")}</span>
            <div className="flex flex-wrap gap-2">
              {EVENTS.map((ev) => {
                const d = at(state.date, ev.off, ev.h, ev.m);
                return (
                  <Pill
                    key={ev.k}
                    checked={!!picked[ev.k]}
                    onChange={(e) =>
                      setPicked((p) => ({ ...p, [ev.k]: e.target.checked }))
                    }
                  >
                    {tr(ev.k)} ·{" "}
                    {fmt(state.lang, d, { day: "numeric", month: "short" })}
                  </Pill>
                );
              })}
            </div>
          </div>

          <div>
            <label className="lab" htmlFor="rNote">
              {tr("note")}
            </label>
            <textarea
              id="rNote"
              className="field min-h-[92px] resize-y"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <button className="btn" type="submit">
            {tr("send")}
          </button>
          <p className="hint">{tr("rsvpnote")}</p>
        </OrnCard>
      </form>

      {result && (
        <div ref={resRef}>
          <OrnCard className="max-w-[560px] mx-auto mt-6 text-left">
            <h3 className="font-display font-medium text-[1.6rem] m-0">
              {tr("ready")}
            </h3>
            <pre className="whitespace-pre-wrap break-words font-sans bg-bg border border-dashed border-line rounded p-3.5 my-3 text-[.92rem]">
              {result.text}
            </pre>
            <div className="flex flex-wrap gap-2.5 mt-2">
              <a
                className="btn"
                href={result.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                {tr("wa")}
              </a>
              <button
                className="btn ghost"
                type="button"
                onClick={() =>
                  copyText(result.text).then((ok) => ok && toast(tr("copied")))
                }
              >
                {tr("copymsg")}
              </button>
            </div>
          </OrnCard>
        </div>
      )}
    </section>
  );
}
