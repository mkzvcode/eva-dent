"use client";

import { MorphIcon, type IconInput } from "morphicons/react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Clock,
  Crown,
  GraduationCap,
  Layers,
  Mail,
  MapPin,
  Menu,
  Microscope,
  Minus,
  Phone,
  Plus,
  Quote,
  Smile,
  Sparkles,
  Syringe,
  X,
} from "lucide";

// Стоматологические пиктограммы нарисованы на сетке 24×24, как Lucide,
// поэтому Morphicons морфит их в стрелку и обратно без подгонки.
const tooth =
  "M7.6 3.5C5.3 3.5 3.8 5.4 3.8 8C3.8 10.2 4.6 11.6 5.3 13.3C6.1 15.3 6.2 17.3 6.7 19.1C7 20.1 7.5 20.8 8.2 20.8C9.4 20.8 9.6 19.3 9.9 17.8C10.2 16.3 10.7 14.9 12 14.9C13.3 14.9 13.8 16.3 14.1 17.8C14.4 19.3 14.6 20.8 15.8 20.8C16.5 20.8 17 20.1 17.3 19.1C17.8 17.3 17.9 15.3 18.7 13.3C19.4 11.6 20.2 10.2 20.2 8C20.2 5.4 18.7 3.5 16.4 3.5C14.5 3.5 13.6 4.6 12 4.6C10.4 4.6 9.5 3.5 7.6 3.5Z";
const implant =
  "M6.5 3H17.5C18.6 3 19.2 3.9 18.9 4.9L17.8 9H6.2L5.1 4.9C4.8 3.9 5.4 3 6.5 3Z M8 12H16 M8.7 15H15.3 M9.4 18H14.6 M12 9V21.5";
const brush =
  "M2.5 17.5H13L15 15H21.5 M15 14.5V9 M18 14.5V9 M21 14.5V9";
const braces =
  "M2.5 12H21.5 M4.5 9.5H8V14.5H4.5Z M10.25 9.5H13.75V14.5H10.25Z M16 9.5H19.5V14.5H16Z";

export const icons = {
  tooth,
  implant,
  brush,
  braces,
  syringe: Syringe,
  sparkles: Sparkles,
  crown: Crown,
  smile: Smile,
  badge: BadgeCheck,
  graduation: GraduationCap,
  microscope: Microscope,
  layers: Layers,
  arrow: ArrowRight,
  diagonal: ArrowUpRight,
  down: ArrowDown,
  back: ArrowLeft,
  phone: Phone,
  pin: MapPin,
  clock: Clock,
  mail: Mail,
  menu: Menu,
  close: X,
  plus: Plus,
  minus: Minus,
  quote: Quote,
} satisfies Record<string, IconInput>;

export type IconName = keyof typeof icons;

export function Icon({
  name,
  size = 22,
  strokeWidth = 1.6,
  className,
}: {
  name: IconName;
  size?: number;
  strokeWidth?: number;
  className?: string;
}) {
  return (
    <MorphIcon
      icon={icons[name]}
      size={size}
      strokeWidth={strokeWidth}
      spring="snappy"
      reducedMotion="user"
      className={className}
    />
  );
}
