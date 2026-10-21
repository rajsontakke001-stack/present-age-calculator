import { useMemo, useState } from "react";
import {
  CalendarDays,
  Calculator,
  Clock3,
  RotateCcw,
  ArrowRight,
  Cake,
  ShieldCheck,
  Orbit,
  Hourglass,
} from "lucide-react";

function localDateString(date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

function parseLocalDate(value) {
  if (!value) return null;
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function formatDate(date) {
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function dayDifference(from, to) {
  const start = Date.UTC(from.getFullYear(), from.getMonth(), from.getDate());
  const end = Date.UTC(to.getFullYear(), to.getMonth(), to.getDate());
  return Math.round((end - start) / 86400000);
}

function getAge(birthDate, today) {
  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();
  let days = today.getDate() - birthDate.getDate();

  if (days < 0) {
    months -= 1;
    const daysInPreviousMonth = new Date(
      today.getFullYear(),
      today.getMonth(),
      0
    ).getDate();
    days += daysInPreviousMonth;
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return { years, months, days };
}

// A birthday is one lap around the sun. Instead of a generic progress bar,
// we treat "today" as a point on that orbit between the last birthday and
// the next one — which drives the ring visual below.
function getBirthdayOrbit(birthDate, today) {
  const makeBirthday = (year) => {
    const month = birthDate.getMonth();
    const day = birthDate.getDate();
    // In non-leap years, treat a February 29 birthday as February 28.
    if (month === 1 && day === 29) {
      const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
      if (!leap) return new Date(year, 1, 28);
    }
    return new Date(year, month, day);
  };

  let next = makeBirthday(today.getFullYear());
  if (dayDifference(today, next) < 0) {
    next = makeBirthday(today.getFullYear() + 1);
  }
  const last = makeBirthday(next.getFullYear() - 1);

  const lapLength = dayDifference(last, next) || 365;
  const elapsed = dayDifference(last, today);
  const daysToNext = dayDifference(today, next);

  return {
    next,
    daysToNext,
    progress: Math.min(1, Math.max(0, elapsed / lapLength)),
  };
}

const RING_RADIUS = 92;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

export default function App() {
  const [dob, setDob] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const today = useMemo(() => new Date(), []);
  const todayString = localDateString(today);

  function calculate() {
    setError("");

    if (!dob) {
      setError("Please choose your date of birth to continue.");
      setResult(null);
      return;
    }

    const birthDate = parseLocalDate(dob);
    if (birthDate > today) {
      setError("Date of birth cannot be in the future.");
      setResult(null);
      return;
    }

    const age = getAge(birthDate, today);
    const orbit = getBirthdayOrbit(birthDate, today);
    setResult({
      ...age,
      birthdayName: birthDate.toLocaleDateString("en-US", { weekday: "long" }),
      totalDays: dayDifference(birthDate, today),
      orbit,
    });
  }

  function reset() {
    setDob("");
    setResult(null);
    setError("");
  }

  const progress = result ? result.orbit.progress : 0;
  const ringOffset = RING_CIRCUMFERENCE * (1 - progress);
  const markerAngle = progress * 2 * Math.PI - Math.PI / 2;
  const markerX = 110 + RING_RADIUS * Math.cos(markerAngle);
  const markerY = 110 + RING_RADIUS * Math.sin(markerAngle);

  return (
    <main className="page-shell">
      <div className="starfield" aria-hidden="true">
        {Array.from({ length: 26 }).map((_, i) => (
          <span key={i} className={`star star-${i % 6}`} />
        ))}
      </div>
      <div className="glow glow-one" aria-hidden="true" />
      <div className="glow glow-two" aria-hidden="true" />

      <div className="app-container">
        <header className="hero">
          <div className="brand-mark"><Orbit size={20} strokeWidth={2} /></div>
          <h1>Present Age</h1>
          <p className="hero-copy">
            Calculate exactly how long you've been alive — years, months
            and days, charted as one lap around the sun.
          </p>
        </header>

        <section className="console">
          <div className="console-pane form-pane">
            <div className="pane-heading">
              <CalendarDays size={18} />
              <h2>Date of birth</h2>
            </div>

            <div className={`date-field ${error ? "date-field-error" : ""}`}>
              <CalendarDays size={18} />
              <input
                id="birth-date"
                type="date"
                aria-label="Date of birth"
                value={dob}
                max={todayString}
                onChange={(event) => {
                  setDob(event.target.value);
                  setError("");
                  setResult(null);
                }}
              />
            </div>
            {error && <p className="error-text" role="alert">{error}</p>}

            <button className="calculate-button" onClick={calculate}>
              <Calculator size={18} />
              <span>Find my present age</span>
              <ArrowRight className="button-arrow" size={18} />
            </button>

            <div className="today-line">
              <Clock3 size={15} />
              <span>Today is {today.toLocaleDateString("en-US", { weekday: "long" })}, {formatDate(today)}</span>
            </div>

            <div className="privacy-note"><ShieldCheck size={14} /> Your date never leaves this browser</div>
          </div>

          <div className="console-pane ring-pane">
            <div className="ring-wrap">
              <svg viewBox="0 0 220 220" className="orbit-ring">
                <defs>
                  <linearGradient id="orbit-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#74e7ff" />
                    <stop offset="100%" stopColor="#a78bfa" />
                  </linearGradient>
                </defs>
                <circle className="ring-track" cx="110" cy="110" r={RING_RADIUS} />
                <circle
                  className="ring-progress"
                  cx="110"
                  cy="110"
                  r={RING_RADIUS}
                  style={{
                    strokeDasharray: RING_CIRCUMFERENCE,
                    strokeDashoffset: ringOffset,
                  }}
                />
                {result && (
                  <circle className="ring-marker" cx={markerX} cy={markerY} r="5.5" />
                )}
              </svg>
              <div className="ring-center">
                {result ? (
                  <>
                    <span className="ring-figure">
                      {result.years}<small>y</small> {result.months}<small>m</small> {result.days}<small>d</small>
                    </span>
                    <span className="ring-caption">alive, right now</span>
                  </>
                ) : (
                  <>
                    <Orbit size={24} />
                    <span className="ring-caption">Your orbit will appear here</span>
                  </>
                )}
              </div>
            </div>
            <p className="ring-footline">
              {result
                ? result.orbit.daysToNext === 0
                  ? "Today is the birthday — the orbit just completed."
                  : `${Math.round(progress * 100)}% through this trip around the sun`
                : "Pick a date and calculate to trace the current lap"}
            </p>
          </div>
        </section>

        {result && (
          <section className="fact-strip" aria-live="polite">
            <div className="fact-chip">
              <Hourglass size={17} />
              <div>
                <strong>{result.totalDays.toLocaleString("en-IN")} days</strong>
                <span>lived so far</span>
              </div>
            </div>
            <div className="fact-chip">
              <Cake size={17} />
              <div>
                <strong>{result.orbit.daysToNext === 0 ? "Today!" : `${result.orbit.daysToNext} days`}</strong>
                <span>until {formatDate(result.orbit.next)}</span>
              </div>
            </div>
            <div className="fact-chip">
              <CalendarDays size={17} />
              <div>
                <strong>{result.birthdayName}</strong>
                <span>born {formatDate(parseLocalDate(dob))}</span>
              </div>
            </div>
            <button className="reset-button" onClick={reset}><RotateCcw size={14} /> Start over</button>
          </section>
        )}

        <footer className="footer">
          <span>Present Age Calculator</span>
          <span className="footer-dot" aria-hidden="true">·</span>
          <span>Calculated from calendar dates, not rounded averages</span>
        </footer>
      </div>
    </main>
  );
}
