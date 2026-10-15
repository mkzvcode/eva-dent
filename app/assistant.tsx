"use client";

import { useEffect, useRef, useState } from "react";
import { consultation, openBooking } from "./booking";
import { clinic, faq, firstVisitPrice, lead, services, team, yandexMapsUrl } from "./content";
import { Icon } from "./icons";

/* Онлайн-помощник. Отвечает только тем, что есть на сайте клиники
   (content.ts) — без выдуманных цен и медицинских советов. Чего не знает —
   честно передаёт администратору. На рабочем сайте сюда можно подключить
   языковую модель с той же базой знаний. */

type Action =
  | { kind: "booking"; label: string; service?: string }
  | { kind: "link"; label: string; href: string };
type Msg = { from: "bot" | "user"; text: string; actions?: Action[] };

const hoursText = clinic.hours.map((h) => `${h.days} — ${h.time}`).join(", ");
const faqAnswer = (start: string) => faq.find((f) => f.q.startsWith(start))?.a ?? "";
const book = (service?: string): Action => ({ kind: "booking", label: "Записаться онлайн", service });
const call: Action = { kind: "link", label: `Позвонить ${clinic.phone}`, href: clinic.phoneHref };

// Ключевые основы слов → услуга из прайса.
const serviceKeys: [RegExp, number][] = [
  [/кариес|пломб|пульпит|лечени|болит|ноет/, 0],
  [/удал|мудрост|хирург|резекц/, 1],
  [/имплант/, 2],
  [/винир|реставр|эстетик|красив/, 3],
  [/корон|протез|вкладк|мост/, 4],
  [/гигиен|чистк|камен|налёт|налет|отбел/, 5],
  [/брекет|прикус|ортодонт|кривы|выровн/, 6],
  [/плазм|десн|ревидент|космет/, 7],
];

function reply(raw: string): Msg {
  const q = raw.toLowerCase().replace(/ё/g, "е");
  const has = (re: RegExp) => re.test(q);

  const serviceHit = serviceKeys.find(([re]) => has(re));
  if (serviceHit) {
    const s = services[serviceHit[1]];
    return {
      from: "bot",
      text: `${s.title}: ${s.text} По прайсу клиники — ${s.price}. Точную стоимость врач назовёт после осмотра, первичный приём — ${firstVisitPrice}.`,
      actions: [book(s.title), { kind: "link", label: "Прайс на сайте клиники", href: s.url }],
    };
  }
  if (has(/цен|стоим|сколько|прайс|дорого|руб/)) {
    return {
      from: "bot",
      text: `Первичный приём с осмотром и консультацией — ${firstVisitPrice}. Например: ${services
        .slice(0, 3)
        .map((s) => `${s.title.toLowerCase()} — ${s.price}`)
        .join("; ")}. Напишите, что нужно, — подскажу цену по направлению.`,
      actions: [book(consultation), { kind: "link", label: "Полный прайс", href: clinic.pricesUrl }],
    };
  }
  if (has(/первич|консульт|осмотр|первый/)) {
    return { from: "bot", text: faqAnswer("С чего начинается") + ` Стоимость — ${firstVisitPrice}.`, actions: [book(consultation)] };
  }
  if (has(/запис|прием|приём|попасть|свобод/)) {
    return {
      from: "bot",
      text: "Запишу вас за минуту: выберите направление, врача и удобное время — администратор перезвонит и подтвердит.",
      actions: [book(), call],
    };
  }
  if (has(/час|график|работа|открыт|выходн|суббот|воскрес|сегодня|завтра|до скольки|во сколько/)) {
    return { from: "bot", text: `Работаем без выходных: ${hoursText}.`, actions: [book()] };
  }
  if (has(/адрес|где|находит|добрат|доехать|проехать|карт|парков|остановк/)) {
    return {
      from: "bot",
      text: `Мы в ${clinic.city}е: ${clinic.street}.`,
      actions: [
        { kind: "link", label: "Маршрут в Яндекс Картах", href: yandexMapsUrl },
        { kind: "link", label: "2ГИС", href: clinic.gisUrl },
      ],
    };
  }
  if (has(/налог|вычет|ндфл|справк/)) {
    return { from: "bot", text: faqAnswer("Можно ли вернуть налог"), actions: [{ kind: "link", label: "Заявление на справку", href: clinic.taxUrl }] };
  }
  if (has(/боюсь|страш|больно|страх|паник|наркоз|анестез/)) {
    return { from: "bot", text: faqAnswer("Я боюсь"), actions: [book()] };
  }
  // Про детский приём на сайте клиники сведений нет — не придумываем.
  if (has(/дет|ребен|малыш|школьник|сын|дочь|дочк/)) {
    return {
      from: "bot",
      text: "Про приём детей на сайте клиники отдельной информации нет — уточните у администратора, он подскажет, к какому врачу записать ребёнка.",
      actions: [call, book()],
    };
  }
  if (has(/врач|доктор|специалист|кто лечит|леготин|шмидт|горелов/)) {
    return {
      from: "bot",
      text: `Главный врач — ${lead.name} ${lead.surname}: ${lead.specialties.join(", ").toLowerCase()}. Также принимают ${team
        .filter((t) => !/сестра/i.test(t.role))
        .map((t) => `${t.name.split(" ")[0]} ${t.surname} (${t.role.toLowerCase()})`)
        .join(" и ")}.`,
      actions: [book(), { kind: "link", label: "Сертификаты", href: clinic.specialistsUrl }],
    };
  }
  if (has(/телефон|позвон|номер|связат/)) {
    return { from: "bot", text: `Телефон администратора: ${clinic.phone}. ${hoursText}.`, actions: [call] };
  }
  if (has(/качеств|жалоб|претенз/)) {
    return { from: "bot", text: faqAnswer("Куда обратиться"), actions: [call] };
  }
  if (has(/привет|здравств|добрый|хай/)) {
    return { from: "bot", text: "Здравствуйте! Спросите про цены, врачей, часы работы или запишитесь онлайн." };
  }
  return {
    from: "bot",
    text: "На этот вопрос точно ответит администратор. Можно позвонить или оставить заявку — вам перезвонят.",
    actions: [call, book()],
  };
}

