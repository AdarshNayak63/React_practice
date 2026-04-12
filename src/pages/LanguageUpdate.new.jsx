import React, { useMemo, useState } from 'react';
import Layout from '../components/Layout';
import {
  Check,
  Languages,
  Mic2,
  MonitorSpeaker,
  Save,
  Sparkles,
  Volume2,
} from 'lucide-react';

const languages = [
  { code: 'en', name: 'English', nativeName: 'English', region: 'Default operating language', adoption: 100, flag: 'EN' },
  { code: 'hi', name: 'Hindi', nativeName: '??????', region: 'High volume north zone merchants', adoption: 94, flag: '??' },
  { code: 'ta', name: 'Tamil', nativeName: '?????', region: 'South region audio prompts', adoption: 89, flag: '?' },
  { code: 'te', name: 'Telugu', nativeName: '??????', region: 'Storefront and static QR support', adoption: 86, flag: '??' },
  { code: 'bn', name: 'Bengali', nativeName: '?????', region: 'Eastern collections workflow', adoption: 82, flag: '??' },
];

const preferenceItems = [
  {
    key: 'announcements',
    title: 'Bilingual announcements',
    copy: 'Show operator alerts in both the selected language and English.',
  },
  {
    key: 'voicePrompts',
    title: 'Voice prompts for devices',
    copy: 'Sync the selected language to soundbox and device acknowledgement prompts.',
  },
  {
    key: 'printLabels',
    title: 'Receipt and QR label sync',
    copy: 'Use translated labels for printed receipts and downloadable QR standees.',
  },
];

