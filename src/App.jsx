import React, { useState } from "react";
import {
  Activity,
  ArrowUpRight,
  Brain,
  Check,
  ChevronDown,
  CircleHelp,
  Heart,
  RotateCcw,
  Sparkles,
} from "lucide-react";

const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:8000").replace(
  /\/$/,
  "",
);

const initialForm = {
  age: "22",
  gender: "Male",
  country: "India",
  academic_level: "Graduate",
  most_used_platform: "YouTube",
  purpose_of_use: "Entertainment",
  avg_daily_usage_hours: "2",
  daily_unlocks: "50",
  study_hours: "2",
  physical_activity_hours: "0",
  sleep_hours_per_night: "6",
  stress_level: "Medium",
};

const options = {
  gender: ["Male", "Female"],
  academic_level: ["Undergraduate", "Graduate", "High School"],
  most_used_platform: [
    "Facebook",
    "LinkedIn",
    "Instagram",
    "Snapchat",
    "Twitter",
    "YouTube",
    "TikTok",
    "LINE",
    "KakaoTalk",
    "VKontakte",
    "WhatsApp",
    "WeChat",
  ],
  purpose_of_use: ["Networking", "Education", "Entertainment", "News"],
};

function Field({
  label,
  name,
  value,
  onChange,
  type = "text",
  suffix,
  ...props
}) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <span className={suffix ? "field-input-wrap" : undefined}>
        <input
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          required
          {...props}
        />
        {suffix && <span className="input-suffix">{suffix}</span>}
      </span>
    </label>
  );
}

function SelectField({ label, name, value, onChange, choices }) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <span className="select-wrap">
        <select name={name} value={value} onChange={onChange} required>
          {choices.map((choice) => (
            <option key={choice} value={choice}>
              {choice}
            </option>
          ))}
        </select>
        <ChevronDown size={16} aria-hidden="true" />
      </span>
    </label>
  );
}

function SectionHeading({ number, title }) {
  return (
    <div className="section-heading">
      <span className="section-number">{number}</span>
      <h2>{title}</h2>
    </div>
  );
}