const quick = ["Сколько стоит?", "Записаться", "Часы работы", "Где вы находитесь?", "Вычет НДФЛ"];
const greeting: Msg = {
  from: "bot",
  text: `Здравствуйте! Я помощник клиники «${clinic.name}». Подскажу цены, часы работы и запишу на приём.`,
};

export function Assistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([greeting]);
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(false);
  const log = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    log.current?.scrollTo({ top: log.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  useEffect(() => {
    if (!open) return;
    input.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const ask = (question: string) => {
    const q = question.trim();
    if (!q || typing) return;
    setMessages((m) => [...m, { from: "user", text: q }]);
    setText("");
    setTyping(true);
    window.setTimeout(() => {
      setMessages((m) => [...m, reply(q)]);
      setTyping(false);
    }, 450);
  };

  const run = (a: Action) => {
    if (a.kind === "booking") {
      setOpen(false);
      openBooking(a.service);
    }
  };

  return (
    <div className={`assistant${open ? " is-open" : ""}`}>
      <section
        id="assistant-panel"
        className="assistant-panel"
        aria-label="Онлайн-помощник"
        hidden={!open}
      >
        <header className="assistant-head">
          <span className="assistant-avatar" aria-hidden="true">
            <Icon name="tooth" size={22} />
          </span>
          <div>
            <strong>Помощник {clinic.name}</strong>
            <small>Отвечает по информации с сайта клиники</small>
          </div>
          <button type="button" className="icon-btn icon-btn--sm" onClick={() => setOpen(false)} aria-label="Свернуть помощника">
            <Icon name="close" size={18} />
          </button>
        </header>

        <div className="assistant-log" ref={log} role="log" aria-live="polite">
          {messages.map((m, i) => (
            <div key={i} className={`msg msg--${m.from}`}>
              <p>{m.text}</p>
              {m.actions && (
                <div className="msg-actions">
                  {m.actions.map((a) =>
                    a.kind === "link" ? (
                      <a
                        key={a.label}
                        href={a.href}
                        className="msg-action"
                        {...(a.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      >
                        {a.label}
                      </a>
                    ) : (
                      <button key={a.label} type="button" className="msg-action msg-action--accent" onClick={() => run(a)}>
                        {a.label}
                      </button>
                    ),
                  )}
                </div>
              )}
            </div>
          ))}
          {typing && (
            <div className="msg msg--bot msg--typing" aria-label="Помощник печатает">
              <span /><span /><span />
            </div>
          )}
        </div>

        <div className="assistant-quick">
          {quick.map((q) => (
            <button key={q} type="button" onClick={() => ask(q)}>
              {q}
            </button>
          ))}
        </div>

        <form
          className="assistant-form"
          onSubmit={(e) => {
            e.preventDefault();
            ask(text);
          }}
        >
          <input
            ref={input}
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Задайте вопрос…"
            aria-label="Ваш вопрос"
            maxLength={300}
          />
          <button type="submit" className="assistant-send" aria-label="Отправить" disabled={!text.trim()}>
            <Icon name="send" size={18} />
          </button>
        </form>
      </section>

      <button
        type="button"
        className="assistant-fab"
        aria-expanded={open}
        aria-controls="assistant-panel"
        onClick={() => setOpen((v) => !v)}
      >
        <Icon name={open ? "close" : "chat"} size={24} />
        <span className="assistant-fab-label">{open ? "Свернуть" : "Есть вопрос?"}</span>
      </button>
    </div>
  );
}
