import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { apiService } from '../services/api';

const currency = (value) => `Rs ${Number(value || 0).toLocaleString('en-IN')}`;

const getArrayPayload = (response) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.results)) return response.results;
  if (Array.isArray(response?.items)) return response.items;
  return [];
};

const pickValue = (object, keys, fallback = '-') => {
  for (const key of keys) {
    const value = object?.[key];
    if (value !== undefined && value !== null && value !== '') {
      return value;
    }
  }
  return fallback;
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState('');
  const [deviceSno, setDeviceSno] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const [deviceInfo, setDeviceInfo] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [busy, setBusy] = useState({ user: false, device: false, tickets: false });
  const [error, setError] = useState({ user: '', device: '', tickets: '' });

  const loadTickets = async () => {
    setBusy((current) => ({ ...current, tickets: true }));
    setError((current) => ({ ...current, tickets: '' }));
    try {
      const response = await apiService.viewAllTickets();
      setTickets(getArrayPayload(response));
    } catch (apiError) {
      const message = apiError?.response?.data?.message || apiError?.message || 'Unable to load tickets';
      setError((current) => ({ ...current, tickets: message }));
    } finally {
      setBusy((current) => ({ ...current, tickets: false }));
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const fetchUser = async () => {
    if (!userId.trim()) {
      setError((current) => ({ ...current, user: 'Enter a valid User ID' }));
      return;
    }
    setBusy((current) => ({ ...current, user: true }));
    setError((current) => ({ ...current, user: '' }));
    try {
      const response = await apiService.fetchUserById(userId.trim());
      setUserInfo(response);
    } catch (apiError) {
      const message = apiError?.response?.data?.message || apiError?.message || 'Unable to fetch user';
      setError((current) => ({ ...current, user: message }));
    } finally {
      setBusy((current) => ({ ...current, user: false }));
    }
  };

  const fetchDevice = async () => {
    if (!deviceSno.trim()) {
      setError((current) => ({ ...current, device: 'Enter a valid Device Serial Number' }));
      return;
    }
    setBusy((current) => ({ ...current, device: true }));
    setError((current) => ({ ...current, device: '' }));
    try {
      const response = await apiService.getDeviceDetails(deviceSno.trim());
      setDeviceInfo(response);
    } catch (apiError) {
      const message = apiError?.response?.data?.message || apiError?.message || 'Unable to fetch device details';
      setError((current) => ({ ...current, device: message }));
    } finally {
      setBusy((current) => ({ ...current, device: false }));
    }
  };

  const ticketRows = useMemo(() => tickets.slice(0, 5).map((ticket, index) => ({
    id: pickValue(ticket, ['ticketId', 'id', 'referenceId', 'requestId'], `TKT-${index + 1}`),
    customer: pickValue(ticket, ['merchantName', 'name', 'customerName', 'createdBy']),
    type: pickValue(ticket, ['ticketType', 'category', 'type']),
    amount: pickValue(ticket, ['amount', 'value'], 0),
    status: String(pickValue(ticket, ['status', 'ticketStatus'], 'Pending')),
  })), [tickets]);

  const stats = useMemo(() => {
    const total = tickets.length;
    const openCount = tickets.filter((ticket) => String(pickValue(ticket, ['status', 'ticketStatus'], '')).toLowerCase().includes('open')).length;
    const closedCount = tickets.filter((ticket) => String(pickValue(ticket, ['status', 'ticketStatus'], '')).toLowerCase().includes('close')).length;
    const successRate = total > 0 ? ((closedCount / total) * 100).toFixed(1) : '0.0';
    return { total, openCount, closedCount, successRate };
  }, [tickets]);

  return (
    <Layout>
      <div className="stack">
        <section className="card">
          <h2 className="section-title">Merchant Overview</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <p>Total Tickets</p>
              <strong>{stats.total}</strong>
            </div>
            <div className="stat-card">
              <p>Open Tickets</p>
              <strong>{stats.openCount}</strong>
            </div>
            <div className="stat-card">
              <p>Resolved Tickets</p>
              <strong>{stats.closedCount}</strong>
            </div>
            <div className="stat-card">
              <p>Resolution Rate</p>
              <strong>{stats.successRate}%</strong>
            </div>
          </div>
          <div className="inline-status">
            {busy.tickets ? <p className="muted">Loading tickets...</p> : null}
            {error.tickets ? <p className="error-text">{error.tickets}</p> : null}
          </div>
        </section>

        <section className="card">
          <div className="card-head">
            <h2 className="section-title">Recent Transactions</h2>
            <button type="button" className="primary-btn" onClick={() => navigate('/transactions')}>
              View All
            </button>
          </div>

          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Customer</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {ticketRows.map((row) => (
                  <tr key={row.id}>
                    <td>{row.id}</td>
                    <td>{row.customer}</td>
                    <td>{row.type}</td>
                    <td>{currency(row.amount)}</td>
                    <td>
                      <span className={`badge ${row.status.toLowerCase().includes('close') || row.status.toLowerCase().includes('success') ? 'success' : row.status.toLowerCase().includes('fail') ? 'failed' : 'pending'}`}>{row.status}</span>
                    </td>
                  </tr>
                ))}
                {!ticketRows.length ? (
                  <tr>
                    <td colSpan="5" className="muted">No ticket data available.</td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </section>

        <section className="card">
          <h2 className="section-title">Quick API Checks</h2>
          <div className="quick-grid">
            <div className="field">
              <label>Fetch User By ID</label>
              <div className="toolbar">
                <input
                  className="input"
                  value={userId}
                  onChange={(event) => setUserId(event.target.value)}
                  placeholder="Enter user ID"
                />
                <button type="button" className="primary-btn" onClick={fetchUser} disabled={busy.user}>
                  {busy.user ? 'Loading...' : 'Fetch User'}
                </button>
              </div>
              {error.user ? <p className="error-text">{error.user}</p> : null}
              {userInfo ? <pre className="json-block">{JSON.stringify(userInfo, null, 2)}</pre> : null}
            </div>

            <div className="field">
              <label>Fetch Device Status</label>
              <div className="toolbar">
                <input
                  className="input"
                  value={deviceSno}
                  onChange={(event) => setDeviceSno(event.target.value)}
                  placeholder="Enter device serial number"
                />
                <button type="button" className="primary-btn" onClick={fetchDevice} disabled={busy.device}>
                  {busy.device ? 'Loading...' : 'Fetch Device'}
                </button>
              </div>
              {error.device ? <p className="error-text">{error.device}</p> : null}
              {deviceInfo ? <pre className="json-block">{JSON.stringify(deviceInfo, null, 2)}</pre> : null}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
