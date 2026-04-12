import React, { useEffect, useMemo, useState } from 'react';
import Layout from '../components/Layout';
import { apiService } from '../services/api';

const fallbackLanguages = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'Hindi' },
  { code: 'ta', name: 'Tamil' },
  { code: 'te', name: 'Telugu' },
  { code: 'bn', name: 'Bengali' },
];

const normalizeLanguageList = (response) => {
  const list = Array.isArray(response)
    ? response
    : Array.isArray(response?.data)
      ? response.data
      : Array.isArray(response?.languages)
        ? response.languages
        : [];

  return list
    .map((language) => ({
      code: language?.code || language?.languageCode || language?.id || '',
      name: language?.name || language?.languageName || language?.label || language?.code || 'Unknown',
    }))
    .filter((language) => language.code);
};

const resolveCurrentLanguage = (response) =>
  response?.languageCode ||
  response?.language ||
  response?.data?.languageCode ||
  response?.data?.language ||
  response?.code ||
  '';

export default function LanguageUpdate() {
  const [languages, setLanguages] = useState(fallbackLanguages);
  const [selected, setSelected] = useState('en');
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState({ list: false, current: false, save: false });
  const [error, setError] = useState({ list: '', current: '', save: '' });

  const active = useMemo(() => languages.find((item) => item.code === selected), [selected]);

  useEffect(() => {
    const loadLanguages = async () => {
      setBusy((current) => ({ ...current, list: true, current: true }));
      setError((current) => ({ ...current, list: '', current: '' }));
      try {
        const [listResponse, currentResponse] = await Promise.all([
          apiService.fetchAllLanguages(),
          apiService.getCurrentLanguage(),
        ]);
        const normalized = normalizeLanguageList(listResponse);
        if (normalized.length) setLanguages(normalized);
        const currentLanguageCode = resolveCurrentLanguage(currentResponse);
        if (currentLanguageCode) setSelected(currentLanguageCode);
      } catch (apiError) {
        const message = apiError?.response?.data?.message || apiError?.message || 'Unable to load language data';
        setError((current) => ({ ...current, list: message, current: message }));
      } finally {
        setBusy((current) => ({ ...current, list: false, current: false }));
      }
    };
    loadLanguages();
  }, []);

  const onSave = async () => {
    if (!selected) {
      setError((current) => ({ ...current, save: 'Select a language first' }));
      return;
    }
    setBusy((current) => ({ ...current, save: true }));
    setError((current) => ({ ...current, save: '' }));
    try {
      await apiService.updateLanguage({
        languageCode: selected,
        language: selected,
      });
      setSaved(true);
      window.setTimeout(() => setSaved(false), 1800);
    } catch (apiError) {
      const message = apiError?.response?.data?.message || apiError?.message || 'Unable to update language';
      setError((current) => ({ ...current, save: message }));
    } finally {
      setBusy((current) => ({ ...current, save: false }));
    }
  };

  return (
    <Layout>
      <div className="stack">
        <section className="card">
          <div className="card-head">
            <h2 className="section-title">Language Settings</h2>
            <button type="button" className="primary-btn" onClick={onSave} disabled={busy.save}>
              {busy.save ? 'Saving...' : 'Save'}
            </button>
          </div>

          <div className="language-layout">
            <div className="language-list">
              {languages.map((language) => (
                <button
                  type="button"
                  key={language.code}
                  className={`language-item ${selected === language.code ? 'selected' : ''}`}
                  onClick={() => setSelected(language.code)}
                >
                  {language.name}
                </button>
              ))}
              {busy.list || busy.current ? <p className="muted">Loading language data...</p> : null}
              {error.list ? <p className="error-text">{error.list}</p> : null}
            </div>

            <div className="language-summary">
              <p className="muted">Current Selection</p>
              <h3>{active?.name}</h3>
              <p className="muted">This language will be applied to portal labels and merchant device prompts.</p>
              {error.save ? <p className="error-text">{error.save}</p> : null}
            </div>
          </div>
        </section>

        {saved ? (
          <section className="card success-card">
            <p>Language updated successfully.</p>
          </section>
        ) : null}
      </div>
    </Layout>
  );
}
