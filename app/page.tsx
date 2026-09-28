"use client";

import { useEffect, useRef, useState } from "react";
import { MorphIcon } from "morphicons/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const paths = {
  arrow: "M4 12H20M13 5L20 12L13 19",
  diagonal: "M5 19L19 5M5 5H19V19",
  down: "M12 4V20M5 13L12 20L19 13",
  back: "M20 12H4M11 5L4 12L11 19",
  menu: "M3 8H21M3 16H21",
  close: "M6 6L18 18M6 18L18 6",
  plus: "M4 12H20M12 4V20",
  minus: "M4 12H20",
};
function Icon({
  name = "diagonal",
  size = 22,
}: {
  name?: keyof typeof paths;
  size?: number;
}) {
  return (
    <MorphIcon
      icon={paths[name]}
      size={size}
      strokeWidth={1.4}
      reducedMotion="user"
    />
  );
}
function Action({
  children = "Записаться на приём",
  href = "#contacts",
  className = "",
}: {
  children?: React.ReactNode;
  href?: string;
  className?: string;
}) {
  const [active, setActive] = useState(false);
  return (
    <a
      className={`action ${className}`}
      href={href}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
    >
      {children}
      <span>
        <Icon name={active ? "arrow" : "diagonal"} />
      </span>
    </a>
  );
}
const services = [
  {
    title: "Лечение зубов",
    short: "Лечение",
    text: "Начинаем с диагностики. Обсудим причину боли, состояние зубов и последовательность лечения.",
    tag: "СОХРАНИТЬ ЗДОРОВЬЕ",
  },
  {
    title: "Имплантация",
    short: "Имплантация",
    text: "Восстановление утраченных зубов. Врач оценит показания и составит индивидуальный план.",
    tag: "ВЕРНУТЬ ПРИВЫЧНЫЙ КОМФОРТ",
  },
  {
    title: "Эстетика улыбки",
    short: "Эстетика",
    text: "Обсудим форму и внешний вид зубов. Подберём подходящий способ реставрации на консультации.",
    tag: "УЛЫБАТЬСЯ СВОБОДНО",
  },
  {
    title: "Протезирование",
    short: "Протезирование",
    text: "Помогаем восстановить функцию и внешний вид зубов с помощью подходящей ортопедической конструкции.",
    tag: "ВОССТАНОВИТЬ УЛЫБКУ",
  },
  {
    title: "Профессиональная гигиена",
    short: "Гигиена",
    text: "Забота о зубах и дёснах. Объём процедуры и рекомендации по домашнему уходу определим на осмотре.",
    tag: "ЗАБОТИТЬСЯ КАЖДЫЙ ДЕНЬ",
  },
  {
    title: "Ортодонтия",
    short: "Ортодонтия",
    text: "Исправление прикуса начинается с диагностики. Врач-ортодонт расскажет о подходящих вариантах.",
    tag: "НАЙТИ СВОЙ БАЛАНС",
  },
  {
    title: "Хирургия",
    short: "Хирургия",
    text: "Хирургический приём, обсуждение показаний и плана дальнейшего восстановления.",
    tag: "РЕШИТЬ ПРОБЛЕМУ",
  },
  {
    title: "Косметологическая стоматология",
    short: "Косметология",
    text: "Возможности процедур и показания к ним обсудим на индивидуальной консультации.",
    tag: "ВНИМАНИЕ К ДЕТАЛЯМ",
  },
];
const steps = [
  [
    "Знакомимся",
    "Вы рассказываете, что беспокоит. Мы выслушиваем и отвечаем на вопросы.",
    "ПЕРВЫЙ ПРИЁМ",
  ],
  [
    "Разбираемся",
    "Врач проводит осмотр и определяет, какая диагностика нужна.",
    "ДИАГНОСТИКА",
  ],
  [
    "Планируем",
    "Обсуждаем варианты, последовательность и стоимость лечения.",
    "ПОНЯТНЫЙ ПЛАН",
  ],
  [
    "Заботимся",
    "Проводим лечение и объясняем, как поддерживать результат дома.",
    "ЛЕЧЕНИЕ И УХОД",
  ],
];
const doctors = [
  [
    "Леготина",
    "Евгения Леонидовна",
    "Главный врач",
    "Стоматолог-терапевт, хирург, ортопед",
  ],
  [
    "Шмидт",
    "Андрей Эдуардович",
    "Зубной врач",
    "Приём по предварительной записи",
  ],
  [
    "Горелова",
    "Алёна Владимировна",
    "Стоматолог-ортодонт",
    "Диагностика и исправление прикуса",
  ],
];
const questions = [
  [
    "С чего начинается первый приём?",
    "Со знакомства и осмотра. Расскажите, что вас беспокоит и какого результата вы ждёте. Врач объяснит дальнейшие шаги.",
  ],
  [
    "Где узнать стоимость лечения?",
    "Цены опубликованы на действующем сайте клиники. Индивидуальный план и итоговую стоимость врач уточнит после осмотра.",
  ],
  [
    "Что делать, если я боюсь стоматолога?",
    "Скажите об этом при записи и на приёме. Мы обсудим ваши переживания, объясним каждый этап и согласуем ход лечения.",
  ],
  [
    "Как записаться?",
    "Позвоните по номеру +7 (912) 08-25-115. Администратор поможет выбрать специалиста и удобное время.",
  ],
];