export default function LanguageUpdate() {
  const [selectedLanguage, setSelectedLanguage] = useState('hi');
  const [saved, setSaved] = useState(false);
  const [preferences, setPreferences] = useState({
    announcements: true,
    voicePrompts: true,
    printLabels: false,
  });

  const activeLanguage = useMemo(
    () => languages.find((language) => language.code === selectedLanguage),
    [selectedLanguage],
  );

  const handleSave = () => {
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2200);
  };

  return (
    <Layout>
      <div className="page-stack">
        <section className="hero-panel">
          <div className="hero-content">
            <div className="hero-badge">
              <Languages size={16} />
              Language distribution center
            </div>

            <div>
              <p className="section-eyebrow">Language Update</p>
              <h2 className="hero-title">Manage portal language, device prompts and operator-facing translations.</h2>
            </div>

            <p className="hero-copy">
              Keep merchant communication consistent across the web portal, QR printables and payment soundboxes by rolling out one approved language profile.
            </p>

            <div className="hero-actions">
              <button type="button" className="primary-button" onClick={handleSave}>
                {saved ? <Check size={18} /> : <Save size={18} />}
                {saved ? 'Saved' : 'Save Language Profile'}
              </button>
              <button type="button" className="secondary-button">
                <Sparkles size={18} />
                Preview Translation Coverage
              </button>
            </div>
          </div>

          <aside className="hero-side">
            <div>
              <p className="panel-kicker">Current rollout</p>
              <h3 className="panel-title">{activeLanguage?.name} is prepared for operator alerts and device prompts.</h3>
            </div>

            <span className="status-pill success">Ready for distribution</span>

            <div className="mini-stat-grid">
              <div className="mini-stat">
                <p className="metric-label">Coverage</p>
                <strong>{activeLanguage?.adoption}%</strong>
              </div>
              <div className="mini-stat">
                <p className="metric-label">Active merchants</p>
                <strong>1,248</strong>
              </div>
              <div className="mini-stat">
                <p className="metric-label">Device sync</p>
                <strong>24 / 26</strong>
              </div>
              <div className="mini-stat">
                <p className="metric-label">Pending approvals</p>
                <strong>02</strong>
              </div>
            </div>
          </aside>
        </section>

        <section className="language-layout">
          <div className="language-card">
            <div className="section-header">
              <div>
                <p className="section-eyebrow">Language Library</p>
                <h3 className="section-title">Choose the active merchant language</h3>
                <p className="section-copy">Each option includes current readiness across interface labels, alerts and device voice confirmations.</p>
              </div>
            </div>

            <div className="language-list">
              {languages.map((language) => (
                <article
                  key={language.code}
                  className={`language-option ${selectedLanguage === language.code ? 'selected' : ''}`}
                  onClick={() => setSelectedLanguage(language.code)}
                >
                  <div className="language-option-top">
                    <div style={{ display: 'flex', gap: '0.9rem' }}>
                      <div className="language-flag">{language.flag}</div>
                      <div>
                        <h4 className="language-name">{language.name}</h4>
                        <p className="language-copy">{language.nativeName}</p>
                        <p className="transaction-caption">{language.region}</p>
                      </div>
                    </div>

                    {selectedLanguage === language.code ? (
                      <span className="selection-indicator">
                        <Check size={14} />
                        Selected
                      </span>
                    ) : null}
                  </div>

                  <div style={{ marginTop: '0.95rem' }}>
                    <div className="transaction-row-meta">
                      <span className="chip-label">Translation coverage</span>
                      <span className="chip-label">{language.adoption}%</span>
                    </div>
                    <div className="legend-bar" style={{ marginTop: '0.55rem' }}>
                      <div className="legend-fill" style={{ width: `${language.adoption}%` }} />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="promo-card">
            <p className="panel-kicker">Profile Summary</p>
            <h3 className="panel-title">{activeLanguage?.name} rollout package</h3>
            <p className="section-copy">
              {activeLanguage?.nativeName} will be used for the merchant portal interface, quick actions, field device prompts and QR standee text where supported.
            </p>

            <div className="insight-list">
              <div className="insight-item">
                <span>Primary region</span>
                <strong>{activeLanguage?.region}</strong>
              </div>
              <div className="insight-item">
                <span>Audio prompt readiness</span>
                <strong>Voice confirmations available</strong>
              </div>
              <div className="insight-item">
                <span>Fallback language</span>
                <strong>English retained for compliance labels</strong>
              </div>
            </div>
          </aside>
        </section>

        <section className="content-grid">
          <div className="language-card">
            <div className="section-header">
              <div>
                <p className="section-eyebrow">Preferences</p>
                <h3 className="section-title">Choose where translations should appear</h3>
              </div>
            </div>

            <div className="toggle-stack">
              {preferenceItems.map((item) => (
                <div key={item.key} className="toggle-row">
                  <div className="toggle-copy">
                    <p className="toggle-title">{item.title}</p>
                    <p className="field-help">{item.copy}</p>
                  </div>

                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={preferences[item.key]}
                      onChange={() =>
                        setPreferences((current) => ({
                          ...current,
                          [item.key]: !current[item.key],
                        }))
                      }
                    />
                    <span className="toggle-slider" />
                  </label>
                </div>
              ))}
            </div>
          </div>

          <aside className="summary-card">
            <div className="section-header">
              <div>
                <p className="section-eyebrow">Where this applies</p>
                <h3 className="section-title">Affected channels</h3>
              </div>
            </div>

            <div className="insight-list">
              <div className="insight-item">
                <span>Portal UI</span>
                <strong>Menus, labels, alerts and reconciliation prompts</strong>
              </div>
              <div className="insight-item">
                <span>Merchant devices</span>
                <strong>Audio confirmations and in-device status messages</strong>
              </div>
              <div className="insight-item">
                <span>Printed output</span>
                <strong>Receipt captions and QR standee download text</strong>
              </div>
            </div>

            <button type="button" className="ghost-button">
              <MonitorSpeaker size={18} />
              Review device sync
            </button>
            <button type="button" className="ghost-button">
              <Volume2 size={18} />
              Test voice prompts
            </button>
            <button type="button" className="ghost-button">
              <Mic2 size={18} />
              Review audio fallback
            </button>
          </aside>
        </section>
      </div>
    </Layout>
  );
}
