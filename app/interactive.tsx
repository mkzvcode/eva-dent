"use client";

import { useEffect, useRef, useState } from "react";
import { clinic, faq, nav, type ServiceIcon } from "./content";
import { Icon, type IconName } from "./icons";

/* Ссылка-кнопка: при наведении и фокусе иконка морфится в другую. */
export function MorphLink({
  href,
  children,
  className = "btn",
  icon = "diagonal",
  hoverIcon = "arrow",
  external = false,
  ariaLabel,
}: {
  href: string;
  children?: React.ReactNode;
  className?: string;
  icon?: IconName;
  hoverIcon?: IconName;
  external?: boolean;
  ariaLabel?: string;
}) {
  const [on, setOn] = useState(false);
  return (
    <a
      href={href}
      className={className}
      aria-label={ariaLabel}
      onPointerEnter={() => setOn(true)}
      onPointerLeave={() => setOn(false)}
      onFocus={() => setOn(true)}
      onBlur={() => setOn(false)}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
      <span className="btn-icon" aria-hidden="true">
        <Icon name={on ? hoverIcon : icon} size={20} />
      </span>
    </a>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const sections = nav
      .map(({ id }) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    const visible = new Set<string>();
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        });
        setActive(nav.find(({ id }) => visible.has(id))?.id ?? "");
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((section) => spy.observe(section));
    return () => {
      window.removeEventListener("scroll", onScroll);
      spy.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.documentElement.classList.add("menu-open");
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.classList.remove("menu-open");
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header className={`site-header${scrolled ? " is-scrolled" : ""}`}>
      <a className="skip-link" href="#content">
        Перейти к содержанию
      </a>
      <div className="header-inner">
        <a className="logo-pill" href="#top" aria-label="Ева Дент — наверх">
          ева<span>дент</span>
        </a>
        <nav className="pill-nav" aria-label="Разделы сайта">
          <ul>
            {nav.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={active === item.id ? "is-active" : undefined}
                  aria-current={active === item.id ? "location" : undefined}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <a className="header-phone" href={clinic.phoneHref}>
          {clinic.phone}
        </a>
        <MorphLink
          href={clinic.phoneHref}
          className="btn btn-accent header-cta"
          icon="phone"
          hoverIcon="diagonal"
        >
          Записаться
        </MorphLink>
        <a
          className="icon-btn header-call"
          href={clinic.phoneHref}
          aria-label={`Позвонить: ${clinic.phone}`}
        >
          <Icon name="phone" size={20} />
        </a>
        <button
          type="button"
          className="icon-btn menu-btn"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Закрыть меню" : "Открыть меню"}
          onClick={() => setOpen((value) => !value)}
        >
          <Icon name={open ? "close" : "menu"} size={22} />
        </button>
      </div>
      <div
        id="mobile-menu"
        className={`mobile-menu${open ? " is-open" : ""}`}
        hidden={!open}
      >
        <nav aria-label="Меню">
          <ol>
            {nav.map((item, i) => (
              <li key={item.id}>
                <a href={`#${item.id}`} onClick={() => setOpen(false)}>
                  <small>0{i + 1}</small>
                  {item.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <div className="mobile-menu-foot">
          <a href={clinic.phoneHref} className="mobile-menu-phone">
            {clinic.phone}
          </a>
          <p>
            {clinic.hours.map((h) => (
              <span key={h.days}>
                {h.days}: {h.time}
              </span>
            ))}
          </p>
          <p>
            {clinic.city}, {clinic.streetShort}
          </p>
        </div>
      </div>
    </header>
  );
}

/* Плавное появление блоков. Прячем только то, что ниже экрана на момент
   гидрации, — без мигания и без скрытого контента, если JS не загрузился. */
export function RevealObserver() {
  useEffect(() => {
    const items = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]"),
    );
    if (!("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.remove("reveal-pending");
          observer.unobserve(entry.target);
        }),
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    items.forEach((item) => {
      if (item.getBoundingClientRect().top > window.innerHeight) {
        item.classList.add("reveal-pending");
        observer.observe(item);
      }
    });
    return () => observer.disconnect();
  }, []);
  return null;
}

/* «35 000 ₽» не должно разрываться на две строки. */
const keepTogether = (text: string) =>
  text.replace(/(\d) (?=\d)/g, "$1 ").replace(/ ₽/g, " ₽");

export function ServiceCard({
  index,
  title,
  text,
  price,
  icon,
  url,
}: {
  index: number;
  title: string;
  text: string;
  price: string;
  icon: ServiceIcon;
  url: string;
}) {
  const [on, setOn] = useState(false);
  const titleId = `service-${index + 1}-title`;
  return (
    <article
      className="service-card"
      aria-labelledby={titleId}
      onPointerEnter={() => setOn(true)}
      onPointerLeave={() => setOn(false)}
      onFocus={() => setOn(true)}
      onBlur={() => setOn(false)}
    >
      <div className="service-top">
        <span className="service-num">{String(index + 1).padStart(2, "0")}</span>
        <span className="service-icon" aria-hidden="true">
          <Icon name={on ? "diagonal" : icon} size={30} strokeWidth={1.4} />
        </span>
      </div>
      <h3 id={titleId}>{title}</h3>
      <p>{text}</p>
      <a
        className="service-link"
        href={url}
        target="_blank"
        rel="noopener noreferrer"
      >
        <span className="service-price">{keepTogether(price)}</span>
        <span className="service-more">
          Прайс<span className="sr-only">: {title} (сайт клиники)</span>
        </span>
      </a>
    </article>
  );
}

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <ul className="faq-list">
      {faq.map((item, i) => {
        const expanded = open === i;
        const panelId = `faq-panel-${i + 1}`;
        const buttonId = `faq-button-${i + 1}`;
        return (
          <li key={item.q} className={`faq-item${expanded ? " is-open" : ""}`}>
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={expanded}
                aria-controls={panelId}
                onClick={() => setOpen(expanded ? null : i)}
              >
                <span className="faq-num">{String(i + 1).padStart(2, "0")}</span>
                <span className="faq-q">{item.q}</span>
                <span className="faq-toggle" aria-hidden="true">
                  <Icon name={expanded ? "minus" : "plus"} size={20} />
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className="faq-panel"
              inert={!expanded}
            >
              <div>
                <p>{item.a}</p>
                {item.link && (
                  <a
                    href={item.link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-link"
                  >
                    {item.link.label} ↗
                  </a>
                )}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export function ReviewsTrack({ children }: { children: React.ReactNode }) {
  const track = useRef<HTMLUListElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const update = () =>
      setEdge({
        start: el.scrollLeft < 8,
        end: el.scrollLeft + el.clientWidth > el.scrollWidth - 8,
      });
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const move = (direction: number) => {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector("li");
    const step = card ? card.getBoundingClientRect().width + 20 : el.clientWidth;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: direction * step, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <div className="reviews-wrap">
      <div className="reviews-controls">
        <button
          type="button"
          className="icon-btn"
          onClick={() => move(-1)}
          disabled={edge.start}
          aria-label="Предыдущий отзыв"
        >
          <Icon name="back" size={20} />
        </button>
        <button
          type="button"
          className="icon-btn"
          onClick={() => move(1)}
          disabled={edge.end}
          aria-label="Следующий отзыв"
        >
          <Icon name="arrow" size={20} />
        </button>
      </div>
      <ul className="reviews-track" ref={track} tabIndex={0} aria-label="Отзывы пациентов">
        {children}
      </ul>
    </div>
  );
}

/* Нижняя панель на телефоне: звонок и маршрут всегда под пальцем. */
export function MobileBar({ routeHref }: { routeHref: string }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const hero = document.getElementById("top");
    const contacts = document.getElementById("contacts");
    if (!hero) return;
    let pastHero = false;
    let atContacts = false;
    const sync = () => setShow(pastHero && !atContacts);
    const heroObserver = new IntersectionObserver(([entry]) => {
      pastHero = !entry.isIntersecting;
      sync();
    });
    const contactObserver = new IntersectionObserver(
      ([entry]) => {
        atContacts = entry.isIntersecting;
        sync();
      },
      { threshold: 0.2 },
    );
    heroObserver.observe(hero);
    if (contacts) contactObserver.observe(contacts);
    return () => {
      heroObserver.disconnect();
      contactObserver.disconnect();
    };
  }, []);
  return (
    <div className={`mobile-bar${show ? " is-visible" : ""}`} aria-hidden={!show}>
      <a href={clinic.phoneHref} className="btn btn-accent" tabIndex={show ? 0 : -1}>
        <Icon name="phone" size={18} /> Позвонить
      </a>
      <a
        href={routeHref}
        className="btn btn-ghost"
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={show ? 0 : -1}
      >
        <Icon name="pin" size={18} /> Маршрут
      </a>
    </div>
  );
}