export default function Home() {
  const [menu, setMenu] = useState(false);
  const [selected, setSelected] = useState(0);
  const [expanded, setExpanded] = useState("");
  const [faq, setFaq] = useState("");
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const elements = root.current?.querySelectorAll("[data-reveal]");
    if (!elements) return;
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.12 },
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenu(false);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);
  const changeService = (direction: number) =>
    setSelected((current) => (current + direction + 4) % 4);

  return (
    <main ref={root}>
      <header className="masthead" id="top">
        <a className="wordmark" href="#top" aria-label="Ева Дент — главная">
          ева<span>дент</span>
          <small>СТОМАТОЛОГИЯ / КОПЕЙСК</small>
        </a>
        <nav className="desktop-nav" aria-label="Главное меню">
          <a href="#services">
            Услуги <Icon size={15} />
          </a>
          <a href="#about">Клиника</a>
          <a href="#team">Врачи</a>
          <a href="#contacts">
            Контакты <i />
          </a>
        </nav>
        <button
          className="menu-toggle"
          onClick={() => setMenu(!menu)}
          aria-label={menu ? "Закрыть меню" : "Открыть меню"}
          aria-expanded={menu}
          aria-controls="site-menu"
        >
          <span>МЕНЮ</span>
          <Icon name={menu ? "close" : "menu"} size={30} />
        </button>
      </header>
      {menu && (
        <nav id="site-menu" className="menu-panel" aria-label="Разделы сайта">
          {[
            ["services", "Услуги"],
            ["about", "О клинике"],
            ["journey", "Как проходит лечение"],
            ["team", "Врачи"],
            ["contacts", "Контакты"],
          ].map(([id, label], i) => (
            <a key={id} href={`#${id}`} onClick={() => setMenu(false)}>
              <small>0{i + 1}</small>
              {label}
              <Icon />
            </a>
          ))}
        </nav>
      )}

      <section className="hero" aria-label="Ева Дент — забота о вашей улыбке">
        <div className="hero-stage">
          <img
            className="hero-art"
            src="/images/dental-mirror.png"
            alt="Стоматологическое зеркало с тёплым оранжевым отражением — художественный визуал"
            fetchPriority="high"
          />
          <div className="hero-rail">
            <span className="vertical-name">
              ЕВА<span>ДЕНТ</span>
            </span>
            <small>ЭСТЕТИКА. ЗДОРОВЬЕ. ВЫ.</small>
          </div>
          <div className="hero-center">
            <div className="hero-disc">
              <span className="micro">
                ВАША УЛЫБКА. <br />
                НАША ОБЩАЯ ИСТОРИЯ.
              </span>
              <h1>
                Искусство <br />
                заботиться <br />
                <em>о вашей улыбке.</em>
              </h1>
              <p>
                Стоматология, в которой <br />
                всё начинается с вас.
              </p>
              <Action />
            </div>
            <span className="orbit-marker" aria-hidden="true" />
          </div>
          <div className="hero-bottom">
            <a href="#about">
              ЛИСТАЙТЕ ВНИЗ{" "}
              <span className="circle">
                <Icon name="down" />
              </span>
            </a>
            <span>КАЛИНИНА, 16 / КОПЕЙСК</span>
          </div>
        </div>
        <aside className="service-dial" aria-label="Выбор направления лечения">
          <span className="micro dial-caption">
            У КАЖДОЙ УЛЫБКИ <br />
            СВОЙ МАРШРУТ
          </span>
          <div className="dial-rings" aria-hidden="true" />
          <button
            className="circle dial-prev"
            aria-label="Предыдущая услуга"
            onClick={() => changeService(-1)}
          >
            <Icon name="back" />
          </button>
          <div className="dial-options">
            {services.slice(0, 4).map((item, i) => (
              <button
                key={item.title}
                onClick={() => setSelected(i)}
                className={selected === i ? "selected" : ""}
                aria-pressed={selected === i}
              >
                <span className="dial-dot" />
                <span>{item.short}</span>
                <small>0{i + 1}</small>
              </button>
            ))}
          </div>
          <button
            className="circle dial-next"
            aria-label="Следующая услуга"
            onClick={() => changeService(1)}
          >
            <Icon name="arrow" />
          </button>
          <div className="dial-detail" key={selected} aria-live="polite">
            <small>{services[selected].tag}</small>
            <p>{services[selected].text}</p>
            <a href="#contacts">
              Обсудить с врачом <Icon size={18} />
            </a>
          </div>
          <div className="dial-bottom">
            <span>НАПРАВЛЕНИЕ</span>
            <b>
              0{selected + 1}
              <span> / 04</span>
            </b>
          </div>
        </aside>
      </section>

      <section className="about dark-grid" id="about">
        <div className="side-label">
          <span className="micro">01 / КЛИНИКА</span>
          <h2>
            БЛИЖЕ. <br />
            ЧЕМ <br />
            КАЖЕТСЯ.
          </h2>
          <a className="underlink" href="#contacts">
            Познакомиться <Icon size={18} />
          </a>
        </div>
        <div className="about-statement" data-reveal>
          <p>
            <span>/ ЕВА ДЕНТ</span> Мы лечим зубы. <br />И бережно относимся{" "}
            <br />к человеку <em>за улыбкой.</em>
          </p>
        </div>
        <div className="about-aside">
          <span className="micro">НАШ ПОДХОД</span>
          <p>
            Сначала выслушать. <br />
            Потом объяснить. <br />И только затем — лечить.
          </p>
          <span className="outline-number">01—04</span>
          <a href="#journey">
            Четыре шага к спокойствию <Icon size={18} />
          </a>
        </div>
        <div className="care-orbit">
          <div>
            <span className="micro">ПРОСТРАНСТВО</span>
            <p>
              В котором <br />
              вам спокойно.
            </p>
            <Icon name="down" size={32} />
          </div>
        </div>
        <div className="clinic-block" data-reveal>
          <div className="clinic-window">
            <img
              src="/images/clinic.jpg"
              alt="Кабинет стоматологии Ева Дент в Копейске"
              loading="lazy"
            />
            <span>ЗАГЛЯНИТЕ К НАМ</span>
          </div>
          <div className="clinic-caption">
            <h3>
              Знакомое место. <br />
              Внимательные люди.
            </h3>
            <a className="circle" href="#contacts" aria-label="Адрес клиники">
              <Icon />
            </a>
          </div>
        </div>
        <div className="about-material">
          <span className="material-ring" aria-hidden="true" />
          <div>
            <h3>
              Важна каждая <br />
              деталь.
            </h3>
            <p>
              Сертифицированные материалы. <br />
              Комплексный подход к лечению.
            </p>
          </div>
        </div>
      </section>

      <section className="services" id="services">
        <div className="side-label">
          <span className="micro">02 / НАПРАВЛЕНИЯ</span>
          <h2>
            ОДНА <br />
            КЛИНИКА. <br />
            <em>
              ВАША <br />
              УЛЫБКА.
            </em>
          </h2>
          <p>
            От регулярной заботы <br />
            до восстановления зубов.
          </p>
          <a
            className="underlink"
            href="https://evadent74.ru/"
            target="_blank"
            rel="noreferrer"
          >
            Цены на сайте клиники <Icon size={18} />
          </a>
        </div>
        <div className="services-main">
          <div className="section-intro" data-reveal>
            <h3>
              Что нужно <br />
              <em>вашей улыбке?</em>
            </h3>
            <p>
              Выберите направление. <br />
              Детали обсудим на приёме.
            </p>
          </div>
          <Accordion
            type="single"
            collapsible
            value={expanded}
            onValueChange={setExpanded}
            className="service-list"
          >
            {services.map((item, i) => (
              <AccordionItem
                value={String(i)}
                key={item.title}
                className="service-row"
              >
                <AccordionTrigger className="service-trigger">
                  <span className="row-index">0{i + 1}</span>
                  <span>{item.title}</span>
                  <span className="round-icon">
                    <Icon
                      name={expanded === String(i) ? "minus" : "diagonal"}
                    />
                  </span>
                </AccordionTrigger>
                <AccordionContent className="service-content">
                  <p>{item.text}</p>
                  <Action />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section className="journey" id="journey">
        <div className="journey-heading">
          <span className="micro">03 / КАК ВСЁ ПРОИСХОДИТ</span>
          <h2>
            НЕ В НЕИЗВЕСТНОСТЬ. <br />
            <em>
              ПО ПОНЯТНОМУ <br />
              МАРШРУТУ.
            </em>
          </h2>
          <p>
            Шаг за шагом. <br />С ответами на ваши вопросы.
          </p>
          <span className="journey-note">
            Вы здесь <Icon name="down" size={30} />
          </span>
        </div>
        <div className="journey-track">
          <svg
            className="route-line"
            viewBox="0 0 700 940"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M480 40 C650 160 120 150 150 330 S650 430 530 650 S90 680 190 880"
              stroke="currentColor"
              strokeDasharray="5 8"
            />
          </svg>
          {steps.map(([title, text, tag], i) => (
            <article className={`step step-${i}`} key={title} data-reveal>
              <div className="step-hole" />
              <div className="step-paper">
                <span className="step-num">0{i + 1}</span>
                <h3>{title}</h3>
                <p>{text}</p>
                <small>{tag}</small>
              </div>
            </article>
          ))}
          <span className="route-finish">
            А дальше — больше поводов улыбаться.
          </span>
        </div>
      </section>

      <section className="team dark-grid" id="team">
        <div className="side-label">
          <span className="micro">04 / ЛЮДИ</span>
          <h2>
            ВАШ <br />
            ДОКТОР. <br />
            <em>
              ВАША <br />
              ОПОРА.
            </em>
          </h2>
          <a
            className="underlink"
            href="https://evadent74.ru/sertifikaty/"
            target="_blank"
            rel="noreferrer"
          >
            Сертификаты <Icon size={18} />
          </a>
        </div>
        <div className="team-main">
          <p className="team-lead" data-reveal>
            Доверие начинается <br />
            <span>со знакомства.</span>
          </p>
          {doctors.map(([surname, name, role, detail], i) => (
            <article className="doctor-row" key={surname} data-reveal>
              <span className="row-index">0{i + 1}</span>
              <div>
                <small>{role}</small>
                <h3>
                  {surname} <br />
                  <span>{name}</span>
                </h3>
                <p>{detail}</p>
              </div>
              <a
                href="#contacts"
                className="circle"
                aria-label={`Записаться: ${surname} ${name}`}
              >
                <Icon />
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="faq">
        <div className="side-label">
          <span className="micro">05 / ОТВЕТЫ</span>
          <h2>
            МОЖНО <br />
            <em>СПРОСИТЬ.</em>
          </h2>
          <p>
            Даже если вопрос <br />
            кажется простым.
          </p>
        </div>
        <Accordion
          type="single"
          collapsible
          value={faq}
          onValueChange={setFaq}
          className="faq-list"
        >
          {questions.map(([question, answer], i) => (
            <AccordionItem value={String(i)} key={question}>
              <AccordionTrigger className="faq-trigger">
                {question}
                <span className="round-icon">
                  <Icon name={faq === String(i) ? "minus" : "plus"} />
                </span>
              </AccordionTrigger>
              <AccordionContent className="faq-content">
                {answer}
                {i === 1 && (
                  <a
                    href="https://evadent74.ru/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Перейти к сайту клиники ↗
                  </a>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <section className="contacts" id="contacts">
        <div className="contact-top">
          <span className="micro">СЛЕДУЮЩИЙ ШАГ — ВАШ</span>
          <span className="micro">КОПЕЙСК / КАЛИНИНА, 16</span>
        </div>
        <div className="contact-title" data-reveal>
          <h2>
            ДАВАЙТЕ <br />
            <span>УЛЫБАТЬСЯ.</span>
          </h2>
          <a className="contact-circle" href="tel:+79120825115">
            <Icon size={42} />
            <span>
              Позвонить <br />и записаться
            </span>
          </a>
        </div>
        <div className="contact-details">
          <a href="tel:+79120825115">+7 (912) 08-25-115</a>
          <div>
            <span className="micro">ЖДЁМ ВАС</span>
            <p>
              Пн–пт: 9:00–19:00 <br />
              Сб–вс: 10:00–16:00
            </p>
          </div>
          <div>
            <span className="micro">КАК НАС НАЙТИ</span>
            <a
              href="https://yandex.ru/maps/?text=Копейск%20Калинина%2016%20Ева%20Дент"
              target="_blank"
              rel="noreferrer"
            >
              Калинина, 16, помещение 4 ↗
            </a>
            <a href="mailto:eva_dent@mail.ru">eva_dent@mail.ru</a>
          </div>
        </div>
      </section>
      <footer>
        <a className="wordmark" href="#top">
          ева<span>дент</span>
        </a>
        <p>
          ООО «Ева Дент» <br />
          ИНН 7430029981 · ОГРН 1187456012094
        </p>
        <a href="https://evadent74.ru/" target="_blank" rel="noreferrer">
          Документы клиники ↗
        </a>
        <a href="#top" className="back-top">
          НАВЕРХ <Icon />
        </a>
      </footer>
      <p className="medical-note">
        Имеются противопоказания. Необходима консультация специалиста.
      </p>
    </main>
  );
}
