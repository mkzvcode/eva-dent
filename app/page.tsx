import {
  advantages,
  clinic,
  firstVisitPrice,
  lead,
  pricesDate,
  reviews,
  services,
  stats,
  steps,
  team,
  yandexMapsUrl,
  yandexWidgetUrl,
} from "./content";
import { Icon } from "./icons";
import {
  Faq,
  MobileBar,
  MorphLink,
  RevealObserver,
  ReviewsTrack,
  ServiceCard,
  SiteHeader,
} from "./interactive";
import { buildSchema } from "./schema";

const dateFormat = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

function SectionHead({
  id,
  num,
  title,
  tone = "light",
}: {
  id: string;
  num: string;
  title: string;
  tone?: "light" | "dark";
}) {
  return (
    <div className={`section-head section-head--${tone}`}>
      <h2 id={id}>{title}</h2>
      <span className="section-num" aria-hidden="true">
        ({num})
      </span>
    </div>
  );
}

function Ticker() {
  const words = services.map((s) => s.title);
  const row = (
    <span className="ticker-row">
      {words.map((w) => (
        <span key={w}>
          {w}
          <i>✦</i>
        </span>
      ))}
    </span>
  );
  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker-line">
        <div className="ticker-track">
          {row}
          {row}
        </div>
      </div>
      <div className="ticker-line ticker-echo">
        <div className="ticker-track">
          {row}
          {row}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const initials = (surname: string, name: string) =>
    surname[0] + name.split(" ")[0][0];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildSchema()) }}
      />
      <SiteHeader />
      <RevealObserver />

      <main id="content">
        {/* 01 — первый экран */}
        <section className="hero" id="top" aria-labelledby="hero-title">
          <div className="container">
            <dl className="hero-meta">
              <div>
                <dt>Стоматология</dt>
                <dd>{clinic.city}</dd>
              </div>
              <div>
                <dt>Адрес</dt>
                <dd>{clinic.streetShort}</dd>
              </div>
              <div>
                <dt>Первичный приём</dt>
                <dd>{firstVisitPrice}</dd>
              </div>
              <div>
                <dt>Открыты</dt>
                <dd>7 дней в неделю</dd>
              </div>
            </dl>

            <h1 id="hero-title" className="hero-title">
              <span className="hero-line hero-line--indent">Честная</span>{" "}
              <span className="hero-line">стоматология</span>
              <span className="sr-only"> в Копейске</span>
            </h1>

            <div className="hero-grid">
              <div className="hero-aside">
                <p className="hero-city" aria-hidden="true">
                  в Копейске —<br />
                  по доступным ценам
                </p>
                <div className="pill-stack">
                  <span className="tag-pill">{lead.role}</span>
                  <span className="tag-pill">Евгения Леготина</span>
                </div>
              </div>

              <div className="hero-center">
                <a className="round-cta" href={clinic.phoneHref}>
                  <svg viewBox="0 0 200 200" aria-hidden="true" className="round-cta-text">
                    <defs>
                      <path id="cta-circle" d="M100 100m-78 0a78 78 0 1 1 156 0a78 78 0 1 1-156 0" />
                    </defs>
                    <text>
                      <textPath href="#cta-circle" textLength="486" lengthAdjust="spacing">
                        записаться на приём • записаться на приём •
                      </textPath>
                    </text>
                  </svg>
                  <span className="round-cta-icon">
                    <Icon name="phone" size={28} strokeWidth={1.5} />
                  </span>
                  <span className="sr-only">Позвонить и записаться на приём</span>
                </a>
                <p className="hero-lead">
                  Лечим, восстанавливаем и бережём зубы. Сначала
                  выясняем причину проблемы — потом лечим, чтобы результат
                  держался долго.
                </p>
                <div className="hero-actions">
                  <MorphLink href={clinic.phoneHref} className="btn btn-dark" icon="phone">
                    {clinic.phone}
                  </MorphLink>
                  <MorphLink href="#services" className="btn btn-ghost" icon="down" hoverIcon="arrow">
                    Услуги и цены
                  </MorphLink>
                </div>
              </div>

              <figure className="photo-card hero-photo-sm">
                <img
                  src="/images/cabinet.webp"
                  alt="Светлый стоматологический кабинет клиники Ева Дент"
                  width={1024}
                  height={683}
                  decoding="async"
                />
              </figure>
              <figure className="photo-card hero-photo-lg">
                <img
                  src="/images/care.webp"
                  alt="Врач показывает маленькому пациенту, как правильно чистить зубы"
                  width={1024}
                  height={682}
                  fetchPriority="high"
                  decoding="async"
                />
                <figcaption>Объясняем, а не просто лечим</figcaption>
              </figure>
            </div>
          </div>
        </section>

        <Ticker />

        {/* 02 — о клинике */}
        <section className="about" id="about" aria-labelledby="about-title">
          <div className="container">
            <SectionHead id="about-title" num="02" title="О клинике" />

            <dl className="stats" data-reveal>
              {stats.map((s) => (
                <div key={s.label}>
                  <dt>{s.label}</dt>
                  <dd>{s.value}</dd>
                </div>
              ))}
            </dl>

            <div className="about-grid">
              <div className="about-copy" data-reveal>
                <p className="about-statement">
                  Мы лечим не отдельный зуб, а&nbsp;причину. Сначала выявляем,
                  откуда проблема, затем воздействуем на&nbsp;неё — поэтому
                  эффект от&nbsp;лечения сохраняется надолго.
                </p>
                <p className="about-note">
                  Приветливый персонал, уютная зона ожидания и&nbsp;просторные
                  светлые кабинеты. Всё необходимое лечение
                  и&nbsp;протезирование — в&nbsp;одном месте.
                </p>
                <ul className="advantages">
                  {advantages.map((a) => (
                    <li key={a.title}>
                      <span className="adv-icon" aria-hidden="true">
                        <Icon name={a.icon} size={26} strokeWidth={1.4} />
                      </span>
                      <div>
                        <h3>{a.title}</h3>
                        <p>{a.text}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="collage" data-reveal>
                <figure className="photo-card collage-a">
                  <img
                    src="/images/entrance.webp"
                    alt="Вход в стоматологию Ева Дент на улице Калинина, 16"
                    width={1100}
                    height={825}
                    loading="lazy"
                    decoding="async"
                  />
                  <figcaption>Главный вход</figcaption>
                </figure>
                <figure className="photo-card collage-b">
                  <img
                    src="/images/reception.webp"
                    alt="Зона ожидания с мягкими креслами и стойкой администратора"
                    width={1024}
                    height={683}
                    loading="lazy"
                    decoding="async"
                  />
                  <figcaption>Зона ожидания</figcaption>
                </figure>
                <div className="collage-note">
                  <span>{clinic.city}</span>
                  <strong>{clinic.street}</strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 03 — услуги */}
        <section className="services" id="services" aria-labelledby="services-title">
          <div className="container">
            <SectionHead id="services-title" num="03" title="Услуги" tone="dark" />
            <p className="services-display" aria-hidden="true">
              <span>Всё для здоровых</span>
              <span>зубов — в одном месте</span>
            </p>

            <div className="services-layout">
              <aside className="services-aside">
                <p className="price-pill">
                  <span>Первичный приём</span>
                  <strong>{firstVisitPrice}</strong>
                </p>
                <p className="services-hint">
                  Осмотр и консультация. Врач составит план и назовёт
                  итоговую стоимость после осмотра.
                </p>
                <MorphLink
                  href={clinic.pricesUrl}
                  className="btn btn-light"
                  external
                >
                  Полный прайс
                </MorphLink>
              </aside>

              <ul className="service-grid">
                {services.map((service, i) => (
                  <li key={service.title} data-reveal>
                    <ServiceCard index={i} {...service} />
                  </li>
                ))}
              </ul>
            </div>
            <p className="price-disclaimer">
              Цены указаны по прайсу на сайте клиники на {pricesDate} и не
              являются публичной офертой. Стоимость уточняйте у администратора.
            </p>
          </div>
        </section>

        {/* 04 — маршрут лечения */}
        <section className="process" id="process" aria-labelledby="process-title">
          <div className="container">
            <SectionHead id="process-title" num="04" title="Как проходит лечение" />
            <ol className="steps">
              {steps.map((step, i) => (
                <li key={step.title} className="step" data-reveal>
                  <span className="step-num" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="step-tag">{step.tag}</span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* 05 — врачи */}
        <section className="team" id="team" aria-labelledby="team-title">
          <div className="container">
            <SectionHead id="team-title" num="05" title="Врачи" />
            <div className="team-grid">
              <figure className="lead-photo" data-reveal>
                <img
                  src="/images/legotina.webp"
                  alt="Евгения Леонидовна Леготина, главный врач клиники Ева Дент"
                  width={880}
                  height={1307}
                  loading="lazy"
                  decoding="async"
                />
                <figcaption className="lead-badge">{lead.role}</figcaption>
              </figure>

              <div className="lead-info" data-reveal>
                <h3 className="lead-name">
                  {lead.surname}
                  <span>{lead.name}</span>
                </h3>
                <ul className="lead-roles">
                  {lead.specialties.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
                <blockquote className="lead-quote">
                  <p>«{lead.quote}»</p>
                </blockquote>
                <p className="lead-note">
                  Руководитель и учредитель клиники. По вторникам с&nbsp;14:00
                  до&nbsp;15:00 принимает пациентов по вопросам качества
                  медицинской помощи — по предварительной записи.
                </p>

                <ul className="team-list">
                  {team.map((person) => (
                    <li key={person.surname}>
                      <span className="monogram" aria-hidden="true">
                        {initials(person.surname, person.name)}
                      </span>
                      <div>
                        <h3>
                          {person.surname} {person.name}
                        </h3>
                        <p>{person.role}</p>
                      </div>
                      <span className="team-when">по записи</span>
                    </li>
                  ))}
                </ul>
                <MorphLink href={clinic.specialistsUrl} className="btn btn-ghost" external>
                  Сертификаты специалистов
                </MorphLink>
              </div>
            </div>
          </div>
        </section>

        {/* 06 — отзывы */}
        <section className="reviews" id="reviews" aria-labelledby="reviews-title">
          <div className="container">
            <SectionHead id="reviews-title" num="06" title="Отзывы" />
            <p className="reviews-intro">
              Отзывы пациентов, опубликованные на&nbsp;сайте клиники.{" "}
              <a href={clinic.reviewsUrl} target="_blank" rel="noopener noreferrer" className="text-link">
                Читать все ↗
              </a>
            </p>
          </div>
          <ReviewsTrack>
            {reviews.map((review) => (
              <li key={review.author + review.date}>
                <figure className="review-card">
                  <span className="review-quote" aria-hidden="true">
                    <Icon name="quote" size={30} strokeWidth={1.4} />
                  </span>
                  <blockquote>
                    <p>{review.text}</p>
                  </blockquote>
                  <figcaption>
                    <cite>{review.author}</cite>
                    <time dateTime={review.date}>
                      {dateFormat.format(new Date(review.date)).replace(" г.", "")}
                    </time>
                  </figcaption>
                </figure>
              </li>
            ))}
          </ReviewsTrack>
        </section>

        {/* 07 — вопросы */}
        <section className="faq" id="faq" aria-labelledby="faq-title">
          <div className="container">
            <SectionHead id="faq-title" num="07" title="Вопросы" />
            <div className="faq-grid">
              <div className="faq-aside">
                <p className="faq-big">
                  Можно спросить.
                  <span>Даже если вопрос кажется простым.</span>
                </p>
                <a className="text-link" href={clinic.phoneHref}>
                  Позвонить администратору
                </a>
              </div>
              <Faq />
            </div>
          </div>
        </section>

        {/* 08 — контакты */}
        <section className="contacts" id="contacts" aria-labelledby="contacts-title">
          <div className="container">
            <img
              className="wave-word"
              src="/images/smile-wave.svg"
              alt=""
              aria-hidden="true"
              width={5995}
              height={2332}
              loading="lazy"
            />
            <SectionHead id="contacts-title" num="08" title="Запись и контакты" />
            <div className="contacts-grid">
              <address className="contact-card">
                <a className="contact-phone" href={clinic.phoneHref}>
                  {clinic.phone}
                </a>
                <ul className="contact-list">
                  <li>
                    <Icon name="pin" size={20} />
                    <span>
                      {clinic.postalCode}, {clinic.city},<br />
                      {clinic.street}
                    </span>
                  </li>
                  <li>
                    <Icon name="clock" size={20} />
                    <span>
                      {clinic.hours.map((h) => (
                        <span key={h.days} className="hours-row">
                          <b>{h.days}</b> {h.time}
                        </span>
                      ))}
                    </span>
                  </li>
                  <li>
                    <Icon name="mail" size={20} />
                    <a href={`mailto:${clinic.email}`}>{clinic.email}</a>
                  </li>
                </ul>
                <div className="contact-actions">
                  <MorphLink href={clinic.phoneHref} className="btn btn-accent" icon="phone">
                    Позвонить и записаться
                  </MorphLink>
                  <MorphLink href={yandexMapsUrl} className="btn btn-ghost" icon="pin" external>
                    Яндекс Карты
                  </MorphLink>
                  <MorphLink href={clinic.gisUrl} className="btn btn-ghost" icon="pin" external>
                    2ГИС
                  </MorphLink>
                </div>
              </address>
              <div className="map-card">
                <iframe
                  src={yandexWidgetUrl}
                  title="Ева Дент на карте: Копейск, улица Калинина, 16"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
                {/* Фирменная метка вместо стандартного красного пина Яндекса:
                    у виджета нет своего pt, поэтому это единственная метка. */}
                <div className="map-pin" aria-hidden="true">
                  <span className="map-pin-pulse" />
                  <span className="map-pin-badge">
                    <Icon name="pin" size={20} strokeWidth={1.8} />
                  </span>
                  <span className="map-pin-tail" />
                </div>
                <p className="map-pin-label" aria-hidden="true">
                  <strong>{clinic.name}</strong>
                  <span>
                    {clinic.city}, {clinic.street}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container">
          <p className="warning">
            Имеются противопоказания. Необходима консультация специалиста.
          </p>
          <div className="footer-grid">
            <a className="logo-pill logo-pill--light" href="#top">
              ева<span>дент</span>
            </a>
            <p className="footer-legal">
              {clinic.legalName}
              <br />
              ИНН {clinic.inn} · КПП {clinic.kpp}
              <br />
              ОГРН {clinic.ogrn}
            </p>
            <ul className="footer-links">
              <li>
                <a href={clinic.documentsUrl} target="_blank" rel="noopener noreferrer">
                  Документы клиники ↗
                </a>
              </li>
              <li>
                <a href={clinic.privacyUrl} target="_blank" rel="noopener noreferrer">
                  Политика конфиденциальности ↗
                </a>
              </li>
              <li>
                <a href={clinic.site} target="_blank" rel="noopener noreferrer">
                  Официальный сайт клиники ↗
                </a>
              </li>
            </ul>
            <a href="#top" className="icon-btn icon-btn--light" aria-label="Наверх">
              <Icon name="down" size={20} className="flip-up" />
            </a>
          </div>
        </div>
      </footer>
      <MobileBar routeHref={yandexMapsUrl} />
    </>
  );
}