function App() {
  const [form, setForm] = useState(initialForm);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function submitForm(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    const payload = {
      ...form,
      age: Number(form.age),
      avg_daily_usage_hours: Number(form.avg_daily_usage_hours),
      daily_unlocks: Number(form.daily_unlocks),
      study_hours: Number(form.study_hours),
      physical_activity_hours: Number(form.physical_activity_hours),
      sleep_hours_per_night: Number(form.sleep_hours_per_night),
    };

    try {
      const response = await fetch(`${API_URL}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        const detail = body?.detail;
        const message = Array.isArray(detail)
          ? detail.map((item) => item.msg).join(", ")
          : typeof detail === "string"
            ? detail
            : `The prediction server returned an error (${response.status}).`;
        throw new Error(message);
      }

      const body = await response.json();
      const score = Number(body.predicted_mental_health_score);
      if (!Number.isFinite(score)) {
        throw new Error("The prediction server returned an invalid score.");
      }
      setResult(score);
    } catch (requestError) {
      setError(
        requestError instanceof TypeError
          ? `Could not connect to the prediction server at ${API_URL}. Check that the backend is running.`
          : requestError.message,
      );
    } finally {
      setLoading(false);
    }
  }

  const scorePercent =
    result === null ? 0 : Math.min(100, Math.max(0, (result / 10) * 100));
  const scoreTone =
    result === null ? "empty" : result >= 7.5 ? "good" : result >= 5 ? "mid" : "low";
  const scoreMessage =
    result === null
      ? "Your result will appear here"
      : result >= 7.5
        ? "A positive signal"
        : result >= 5
          ? "A mixed signal"
          : "A gentle check-in";

  function resetResult() {
    setResult(null);
    setError("");
  }

  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="#" aria-label="Mindful Signal home">
          <span className="brand-mark">
            <Brain size={19} strokeWidth={1.8} />
          </span>
          <span>mindful<span className="brand-light">signal</span></span>
        </a>
        <div className="topbar-note">
          <span className="status-dot" />
          Student well-being project
        </div>
      </header>

      <section className="intro">
        <div className="eyebrow"><Sparkles size={14} /> A MOMENT FOR YOU</div>
        <h1>Small habits.<br /><span>Big picture.</span></h1>
        <p>
          Share a little about your day and let the model explore how your
          digital habits and lifestyle connect with well-being.
        </p>
      </section>

      <section className="workspace" aria-label="Well-being prediction form">
        <form className="form-card" onSubmit={submitForm}>
          <div className="form-intro">
            <div>
              <span className="form-kicker">YOUR DAILY SNAPSHOT</span>
              <h2>A few details to get started</h2>
            </div>
            <span className="required-note">All fields required</span>
          </div>

          <section className="form-section">
            <SectionHeading number="01" title="A little about you" />
            <div className="form-grid form-grid-three">
              <Field
                label="Age"
                name="age"
                type="number"
                min="10"
                max="100"
                value={form.age}
                onChange={updateField}
              />
              <SelectField
                label="Gender"
                name="gender"
                value={form.gender}
                onChange={updateField}
                choices={options.gender}
              />
              <Field
                label="Country"
                name="country"
                value={form.country}
                onChange={updateField}
                placeholder="Type your country"
                list="country-options"
              />
              <datalist id="country-options">
                {["India", "USA", "Canada", "Australia", "UK", "Germany", "Mexico", "Turkey", "France", "Other"].map((country) => (
                  <option key={country} value={country} />
                ))}
              </datalist>
            </div>
          </section>

          <section className="form-section">
            <SectionHeading number="02" title="Academic & digital habits" />
            <div className="form-grid">
              <SelectField
                label="Academic level"
                name="academic_level"
                value={form.academic_level}
                onChange={updateField}
                choices={options.academic_level}
              />
              <SelectField
                label="Most-used platform"
                name="most_used_platform"
                value={form.most_used_platform}
                onChange={updateField}
                choices={options.most_used_platform}
              />
              <SelectField
                label="Primary purpose"
                name="purpose_of_use"
                value={form.purpose_of_use}
                onChange={updateField}
                choices={options.purpose_of_use}
              />
              <Field
                label="Avg. daily screen time"
                name="avg_daily_usage_hours"
                type="number"
                min="0"
                max="24"
                step="0.1"
                value={form.avg_daily_usage_hours}
                onChange={updateField}
                suffix="hrs"
              />
              <Field
                label="Daily phone unlocks"
                name="daily_unlocks"
                type="number"
                min="0"
                step="1"
                value={form.daily_unlocks}
                onChange={updateField}
              />
            </div>
          </section>

          <section className="form-section last-section">
            <SectionHeading number="03" title="Lifestyle & stress" />
            <div className="form-grid form-grid-three">
              <Field
                label="Study hours / day"
                name="study_hours"
                type="number"
                min="0"
                max="24"
                step="0.1"
                value={form.study_hours}
                onChange={updateField}
                suffix="hrs"
              />
              <Field
                label="Physical activity / day"
                name="physical_activity_hours"
                type="number"
                min="0"
                max="24"
                step="0.1"
                value={form.physical_activity_hours}
                onChange={updateField}
                suffix="hrs"
              />
              <Field
                label="Sleep / night"
                name="sleep_hours_per_night"
                type="number"
                min="0"
                max="24"
                step="0.1"
                value={form.sleep_hours_per_night}
                onChange={updateField}
                suffix="hrs"
              />
            </div>
            <fieldset className="stress-field">
              <legend>Perceived stress level</legend>
              <div className="stress-options">
                {["Low", "Medium", "High", "Very High"].map((level) => (
                  <button
                    className={`stress-option ${form.stress_level === level ? "selected" : ""}`}
                    type="button"
                    key={level}
                    aria-pressed={form.stress_level === level}
                    onClick={() =>
                      setForm((current) => ({ ...current, stress_level: level }))
                    }
                  >
                    {form.stress_level === level && <Check size={14} />}
                    {level}
                  </button>
                ))}
              </div>
            </fieldset>
          </section>

          {error && (
            <div className="error-message" role="alert">
              <CircleHelp size={17} />
              <span>{error}</span>
            </div>
          )}

          <div className="form-actions">
            <button className="submit-button" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner" /> Reading your signal…
                </>
              ) : (
                <>
                  Read my signal <ArrowUpRight size={17} />
                </>
              )}
            </button>
            <span className="form-footnote"><Heart size={13} /> Just for reflection, not a diagnosis.</span>
          </div>
        </form>

        <aside className="result-card" aria-live="polite">
          <div className="result-topline">
            <span className="result-icon"><Activity size={17} /></span>
            <span>YOUR WELL-BEING SIGNAL</span>
            <span className="result-live"><span className="status-dot" /> LIVE</span>
          </div>

          <div className={`result-content ${loading ? "is-loading" : ""}`}>
            {result === null ? (
              <>
                <div className="score-orbit" aria-hidden="true">
                  <span className="orbit-dot" />
                  <span className="orbit-core"><Brain size={27} /></span>
                </div>
                <h2>{loading ? "Reading the signal…" : scoreMessage}</h2>
                <p>
                  {loading
                    ? "Running your habits through the model."
                    : "Fill in your snapshot and submit to get a model-estimated score from 0 to 10."}
                </p>
              </>
            ) : (
              <>
                <div className={`score-ring ${scoreTone}`} style={{ "--score": `${scorePercent}%` }}>
                  <div className="score-ring-inner">
                    <span className="score-number">{result.toFixed(2)}</span>
                    <span className="score-out-of">/ 10</span>
                  </div>
                </div>
                <span className={`result-badge ${scoreTone}`}>
                  <span className="status-dot" />
                  {scoreMessage}
                </span>
                <h2>Your signal, at a glance</h2>
                <p>
                  This is the model’s estimate from the habits you shared. It
                  isn’t a clinical assessment.
                </p>
                <button className="reset-button" type="button" onClick={resetResult}>
                  <RotateCcw size={14} /> Run another read
                </button>
              </>
            )}
          </div>

          <div className="result-bottom">
            <span className="bottom-icon"><Heart size={16} /></span>
            <span>Take what feels useful. Leave the rest.</span>
          </div>
        </aside>
      </section>

      <footer className="page-footer">
        <span>Made for a more mindful relationship with your digital day.</span>
        <span className="footer-privacy"><CircleHelp size={14} /> Your answers are only used to generate this estimate.</span>
      </footer>
    </main>
  );
}

export default App;
