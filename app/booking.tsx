"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import {
  bookingDoctors,
  bookingEndpoint,
  clinic,
  isDemo,
  services,
} from "./content";
import { Icon } from "./icons";

/* ── Открытие записи из любого места страницы ─────────────────
   Кнопки «Записаться» — обычные ссылки tel:. Если JS загрузился,
   клик открывает онлайн-запись; если нет — работает звонок. */
const OPEN_EVENT = "eva:open-booking";

/** service — название услуги, doctor — id из bookingDoctors: запись
 *  откроется с уже выбранными значениями. */
export function openBooking(service?: string, doctor?: string) {
  window.dispatchEvent(new CustomEvent(OPEN_EVENT, { detail: { service, doctor } }));
}

export const consultation = "Консультация — пока не знаю, что нужно";
const serviceOptions = [consultation, ...services.map((s) => s.title)];

/* ── Даты и время ─────────────────────────────────────────── */
const DAYS_AHEAD = 14;
const weekday = new Intl.DateTimeFormat("ru-RU", { weekday: "short" });
const dayMonth = new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "short" });
const fullDate = new Intl.DateTimeFormat("ru-RU", { weekday: "long", day: "numeric", month: "long" });

const isWeekend = (d: Date) => d.getDay() === 0 || d.getDay() === 6;
const isoDate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

