import { useEffect, useMemo, useState } from "react";
import Notiflix from "notiflix";
import {
  Phone,
  Mail,
  MessageSquare,
  Search,
  LifeBuoy,
  Plus,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  Send,
  Download,
  RefreshCcw,
  Ticket
} from "lucide-react";
import { apiService } from "../../../services/apiService.js";

const Support = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTicket, setNewTicket] = useState({ subject: "", body: "", category: "Technical" });
  const [submitting, setSubmitting] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await apiService.viewAllTickets();
      if (res.data?.data) {
        setTickets(Array.isArray(res.data.data) ? res.data.data : []);
      }
    } catch (err) {
      console.error("Failed to fetch tickets:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      Notiflix.Loading.standard("Creating ticket...");
      await apiService.createTicket({
        subject: newTicket.subject,
        body: newTicket.body,
        category: newTicket.category
      });
      setIsModalOpen(false);
      setNewTicket({ subject: "", body: "", category: "Technical" });
      setTimeout(() => {
        fetchTickets();
      }, 1500);
      Notiflix.Notify.success("Ticket created successfully!");
    } catch (err) {
      console.error("Create Ticket Error:", err);
    } finally {
      setSubmitting(false);
      Notiflix.Loading.remove();
    }
  };

  const fetchTicketDetails = async (ticketId) => {
    setLoadingDetails(true);
    try {
      const [detailsRes, commentsRes] = await Promise.all([
        apiService.viewTicketById(ticketId),
        apiService.showComment(ticketId)
      ]);
      if (detailsRes.data?.data) setSelectedTicket(detailsRes.data.data);
      if (commentsRes.data?.data) setComments(commentsRes.data.data);
    } catch (err) {
      console.error("Failed to fetch details:", err);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment || !selectedTicket) return;
    try {
      Notiflix.Loading.dots("Adding comment...");
      await apiService.createComment({
        ticket_id: selectedTicket.id,
        body: newComment
      });
      setNewComment("");
      fetchTicketDetails(selectedTicket.id);
      Notiflix.Notify.success("Comment added successfully!");
    } catch (err) {
      console.error("Comment Error:", err);
    } finally {
      Notiflix.Loading.remove();
    }
  };

  const handleToggleStatus = async () => {
    if (!selectedTicket) return;
    try {
      if (selectedTicket.status === "solved") {
        Notiflix.Loading.pulse("Reopening ticket...");
        await apiService.reOpenStatus(selectedTicket.id, "Reopened for further investigation");
        Notiflix.Notify.success("Ticket reopened successfully!");
      } else {
        Notiflix.Loading.pulse("Closing ticket...");
        await apiService.closeStatus(selectedTicket.id, "Issue resolved by merchant");
        Notiflix.Notify.success("Ticket closed successfully!");
      }
      fetchTicketDetails(selectedTicket.id);
    } catch (err) {
      console.error("Status Error:", err);
    } finally {
      Notiflix.Loading.remove();
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "new":
        return <AlertCircle size={14} color="#ef4444" />;
      case "open":
        return <Clock size={14} color="#f59e0b" />;
      case "pending":
        return <Clock size={14} color="#3b82f6" />;
      case "solved":
      case "closed":
        return <CheckCircle2 size={14} color="#10b981" />;
      default:
        return <AlertCircle size={14} color="#666" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "new":
        return "#fef2f2";
      case "open":
        return "#fff7ed";
      case "pending":
        return "#eff6ff";
      case "solved":
      case "closed":
        return "#ecfdf5";
      default:
        return "#f8f9fa";
    }
  };

  const filteredTickets = useMemo(
    () =>
      tickets.filter(
        (t) =>
          (t.subject?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
          (t.id?.toString() || "").includes(searchQuery)
      ),
    [tickets, searchQuery]
  );

  const ticketCounts = useMemo(() => {
    return tickets.reduce(
      (acc, t) => {
        const status = (t.status || "").toLowerCase();
        if (status === "new" || status === "open") acc.active += 1;
        if (status === "solved" || status === "closed") acc.closed += 1;
        return acc;
      },
      { active: 0, closed: 0 }
    );
  }, [tickets]);

  if (loadingDetails) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          color: "#666"
        }}
      >
        <p>Loading ticket details...</p>
      </div>
    );
  }

  if (selectedTicket) {
    return (
      <div
        style={{
          padding: "24px 32px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          height: "100%",
          boxSizing: "border-box"
        }}
      >
        <button
          onClick={() => {
            setSelectedTicket(null);
            fetchTickets();
          }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "none",
            border: "none",
            color: "#666",
            cursor: "pointer",
            fontSize: "13px",
            fontWeight: "600",
            width: "fit-content"
          }}
        >
          <ChevronLeft size={16} /> Back to Tickets
        </button>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) 340px",
            gap: "24px",
            flex: 1,
            minHeight: 0
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "20px", overflowY: "auto" }}>
            <div style={{ backgroundColor: "white", border: "1px solid #eee", borderRadius: "10px", padding: "24px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "14px",
                  gap: "12px"
                }}
              >
                <h2 style={{ margin: 0, fontSize: "18px", fontWeight: "800", color: "#1A1A1A" }}>{selectedTicket.subject}</h2>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "5px 12px",
                    borderRadius: "20px",
                    backgroundColor: getStatusColor(selectedTicket.status)
                  }}
                >
                  {getStatusIcon(selectedTicket.status)}
                  <span style={{ fontSize: "12px", fontWeight: "700", color: "#333", textTransform: "capitalize" }}>
                    {selectedTicket.status}
                  </span>
                </div>
              </div>
              <p style={{ margin: 0, fontSize: "14px", color: "#444", lineHeight: 1.6 }}>
                {selectedTicket.description || selectedTicket.body}
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <h4 style={{ margin: 0, fontSize: "14px", fontWeight: "800", color: "#333" }}>Conversation</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {comments.map((comment, i) => (
                  <div
                    key={i}
                    style={{
                      backgroundColor: comment.author_id === 0 ? "#f8f9fa" : "white",
                      border: "1px solid #eee",
                      borderRadius: "8px",
                      padding: "14px"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                      <span style={{ fontSize: "12px", fontWeight: "800", color: "#333" }}>
                        {comment.author_name || (comment.author_id === 0 ? "Support Agent" : "You")}
                      </span>
                      <span style={{ fontSize: "11px", color: "#aaa" }}>{new Date(comment.created_at).toLocaleString()}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: "13px", color: "#555", lineHeight: 1.5 }}>{comment.body}</p>
                  </div>
                ))}
              </div>

              {selectedTicket.status !== "solved" && (
                <form onSubmit={handleAddComment} style={{ marginTop: "6px", display: "flex", gap: "10px" }}>
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a reply..."
                    style={{
                      flex: 1,
                      padding: "11px 14px",
                      borderRadius: "6px",
                      border: "1px solid #ddd",
                      fontSize: "13px"
                    }}
                  />
                  <button
                    style={{
                      backgroundColor: "#A01E35",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      padding: "0 18px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <Send size={18} />
                  </button>
                </form>
              )}
            </div>
          </div>

          <aside style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={{ backgroundColor: "white", border: "1px solid #eee", borderRadius: "10px", padding: "18px" }}>
              <h4 style={{ fontSize: "13px", fontWeight: "800", margin: "0 0 14px 0" }}>Ticket Information</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "12px", color: "#888" }}>Ticket ID</span>
                  <span style={{ fontSize: "12px", fontWeight: "700", color: "#333" }}>#{selectedTicket.id}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "12px", color: "#888" }}>Created On</span>
                  <span style={{ fontSize: "12px", fontWeight: "700", color: "#333" }}>
                    {new Date(selectedTicket.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "12px", color: "#888" }}>Category</span>
                  <span style={{ fontSize: "12px", fontWeight: "700", color: "#333" }}>{selectedTicket.type || "Technical"}</span>
                </div>
              </div>

              <div style={{ marginTop: "18px", display: "flex", flexDirection: "column", gap: "10px" }}>
                <button
                  onClick={handleToggleStatus}
                  style={{
                    width: "100%",
                    padding: "10px",
                    backgroundColor: selectedTicket.status === "solved" ? "#fff" : "#fef2f2",
                    border: selectedTicket.status === "solved" ? "1px solid #ddd" : "1px solid #fee2e2",
                    borderRadius: "4px",
                    color: selectedTicket.status === "solved" ? "#333" : "#ef4444",
                    fontSize: "12px",
                    fontWeight: "700",
                    cursor: "pointer"
                  }}
                >
                  {selectedTicket.status === "solved" ? "Reopen Ticket" : "Mark as Resolved"}
                </button>

                <button
                  style={{
                    width: "100%",
                    padding: "10px",
                    backgroundColor: "#f8f9fa",
                    border: "1px solid #eee",
                    borderRadius: "4px",
                    color: "#666",
                    fontSize: "12px",
                    fontWeight: "700",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px"
                  }}
                  onClick={async () => {
                    try {
                      Notiflix.Loading.standard("Downloading PDF...");
                      const res = await apiService.downloadTicketById(selectedTicket.id);
                      const url = window.URL.createObjectURL(new Blob([res.data]));
                      const link = document.createElement("a");
                      link.href = url;
                      link.setAttribute("download", `Ticket_${selectedTicket.id}.pdf`);
                      document.body.appendChild(link);
                      link.click();
                      window.URL.revokeObjectURL(url);
                      Notiflix.Notify.info("Download started.");
                    } catch (err) {
                      console.error("Download failed:", err);
                    } finally {
                      Notiflix.Loading.remove();
                    }
                  }}
                >
                  <Download size={14} /> Download PDF
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "24px 32px", display: "flex", flexDirection: "column", gap: "20px" }}>
      <section
        style={{
          borderRadius: "10px",
          background: "linear-gradient(135deg, #7f1629 0%, #A01E35 55%, #b42a42 100%)",
          color: "white",
          padding: "22px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "18px",
          flexWrap: "wrap"
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: "19px", fontWeight: "800" }}>Help and Support</h1>
          <p style={{ margin: "6px 0 0 0", fontSize: "12px", opacity: 0.85 }}>
            View all your support requests and raise new issues from one workspace.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          style={{
            backgroundColor: "white",
            color: "#A01E35",
            padding: "10px 16px",
            borderRadius: "6px",
            border: "none",
            fontWeight: "700",
            fontSize: "13px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}
        >
          <Plus size={16} /> Create Ticket
        </button>
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "12px" }}>
        <div style={{ backgroundColor: "white", border: "1px solid #eee", borderRadius: "8px", padding: "14px" }}>
          <p style={{ margin: 0, fontSize: "11px", color: "#777", textTransform: "uppercase", letterSpacing: "0.4px" }}>Total Tickets</p>
          <p style={{ margin: "8px 0 0 0", fontSize: "22px", fontWeight: "800", color: "#1A1A1A" }}>{tickets.length}</p>
        </div>
        <div style={{ backgroundColor: "white", border: "1px solid #eee", borderRadius: "8px", padding: "14px" }}>
          <p style={{ margin: 0, fontSize: "11px", color: "#777", textTransform: "uppercase", letterSpacing: "0.4px" }}>Active</p>
          <p style={{ margin: "8px 0 0 0", fontSize: "22px", fontWeight: "800", color: "#d97706" }}>{ticketCounts.active}</p>
        </div>
        <div style={{ backgroundColor: "white", border: "1px solid #eee", borderRadius: "8px", padding: "14px" }}>
          <p style={{ margin: 0, fontSize: "11px", color: "#777", textTransform: "uppercase", letterSpacing: "0.4px" }}>Closed</p>
          <p style={{ margin: "8px 0 0 0", fontSize: "22px", fontWeight: "800", color: "#059669" }}>{ticketCounts.closed}</p>
        </div>
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 300px", gap: "20px" }}>
        <div style={{ backgroundColor: "white", borderRadius: "10px", border: "1px solid #eee", overflow: "hidden" }}>
          <div
            style={{
              padding: "14px 16px",
              borderBottom: "1px solid #eee",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "10px",
              flexWrap: "wrap"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: "230px", flex: 1 }}>
              <Search size={14} color="#888" />
              <input
                type="text"
                placeholder="Search by ticket ID or subject"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ border: "none", outline: "none", fontSize: "13px", width: "100%", color: "#333" }}
              />
            </div>
            <button
              onClick={fetchTickets}
              style={{
                background: "#f8f9fa",
                border: "1px solid #e8e8e8",
                padding: "6px 10px",
                borderRadius: "6px",
                fontSize: "12px",
                color: "#444",
                fontWeight: "700",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                cursor: "pointer"
              }}
            >
              <RefreshCcw size={13} /> Refresh
            </button>
          </div>

          <div style={{ minHeight: "320px" }}>
            {loading && <div style={{ padding: "40px", textAlign: "center", color: "#888", fontSize: "13px" }}>Loading tickets...</div>}

            {!loading && filteredTickets.length > 0 &&
              filteredTickets.map((ticket, i) => (
                <div
                  key={ticket.id || i}
                  onClick={() => {
                    setSelectedTicket(ticket);
                    fetchTicketDetails(ticket.id);
                  }}
                  style={{
                    padding: "14px 16px",
                    borderBottom: i === filteredTickets.length - 1 ? "none" : "1px solid #f3f3f3",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: "pointer"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#fafafa";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <div>
                    <h5 style={{ margin: "0 0 5px 0", fontSize: "13px", fontWeight: "700", color: "#1A1A1A" }}>
                      {ticket.subject || "No Subject"}
                    </h5>
                    <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                      <span style={{ fontSize: "11px", color: "#888" }}>ID: #{ticket.id}</span>
                      <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", color: "#666" }}>
                        {getStatusIcon(ticket.status)}
                        <span style={{ textTransform: "capitalize" }}>{ticket.status}</span>
                      </div>
                    </div>
                  </div>
                  <ArrowRight size={14} color="#ccc" />
                </div>
              ))}

            {!loading && filteredTickets.length === 0 && (
              <div style={{ padding: "70px 30px", textAlign: "center" }}>
                <LifeBuoy size={40} color="#eee" style={{ marginBottom: "12px" }} />
                <p style={{ margin: 0, fontSize: "13px", color: "#888" }}>
                  {searchQuery ? `No tickets matching "${searchQuery}"` : "No support tickets found."}
                </p>
                <p style={{ margin: "4px 0 0 0", fontSize: "11px", color: "#aaa" }}>Raise a ticket to connect with support.</p>
              </div>
            )}
          </div>
        </div>

        <aside style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ backgroundColor: "white", borderRadius: "10px", border: "1px solid #eee", padding: "16px" }}>
            <h4 style={{ fontSize: "13px", fontWeight: "800", margin: "0 0 14px 0", color: "#333" }}>Quick Contact</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "8px",
                    backgroundColor: "#f0f4f8",
                    color: "#156DC4",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <Phone size={16} />
                </div>
                <div>
                  <p style={{ fontSize: "13px", fontWeight: "700", margin: 0, color: "#1A1A1A" }}>1800-419-2222</p>
                  <p style={{ fontSize: "11px", color: "#888", margin: 0 }}>Hotline</p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "8px",
                    backgroundColor: "#fff0f0",
                    color: "#A01E35",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <Mail size={16} />
                </div>
                <div>
                  <p style={{ fontSize: "13px", fontWeight: "700", margin: 0, color: "#1A1A1A" }}>support@pnb.co.in</p>
                  <p style={{ fontSize: "11px", color: "#888", margin: 0 }}>Email</p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "8px",
                    backgroundColor: "#e6f4ea",
                    color: "#1e7e34",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <MessageSquare size={16} />
                </div>
                <div>
                  <p style={{ fontSize: "13px", fontWeight: "700", margin: 0, color: "#1A1A1A" }}>Live Chat</p>
                  <p style={{ fontSize: "11px", color: "#888", margin: 0 }}>Active</p>
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              backgroundColor: "#fff7ed",
              border: "1px solid #ffedd5",
              borderRadius: "10px",
              padding: "16px",
              display: "flex",
              gap: "10px"
            }}
          >
            <div
              style={{
                width: "30px",
                height: "30px",
                borderRadius: "8px",
                backgroundColor: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#c2410c",
                flexShrink: 0
              }}
            >
              <Ticket size={16} />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: "12px", color: "#9a3412", fontWeight: "700" }}>Need immediate assistance?</p>
              <p style={{ margin: "4px 0 0 0", fontSize: "11px", color: "#b45309" }}>
                Raise a ticket with full details for faster resolution.
              </p>
            </div>
          </div>
        </aside>
      </section>

      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px"
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "8px",
              width: "500px",
              maxWidth: "100%",
              boxShadow: "0 20px 50px rgba(0,0,0,0.2)",
              display: "flex",
              flexDirection: "column"
            }}
          >
            <div
              style={{
                padding: "20px 24px",
                borderBottom: "1px solid #eee",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <h3 style={{ margin: 0, fontSize: "15px", fontWeight: "800", color: "#333" }}>Raise New Support Ticket</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ background: "none", border: "none", fontSize: "20px", color: "#aaa", cursor: "pointer" }}
              >
                x
              </button>
            </div>

            <form onSubmit={handleCreateTicket} style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "12px", fontWeight: "600", color: "#666" }}>Subject</label>
                <input
                  required
                  type="text"
                  value={newTicket.subject}
                  onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                  placeholder="Summarize the issue"
                  style={{ padding: "10px 12px", borderRadius: "4px", border: "1px solid #ddd", fontSize: "13px" }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "12px", fontWeight: "600", color: "#666" }}>Description</label>
                <textarea
                  required
                  rows={4}
                  value={newTicket.body}
                  onChange={(e) => setNewTicket({ ...newTicket, body: e.target.value })}
                  placeholder="Provide more details about your concern..."
                  style={{ padding: "10px 12px", borderRadius: "4px", border: "1px solid #ddd", fontSize: "13px", resize: "none" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "8px" }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "transparent",
                    border: "none",
                    color: "#666",
                    fontSize: "13px",
                    fontWeight: "600",
                    cursor: "pointer"
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    padding: "10px 24px",
                    backgroundColor: "#A01E35",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    fontSize: "13px",
                    fontWeight: "700",
                    cursor: submitting ? "not-allowed" : "pointer",
                    opacity: submitting ? 0.7 : 1
                  }}
                >
                  {submitting ? "Submitting..." : "Submit Ticket"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Support;
