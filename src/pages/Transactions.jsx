import React, { useMemo, useState } from 'react';
import Layout from '../components/Layout';
import { apiService } from '../services/api';

const parseJson = (text) => {
  try {
    return { ok: true, value: JSON.parse(text) };
  } catch (error) {
    return { ok: false, error: 'Invalid JSON payload' };
  }
};

const getTicketRows = (response) => {
  const list = Array.isArray(response)
    ? response
    : Array.isArray(response?.data)
      ? response.data
      : Array.isArray(response?.results)
        ? response.results
        : [];

  return list.map((item, index) => ({
    id: item?.ticketId || item?.id || `TKT-${index + 1}`,
    date: item?.createdAt || item?.date || item?.createdOn || '-',
    customer: item?.merchantName || item?.name || item?.createdBy || '-',
    channel: item?.channel || item?.source || 'Support',
    type: item?.ticketType || item?.type || item?.category || '-',
    amount: Number(item?.amount || 0),
    status: String(item?.status || item?.ticketStatus || 'Pending'),
  }));
};

const currency = (value) => `Rs ${value.toLocaleString('en-IN')}`;

export default function Transactions() {
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [reportId, setReportId] = useState('');
  const [ticketId, setTicketId] = useState('');
  const [commentTicketId, setCommentTicketId] = useState('');
  const [fileId, setFileId] = useState('');
  const [upload, setUpload] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [busy, setBusy] = useState({});
  const [error, setError] = useState('');
  const [reportPayload, setReportPayload] = useState('{\n  "fromDate": "2026-04-01",\n  "toDate": "2026-04-10"\n}');
  const [filterPayload, setFilterPayload] = useState('{\n  "status": "OPEN"\n}');
  const [ticketPayload, setTicketPayload] = useState('{\n  "subject": "Device issue",\n  "description": "Soundbox not speaking after payment."\n}');
  const [commentPayload, setCommentPayload] = useState('{\n  "ticketId": "TKT-001",\n  "comment": "Please share update."\n}');
  const [ratePayload, setRatePayload] = useState('{\n  "rating": 5,\n  "feedback": "Service is good."\n}');
  const [formPayload, setFormPayload] = useState('{\n  "index": "merchant_logs",\n  "query": {\n    "match_all": {}\n  }\n}');
  const [responses, setResponses] = useState({});

  const runAction = async (key, action) => {
    setBusy((current) => ({ ...current, [key]: true }));
    setError('');
    try {
      const result = await action();
      setResponses((current) => ({ ...current, [key]: result }));
      if (key === 'viewAllTickets' || key === 'filterTicket') {
        setTickets(getTicketRows(result));
      }
    } catch (apiError) {
      const message = apiError?.response?.data?.message || apiError?.message || 'Request failed';
      setError(`${key}: ${message}`);
    } finally {
      setBusy((current) => ({ ...current, [key]: false }));
    }
  };

  const rows = useMemo(
    () =>
      tickets.filter((row) => {
        const matchText =
          query.trim().length === 0 ||
          row.id.toLowerCase().includes(query.toLowerCase()) ||
          row.customer.toLowerCase().includes(query.toLowerCase());

        const matchType = typeFilter === 'all' || row.type.toLowerCase() === typeFilter;
        return matchText && matchType;
      }),
    [tickets, query, typeFilter],
  );

  return (
    <Layout>
      <div className="stack">
        <section className="card">
          <div className="card-head">
            <h2 className="section-title">Ticket & Transaction APIs</h2>
            <button
              type="button"
              className="primary-btn"
              onClick={() => runAction('viewAllTickets', () => apiService.viewAllTickets())}
              disabled={busy.viewAllTickets}
            >
              {busy.viewAllTickets ? 'Loading...' : 'Refresh'}
            </button>
          </div>

          {error ? <p className="error-text">{error}</p> : null}

          <div className="toolbar">
            <input
              className="input"
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by ID or merchant"
            />

            <select className="select" value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}>
              <option value="all">All</option>
              <option value="credit">Credit</option>
              <option value="debit">Debit</option>
            </select>
          </div>

          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>ID</th>
                  <th>Merchant</th>
                  <th>Channel</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id}>
                    <td>{row.date}</td>
                    <td>{row.id}</td>
                    <td>{row.customer}</td>
                    <td>{row.channel}</td>
                    <td>{row.type}</td>
                    <td>{currency(row.amount)}</td>
                    <td><span className={`badge ${row.status.toLowerCase().includes('close') || row.status.toLowerCase().includes('success') ? 'success' : row.status.toLowerCase().includes('fail') ? 'failed' : 'pending'}`}>{row.status}</span></td>
                  </tr>
                ))}
                {!rows.length ? (
                  <tr>
                    <td colSpan="7" className="muted">No records yet. Click Refresh or run a filter.</td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </section>

        <section className="card">
          <h2 className="section-title">Reports APIs</h2>
          <div className="field">
            <label>Submit Report Payload (JSON)</label>
            <textarea className="textarea" rows="6" value={reportPayload} onChange={(event) => setReportPayload(event.target.value)} />
          </div>
          <div className="toolbar">
            <button
              type="button"
              className="primary-btn"
              onClick={() => {
                const parsed = parseJson(reportPayload);
                if (!parsed.ok) {
                  setError(parsed.error);
                  return;
                }
                runAction('submitReport', () => apiService.submitReport(parsed.value));
              }}
              disabled={busy.submitReport}
            >
              {busy.submitReport ? 'Submitting...' : 'Submit Report'}
            </button>
            <input className="input" value={reportId} onChange={(event) => setReportId(event.target.value)} placeholder="Report ID" />
            <button
              type="button"
              className="primary-btn"
              onClick={() => runAction('getReportStatus', () => apiService.getReportStatus(reportId))}
              disabled={busy.getReportStatus}
            >
              {busy.getReportStatus ? 'Checking...' : 'Get Report Status'}
            </button>
          </div>
          {responses.submitReport ? <pre className="json-block">{JSON.stringify(responses.submitReport, null, 2)}</pre> : null}
          {responses.getReportStatus ? <pre className="json-block">{JSON.stringify(responses.getReportStatus, null, 2)}</pre> : null}
        </section>

        <section className="card">
          <h2 className="section-title">Ticket APIs</h2>
          <div className="field">
            <label>Create Ticket Payload (JSON)</label>
            <textarea className="textarea" rows="6" value={ticketPayload} onChange={(event) => setTicketPayload(event.target.value)} />
          </div>
          <div className="toolbar">
            <button
              type="button"
              className="primary-btn"
              onClick={() => {
                const parsed = parseJson(ticketPayload);
                if (!parsed.ok) {
                  setError(parsed.error);
                  return;
                }
                runAction('createTicket', () => apiService.createTicket(parsed.value));
              }}
              disabled={busy.createTicket}
            >
              {busy.createTicket ? 'Creating...' : 'Create Ticket'}
            </button>
            <input className="input" value={ticketId} onChange={(event) => setTicketId(event.target.value)} placeholder="Ticket ID" />
            <button type="button" className="primary-btn" onClick={() => runAction('viewTicketById', () => apiService.viewTicketById(ticketId))}>View By ID</button>
            <button type="button" className="primary-btn" onClick={() => runAction('closeTicket', () => apiService.closeTicket(ticketId))}>Close</button>
            <button type="button" className="primary-btn" onClick={() => runAction('reopenTicket', () => apiService.reopenTicket(ticketId))}>Reopen</button>
            <button type="button" className="primary-btn" onClick={() => runAction('downloadTicketById', () => apiService.downloadTicketById(ticketId))}>Download By ID</button>
            <button type="button" className="primary-btn" onClick={() => runAction('downloadAllTickets', () => apiService.downloadAllTickets())}>Download All</button>
          </div>
          <div className="field">
            <label>Filter Ticket Payload (JSON)</label>
            <textarea className="textarea" rows="5" value={filterPayload} onChange={(event) => setFilterPayload(event.target.value)} />
          </div>
          <button
            type="button"
            className="primary-btn"
            onClick={() => {
              const parsed = parseJson(filterPayload);
              if (!parsed.ok) {
                setError(parsed.error);
                return;
              }
              runAction('filterTicket', () => apiService.filterTickets(parsed.value));
            }}
          >
            Apply Filter
          </button>
          {responses.createTicket ? <pre className="json-block">{JSON.stringify(responses.createTicket, null, 2)}</pre> : null}
          {responses.viewTicketById ? <pre className="json-block">{JSON.stringify(responses.viewTicketById, null, 2)}</pre> : null}
        </section>

        <section className="card">
          <h2 className="section-title">Comments & Rating APIs</h2>
          <div className="toolbar">
            <input
              className="input"
              value={commentTicketId}
              onChange={(event) => setCommentTicketId(event.target.value)}
              placeholder="Ticket ID for comments"
            />
            <button type="button" className="primary-btn" onClick={() => runAction('showComment', () => apiService.showComment(commentTicketId))}>
              View Comments
            </button>
          </div>
          <div className="field">
            <label>Create Comment Payload (JSON)</label>
            <textarea className="textarea" rows="5" value={commentPayload} onChange={(event) => setCommentPayload(event.target.value)} />
          </div>
          <button
            type="button"
            className="primary-btn"
            onClick={() => {
              const parsed = parseJson(commentPayload);
              if (!parsed.ok) {
                setError(parsed.error);
                return;
              }
              runAction('createComment', () => apiService.createComment(parsed.value));
            }}
          >
            Create Comment
          </button>
          <div className="field" style={{ marginTop: '12px' }}>
            <label>Rate Us Payload (JSON)</label>
            <textarea className="textarea" rows="5" value={ratePayload} onChange={(event) => setRatePayload(event.target.value)} />
          </div>
          <button
            type="button"
            className="primary-btn"
            onClick={() => {
              const parsed = parseJson(ratePayload);
              if (!parsed.ok) {
                setError(parsed.error);
                return;
              }
              runAction('rateUs', () => apiService.rateUs(parsed.value));
            }}
          >
            Submit Rating
          </button>
          {responses.showComment ? <pre className="json-block">{JSON.stringify(responses.showComment, null, 2)}</pre> : null}
          {responses.createComment ? <pre className="json-block">{JSON.stringify(responses.createComment, null, 2)}</pre> : null}
          {responses.rateUs ? <pre className="json-block">{JSON.stringify(responses.rateUs, null, 2)}</pre> : null}
        </section>

        <section className="card">
          <h2 className="section-title">File & Form APIs</h2>
          <div className="toolbar">
            <input type="file" onChange={(event) => setUpload(event.target.files?.[0] || null)} />
            <button
              type="button"
              className="primary-btn"
              onClick={() => {
                if (!upload) {
                  setError('Select a file first');
                  return;
                }
                const data = new FormData();
                data.append('file', upload);
                runAction('uploadFile', () => apiService.uploadFile(data));
              }}
            >
              Upload File
            </button>
          </div>
          <div className="toolbar">
            <input className="input" value={fileId} onChange={(event) => setFileId(event.target.value)} placeholder="File ID" />
            <button type="button" className="primary-btn" onClick={() => runAction('deleteFile', () => apiService.deleteFile(fileId))}>
              Delete File
            </button>
          </div>
          <div className="field">
            <label>Fetch Form Payload (JSON)</label>
            <textarea className="textarea" rows="6" value={formPayload} onChange={(event) => setFormPayload(event.target.value)} />
          </div>
          <button
            type="button"
            className="primary-btn"
            onClick={() => {
              const parsed = parseJson(formPayload);
              if (!parsed.ok) {
                setError(parsed.error);
                return;
              }
              runAction('fetchForm', () => apiService.fetchForm(parsed.value));
            }}
          >
            Fetch Form
          </button>
          {responses.uploadFile ? <pre className="json-block">{JSON.stringify(responses.uploadFile, null, 2)}</pre> : null}
          {responses.deleteFile ? <pre className="json-block">{JSON.stringify(responses.deleteFile, null, 2)}</pre> : null}
          {responses.fetchForm ? <pre className="json-block">{JSON.stringify(responses.fetchForm, null, 2)}</pre> : null}
        </section>
      </div>
    </Layout>
  );
}
