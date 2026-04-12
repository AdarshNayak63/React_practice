import React, { useMemo, useState } from 'react';
import Layout from '../components/Layout';
import { QrCode } from 'lucide-react';
import { apiService } from '../services/api';

const parseJson = (text) => {
  try {
    return { ok: true, value: JSON.parse(text) };
  } catch (error) {
    return { ok: false, error: 'Invalid JSON payload' };
  }
};

export default function QRDetails() {
  const [size, setSize] = useState('220');
  const [qrPayload, setQrPayload] = useState('{\n  "merchantId": "PNB2024001",\n  "amount": 10,\n  "purpose": "Testing dynamic QR"\n}');
  const [qrResult, setQrResult] = useState(null);
  const [base64Result, setBase64Result] = useState('');
  const [busy, setBusy] = useState({ qr: false, base64: false });
  const [error, setError] = useState({ qr: '', base64: '' });

  const qrPreviewSource = useMemo(() => {
    if (!base64Result) return '';
    return base64Result.startsWith('data:image') ? base64Result : `data:image/png;base64,${base64Result}`;
  }, [base64Result]);

  const generateQR = async () => {
    const parsed = parseJson(qrPayload);
    if (!parsed.ok) {
      setError((current) => ({ ...current, qr: parsed.error }));
      return;
    }
    setBusy((current) => ({ ...current, qr: true }));
    setError((current) => ({ ...current, qr: '' }));
    try {
      const response = await apiService.generateDynamicQR(parsed.value);
      setQrResult(response);
    } catch (apiError) {
      const message = apiError?.response?.data?.message || apiError?.message || 'Unable to generate QR';
      setError((current) => ({ ...current, qr: message }));
    } finally {
      setBusy((current) => ({ ...current, qr: false }));
    }
  };

  const convertToBase64 = async () => {
    const parsed = parseJson(qrPayload);
    if (!parsed.ok) {
      setError((current) => ({ ...current, base64: parsed.error }));
      return;
    }
    setBusy((current) => ({ ...current, base64: true }));
    setError((current) => ({ ...current, base64: '' }));
    try {
      const payload = {
        ...parsed.value,
        qrString: qrResult?.qrString || qrResult?.data?.qrString || parsed.value?.qrString,
      };
      const response = await apiService.convertQRToBase64(payload);
      const image = response?.base64 || response?.data?.base64 || response?.image || response?.qrImage || '';
      setBase64Result(image);
      setQrResult((current) => current || response);
    } catch (apiError) {
      const message = apiError?.response?.data?.message || apiError?.message || 'Unable to convert QR to base64';
      setError((current) => ({ ...current, base64: message }));
    } finally {
      setBusy((current) => ({ ...current, base64: false }));
    }
  };

  const downloadBase64 = () => {
    if (!qrPreviewSource) return;
    const anchor = document.createElement('a');
    anchor.href = qrPreviewSource;
    anchor.download = 'merchant-qr.png';
    anchor.click();
  };

  return (
    <Layout>
      <div className="stack">
        <section className="card qr-layout">
          <div className="qr-panel">
            <h2 className="section-title">Merchant QR</h2>
            <div className="qr-box" style={{ width: `${size}px`, height: `${size}px` }}>
              {qrPreviewSource ? (
                <img src={qrPreviewSource} alt="Generated QR" style={{ width: '90%', height: '90%', objectFit: 'contain' }} />
              ) : (
                <QrCode size={Number(size) - 40} color="#111827" />
              )}
            </div>

            <div className="toolbar">
              <select className="select" value={size} onChange={(event) => setSize(event.target.value)}>
                <option value="180">Small</option>
                <option value="220">Medium</option>
                <option value="260">Large</option>
              </select>
              <button type="button" className="primary-btn" onClick={downloadBase64} disabled={!qrPreviewSource}>
                Download
              </button>
            </div>
          </div>

          <div className="form-grid">
            <h2 className="section-title">QR Information</h2>

            <div className="field">
              <label>Generate Dynamic QR Payload (JSON)</label>
              <textarea
                className="textarea"
                rows="8"
                value={qrPayload}
                onChange={(event) => setQrPayload(event.target.value)}
              />
            </div>

            <div className="toolbar">
              <button type="button" className="primary-btn" onClick={generateQR} disabled={busy.qr}>
                {busy.qr ? 'Generating...' : 'Generate QR'}
              </button>
              <button type="button" className="primary-btn" onClick={convertToBase64} disabled={busy.base64}>
                {busy.base64 ? 'Converting...' : 'Convert to Base64'}
              </button>
            </div>

            {error.qr ? <p className="error-text">{error.qr}</p> : null}
            {error.base64 ? <p className="error-text">{error.base64}</p> : null}
            {qrResult ? <pre className="json-block">{JSON.stringify(qrResult, null, 2)}</pre> : null}
          </div>
        </section>
      </div>
    </Layout>
  );
}