function upcomingDays() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  return Array.from({ length: DAYS_AHEAD }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

// Слоты по часу; последний — за час до закрытия. Сегодня — только будущие,
// не раньше чем через час, чтобы администратор успел перезвонить.
function slotsFor(day: Date) {
  const { from, to } = isWeekend(day) ? clinic.workHours.weekend : clinic.workHours.weekday;
  const now = new Date();
  const isToday = isoDate(day) === isoDate(now);
  const slots: string[] = [];
  for (let h = from; h < to; h++) {
    if (isToday && h <= now.getHours() + 1) continue;
    slots.push(`${String(h).padStart(2, "0")}:00`);
  }
  return slots;
}

/* ── Телефон ─────────────────────────────────────────────── */
function phoneDigits(value: string) {
  let d = value.replace(/\D/g, "");
  if (d.startsWith("8") || d.startsWith("7")) d = d.slice(1);
  return d.slice(0, 10);
}
function formatPhone(value: string) {
  const d = phoneDigits(value);
  if (!d) return "";
  let out = "+7 (" + d.slice(0, 3);
  if (d.length >= 3) out += ") " + d.slice(3, 6);
  if (d.length >= 6) out += "-" + d.slice(6, 8);
  if (d.length >= 8) out += "-" + d.slice(8, 10);
  return out;
}

const unlockScroll = () => document.documentElement.classList.remove("menu-open");

const STEPS = ["Направление", "Врач", "Дата и время", "Контакты"] as const;

type Form = {
  service: string;
  doctor: string;
  date: string;
  time: string;
  name: string;
  phone: string;
  comment: string;
  consent: boolean;
};
const emptyForm: Form = {
  service: "",
  doctor: "",
  date: "",
  time: "",
  name: "",
  phone: "",
  comment: "",
  consent: false,
};

export function BookingDialog() {
  const dialog = useRef<HTMLDialogElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<Form>(emptyForm);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [touched, setTouched] = useState(false);
  const titleId = useId();
  const days = useMemo(() => upcomingDays(), []);

  const set = <K extends keyof Form>(key: K, value: Form[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  useEffect(() => {
    const onOpen = (event: Event) => {
      const { service, doctor } =
        (event as CustomEvent<{ service?: string; doctor?: string }>).detail ?? {};
      setForm({ ...emptyForm, service: service ?? "", doctor: doctor ?? "" });
      // Пропускаем уже заполненные шаги: услуга → врач → дата.
      setStep(service ? (doctor ? 2 : 1) : 0);
      setStatus("idle");
      setTouched(false);
      dialog.current?.showModal();
      document.documentElement.classList.add("menu-open");
    };
    // Блокировку прокрутки снимаем при любом закрытии. cancel приходит
    // синхронно по Esc, а close может задержаться (в скрытой вкладке Chromium
    // вообще не присылает его до отрисовки) — поэтому слушаем оба.
    const el = dialog.current;
    window.addEventListener(OPEN_EVENT, onOpen);
    el?.addEventListener("cancel", unlockScroll);
    el?.addEventListener("close", unlockScroll);
    return () => {
      window.removeEventListener(OPEN_EVENT, onOpen);
      el?.removeEventListener("cancel", unlockScroll);
      el?.removeEventListener("close", unlockScroll);
      unlockScroll();
    };
  }, []);

  // Новый шаг — прокрутка наверх и фокус на заголовок шага для скринридеров.
  useEffect(() => {
    body.current?.scrollTo({ top: 0 });
    body.current?.querySelector<HTMLElement>("[data-step-title]")?.focus();
  }, [step, status]);

  const close = () => {
    dialog.current?.close();
    unlockScroll();
  };

  const selectedDay = days.find((d) => isoDate(d) === form.date);
  const slots = selectedDay ? slotsFor(selectedDay) : [];
  const phoneOk = phoneDigits(form.phone).length === 10;
  const nameOk = form.name.trim().length >= 2;

  const canNext = [
    Boolean(form.service),
    Boolean(form.doctor),
    Boolean(form.date && form.time),
    nameOk && phoneOk && form.consent,
  ][step];

  const submit = async () => {
    setTouched(true);
    if (!canNext) return;
    setStatus("sending");
    const payload = {
      service: form.service,
      doctor: bookingDoctors.find((d) => d.id === form.doctor)?.name ?? "",
      date: form.date,
      time: form.time,
      name: form.name.trim(),
      phone: "+7" + phoneDigits(form.phone),
      comment: form.comment.trim(),
    };
    try {
      if (bookingEndpoint) {
        const r = await fetch(bookingEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!r.ok) throw new Error(String(r.status));
      } else {
        await new Promise((r) => setTimeout(r, 700));
      }
      setStatus("done");
    } catch {
      setStatus("error");
    }
  };

  const next = () => {
    if (step === STEPS.length - 1) return void submit();
    setTouched(false);
    if (canNext) setStep(step + 1);
  };

  const doctorName = bookingDoctors.find((d) => d.id === form.doctor)?.name;

  return (
    <dialog
      ref={dialog}
      className="booking"
      aria-labelledby={titleId}
      onClick={(e) => {
        if (e.target === dialog.current) close();
      }}
    >
      <div className="booking-panel">
        <header className="booking-head">
          <div>
            <p className="booking-kicker">
              <Icon name="calendar" size={16} /> Онлайн-запись
            </p>
            <h2 id={titleId} className="booking-title">
              {status === "done" ? "Заявка принята" : STEPS[step]}
            </h2>
          </div>
          <button type="button" className="icon-btn" onClick={close} aria-label="Закрыть запись">
            <Icon name="close" size={20} />
          </button>
        </header>

        {status !== "done" && (
          <ol className="booking-progress" aria-label="Шаги записи">
            {STEPS.map((label, i) => (
              <li
                key={label}
                className={i < step ? "is-done" : i === step ? "is-current" : undefined}
                aria-current={i === step ? "step" : undefined}
              >
                <span>{label}</span>
              </li>
            ))}
          </ol>
        )}

        <div className="booking-body" ref={body}>
          {status === "done" ? (
            <div className="booking-done">
              <span className="booking-done-icon" aria-hidden="true">
                <Icon name="check" size={34} strokeWidth={2} />
              </span>
              <p tabIndex={-1} data-step-title className="booking-done-lead">
                {form.name.trim()}, спасибо! Администратор перезвонит на&nbsp;
                {formatPhone(form.phone)} и&nbsp;подтвердит время.
              </p>
              <dl className="booking-summary">
                <div><dt>Направление</dt><dd>{form.service}</dd></div>
                <div><dt>Врач</dt><dd>{doctorName}</dd></div>
                <div>
                  <dt>Желаемое время</dt>
                  <dd>{selectedDay && fullDate.format(selectedDay)}, {form.time}</dd>
                </div>
              </dl>
              {isDemo && !bookingEndpoint && (
                <p className="booking-demo-note">
                  Это демонстрация: в демо-версии заявка никуда не отправляется.
                  На рабочем сайте она сразу приходит администратору в&nbsp;Telegram.
                </p>
              )}
              <button type="button" className="btn btn-dark" onClick={close}>
                Готово
                <span className="btn-icon" aria-hidden="true"><Icon name="check" size={20} /></span>
              </button>
            </div>
          ) : (
            <>
              <p className="sr-only" tabIndex={-1} data-step-title>
                Шаг {step + 1} из {STEPS.length}: {STEPS[step]}
              </p>

              {step === 0 && (
                <fieldset className="booking-fieldset">
                  <legend className="booking-legend">Что вас беспокоит или что нужно сделать?</legend>
                  <div className="choice-grid">
                    {serviceOptions.map((title) => (
                      <label key={title} className="choice">
                        <input
                          type="radio"
                          name="service"
                          value={title}
                          checked={form.service === title}
                          onChange={() => set("service", title)}
                        />
                        <span>{title}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              )}

              {step === 1 && (
                <fieldset className="booking-fieldset">
                  <legend className="booking-legend">К кому записаться?</legend>
                  <div className="choice-list">
                    {bookingDoctors.map((d) => (
                      <label key={d.id} className="choice choice--row">
                        <input
                          type="radio"
                          name="doctor"
                          value={d.id}
                          checked={form.doctor === d.id}
                          onChange={() => set("doctor", d.id)}
                        />
                        <span>
                          <strong>{d.name}</strong>
                          <small>{d.note}</small>
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              )}

              {step === 2 && (
                <>
                  <fieldset className="booking-fieldset">
                    <legend className="booking-legend">Удобный день</legend>
                    <div className="day-strip">
                      {days.map((d, i) => {
                        const value = isoDate(d);
                        const free = slotsFor(d).length > 0;
                        const label = i === 0 ? "сегодня" : i === 1 ? "завтра" : weekday.format(d);
                        return (
                          <label key={value} className={`day${free ? "" : " is-off"}`}>
                            <input
                              type="radio"
                              name="date"
                              value={value}
                              disabled={!free}
                              checked={form.date === value}
                              onChange={() => setForm((f) => ({ ...f, date: value, time: "" }))}
                            />
                            <span className="day-week">{label}</span>
                            <span className="day-num">{dayMonth.format(d).replace(".", "")}</span>
                          </label>
                        );
                      })}
                    </div>
                  </fieldset>
                  <fieldset className="booking-fieldset" disabled={!form.date}>
                    <legend className="booking-legend">Удобное время</legend>
                    {form.date ? (
                      <div className="time-grid">
                        {slots.map((t) => (
                          <label key={t} className="choice choice--time">
                            <input
                              type="radio"
                              name="time"
                              value={t}
                              checked={form.time === t}
                              onChange={() => set("time", t)}
                            />
                            <span>{t}</span>
                          </label>
                        ))}
                      </div>
                    ) : (
                      <p className="booking-hint">Сначала выберите день.</p>
                    )}
                  </fieldset>
                  <p className="booking-hint">
                    Это пожелание: администратор перезвонит, проверит расписание
                    врача и подтвердит время.
                  </p>
                </>
              )}

              {step === 3 && (
                <div className="booking-fields">
                  <label className="field">
                    <span>Как к вам обращаться</span>
                    <input
                      type="text"
                      autoComplete="given-name"
                      value={form.name}
                      onChange={(e) => set("name", e.target.value)}
                      aria-invalid={touched && !nameOk}
                      placeholder="Имя"
                    />
                    {touched && !nameOk && <em className="field-error">Укажите имя</em>}
                  </label>
                  <label className="field">
                    <span>Телефон</span>
                    <input
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      value={form.phone}
                      onChange={(e) => set("phone", formatPhone(e.target.value))}
                      aria-invalid={touched && !phoneOk}
                      placeholder="+7 (___) ___-__-__"
                    />
                    {touched && !phoneOk && <em className="field-error">Нужен номер из 10 цифр после +7</em>}
                  </label>
                  <label className="field">
                    <span>Комментарий <small>— необязательно</small></span>
                    <textarea
                      rows={3}
                      value={form.comment}
                      onChange={(e) => set("comment", e.target.value)}
                      placeholder="Например: болит зуб слева, удобнее после 17:00"
                    />
                  </label>
                  <label className="consent">
                    <input
                      type="checkbox"
                      checked={form.consent}
                      onChange={(e) => set("consent", e.target.checked)}
                      aria-invalid={touched && !form.consent}
                    />
                    <span>
                      Согласен на обработку персональных данных по{" "}
                      <a href={clinic.privacyUrl} target="_blank" rel="noopener noreferrer" className="text-link">
                        политике конфиденциальности
                      </a>
                    </span>
                  </label>
                  {status === "error" && (
                    <p className="field-error" role="alert">
                      Не получилось отправить заявку. Позвоните нам:{" "}
                      <a href={clinic.phoneHref}>{clinic.phone}</a>
                    </p>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {status !== "done" && (
          <footer className="booking-foot">
            {step > 0 ? (
              <button type="button" className="icon-btn" onClick={() => setStep(step - 1)} aria-label="Назад">
                <Icon name="back" size={20} />
              </button>
            ) : (
              <a className="booking-call" href={clinic.phoneHref}>
                или позвоните<br /><b>{clinic.phone}</b>
              </a>
            )}
            <button
              type="button"
              className="btn btn-accent"
              onClick={next}
              disabled={status === "sending" || (step < STEPS.length - 1 && !canNext)}
            >
              {step === STEPS.length - 1
                ? status === "sending" ? "Отправляем…" : "Записаться"
                : "Дальше"}
              <span className="btn-icon" aria-hidden="true">
                <Icon name={step === STEPS.length - 1 ? "send" : "arrow"} size={20} />
              </span>
            </button>
          </footer>
        )}
      </div>
    </dialog>
  );
}
