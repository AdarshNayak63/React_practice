import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
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
  Download
} from "lucide-react";
import { apiService } from "../services/apiService";
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
        return /* @__PURE__ */ jsx(AlertCircle, { size: 14, color: "#ef4444" });
      case "open":
        return /* @__PURE__ */ jsx(Clock, { size: 14, color: "#f59e0b" });
      case "pending":
        return /* @__PURE__ */ jsx(Clock, { size: 14, color: "#3b82f6" });
      case "solved":
      case "closed":
        return /* @__PURE__ */ jsx(CheckCircle2, { size: 14, color: "#10b981" });
      default:
        return /* @__PURE__ */ jsx(AlertCircle, { size: 14, color: "#666" });
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
  if (loadingDetails) {
    return /* @__PURE__ */ jsx("div", { style: { display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#666" }, children: /* @__PURE__ */ jsx("p", { children: "Loading ticket details..." }) });
  }
  if (selectedTicket) {
    return /* @__PURE__ */ jsxs("div", { style: { padding: "24px 32px", display: "flex", flexDirection: "column", gap: "20px", height: "100%", boxSizing: "border-box" }, children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => {
            setSelectedTicket(null);
            fetchTickets();
          },
          style: { display: "flex", alignItems: "center", gap: "8px", background: "none", border: "none", color: "#666", cursor: "pointer", fontSize: "13px", fontWeight: "600", width: "fit-content" },
          children: [
            /* @__PURE__ */ jsx(ChevronLeft, { size: 16 }),
            " Back to Tickets"
          ]
        }
      ),
      /* @__PURE__ */ jsxs("div", { style: { display: "grid", gridTemplateColumns: "minmax(0, 1fr) 350px", gap: "24px", flex: 1, minHeight: 0 }, children: [
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "24px", overflowY: "auto" }, children: [
          /* @__PURE__ */ jsxs("div", { style: { backgroundColor: "white", border: "1px solid #eee", borderRadius: "8px", padding: "24px" }, children: [
            /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }, children: [
              /* @__PURE__ */ jsx("h2", { style: { margin: 0, fontSize: "18px", fontWeight: "800", color: "#1A1A1A" }, children: selectedTicket.subject }),
              /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "8px", padding: "4px 12px", borderRadius: "20px", backgroundColor: getStatusColor(selectedTicket.status) }, children: [
                getStatusIcon(selectedTicket.status),
                /* @__PURE__ */ jsx("span", { style: { fontSize: "12px", fontWeight: "700", color: "#333", textTransform: "capitalize" }, children: selectedTicket.status })
              ] })
            ] }),
            /* @__PURE__ */ jsx("p", { style: { margin: 0, fontSize: "14px", color: "#444", lineHeight: 1.6 }, children: selectedTicket.description || selectedTicket.body })
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "16px" }, children: [
            /* @__PURE__ */ jsx("h4", { style: { margin: 0, fontSize: "14px", fontWeight: "800", color: "#333" }, children: "Communication History" }),
            /* @__PURE__ */ jsx("div", { style: { display: "flex", flexDirection: "column", gap: "12px" }, children: comments.map((comment, i) => /* @__PURE__ */ jsxs("div", { style: { backgroundColor: comment.author_id === 0 ? "#f8f9fa" : "white", border: "1px solid #eee", borderRadius: "8px", padding: "16px" }, children: [
              /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", marginBottom: "8px" }, children: [
                /* @__PURE__ */ jsx("span", { style: { fontSize: "12px", fontWeight: "800", color: "#333" }, children: comment.author_name || (comment.author_id === 0 ? "Support Agent" : "You") }),
                /* @__PURE__ */ jsx("span", { style: { fontSize: "11px", color: "#aaa" }, children: new Date(comment.created_at).toLocaleString() })
              ] }),
              /* @__PURE__ */ jsx("p", { style: { margin: 0, fontSize: "13px", color: "#555", lineHeight: 1.5 }, children: comment.body })
            ] }, i)) }),
            selectedTicket.status !== "solved" && /* @__PURE__ */ jsxs("form", { onSubmit: handleAddComment, style: { marginTop: "16px", display: "flex", gap: "12px" }, children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: newComment,
                  onChange: (e) => setNewComment(e.target.value),
                  placeholder: "Write a reply...",
                  style: { flex: 1, padding: "12px 16px", borderRadius: "6px", border: "1px solid #ddd", fontSize: "13px" }
                }
              ),
              /* @__PURE__ */ jsx("button", { style: { backgroundColor: "#A01E35", color: "white", border: "none", borderRadius: "6px", padding: "0 20px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }, children: /* @__PURE__ */ jsx(Send, { size: 18 }) })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("aside", { style: { display: "flex", flexDirection: "column", gap: "24px" }, children: /* @__PURE__ */ jsxs("div", { style: { backgroundColor: "white", border: "1px solid #eee", borderRadius: "8px", padding: "20px" }, children: [
          /* @__PURE__ */ jsx("h4", { style: { fontSize: "13px", fontWeight: "800", margin: "0 0 16px 0" }, children: "Ticket Information" }),
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "12px" }, children: [
            /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between" }, children: [
              /* @__PURE__ */ jsx("span", { style: { fontSize: "12px", color: "#888" }, children: "Ticket ID" }),
              /* @__PURE__ */ jsxs("span", { style: { fontSize: "12px", fontWeight: "700", color: "#333" }, children: [
                "#",
                selectedTicket.id
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between" }, children: [
              /* @__PURE__ */ jsx("span", { style: { fontSize: "12px", color: "#888" }, children: "Created On" }),
              /* @__PURE__ */ jsx("span", { style: { fontSize: "12px", fontWeight: "700", color: "#333" }, children: new Date(selectedTicket.created_at).toLocaleDateString() })
            ] }),
            /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between" }, children: [
              /* @__PURE__ */ jsx("span", { style: { fontSize: "12px", color: "#888" }, children: "Category" }),
              /* @__PURE__ */ jsx("span", { style: { fontSize: "12px", fontWeight: "700", color: "#333" }, children: selectedTicket.type || "Technical" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { marginTop: "24px", display: "flex", flexDirection: "column", gap: "12px" }, children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: handleToggleStatus,
                style: { width: "100%", padding: "10px", backgroundColor: selectedTicket.status === "solved" ? "#fff" : "#fef2f2", border: selectedTicket.status === "solved" ? "1px solid #ddd" : "1px solid #fee2e2", borderRadius: "4px", color: selectedTicket.status === "solved" ? "#333" : "#ef4444", fontSize: "12px", fontWeight: "700", cursor: "pointer" },
                children: selectedTicket.status === "solved" ? "Reopen Ticket" : "Mark as Resolved"
              }
            ),
            /* @__PURE__ */ jsxs(
              "button",
              {
                style: { width: "100%", padding: "10px", backgroundColor: "#f8f9fa", border: "1px solid #eee", borderRadius: "4px", color: "#666", fontSize: "12px", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" },
                onClick: async () => {
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
                },
                children: [
                  /* @__PURE__ */ jsx(Download, { size: 14 }),
                  " Download PDF"
                ]
              }
            )
          ] })
        ] }) })
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "24px", padding: "24px 32px" }, children: [
    /* @__PURE__ */ jsxs("header", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" }, children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { style: { fontSize: "18px", fontWeight: "800", color: "#1A1A1A", margin: 0 }, children: "Support Desk" }),
        /* @__PURE__ */ jsx("p", { style: { fontSize: "12px", color: "#666", marginTop: "4px" }, children: "Track your requests or get immediate assistance." })
      ] }),
      /* @__PURE__ */ jsxs("div", { style: {
        backgroundColor: "white",
        padding: "8px 14px",
        borderRadius: "4px",
        border: "1px solid #eee",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        width: "300px"
      }, children: [
        /* @__PURE__ */ jsx(Search, { size: 14, color: "#888" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            placeholder: "Search tickets...",
            value: searchQuery,
            onChange: (e) => setSearchQuery(e.target.value),
            style: { border: "none", outline: "none", fontSize: "13px", width: "100%", color: "#333" }
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { style: { display: "grid", gridTemplateColumns: "minmax(0, 1fr) 300px", gap: "24px" }, children: [
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "24px" }, children: [
        /* @__PURE__ */ jsxs("section", { style: { backgroundColor: "white", borderRadius: "8px", border: "1px solid #eee", overflow: "hidden" }, children: [
          /* @__PURE__ */ jsxs("div", { style: { padding: "20px 24px", borderBottom: "1px solid #eee", backgroundColor: "#fafafa", display: "flex", justifyContent: "space-between", alignItems: "center" }, children: [
            /* @__PURE__ */ jsx("h4", { style: { margin: 0, fontSize: "14px", fontWeight: "800", color: "#333" }, children: "Your Active Tickets" }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: fetchTickets,
                style: { background: "none", border: "none", fontSize: "12px", color: "#156DC4", fontWeight: "600", cursor: "pointer" },
                children: "Refresh"
              }
            )
          ] }),
          /* @__PURE__ */ jsx("div", { style: { minHeight: "300px" }, children: (() => {
            const filteredTickets = tickets.filter(
              (t) => (t.subject?.toLowerCase() || "").includes(searchQuery.toLowerCase()) || (t.id?.toString() || "").includes(searchQuery)
            );
            if (loading) {
              return /* @__PURE__ */ jsx("div", { style: { padding: "40px", textAlign: "center", color: "#888", fontSize: "13px" }, children: "Loading tickets..." });
            }
            if (filteredTickets.length > 0) {
              return filteredTickets.map((ticket, i) => /* @__PURE__ */ jsxs(
                "div",
                {
                  onClick: () => {
                    setSelectedTicket(ticket);
                    fetchTicketDetails(ticket.id);
                  },
                  style: { padding: "16px 24px", borderBottom: i === filteredTickets.length - 1 ? "none" : "1px solid #f8f9fa", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" },
                  onMouseEnter: (e) => e.currentTarget.style.backgroundColor = "#fafafa",
                  onMouseLeave: (e) => e.currentTarget.style.backgroundColor = "transparent",
                  children: [
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("h5", { style: { margin: "0 0 4px 0", fontSize: "13px", fontWeight: "700", color: "#1A1A1A" }, children: ticket.subject || "No Subject" }),
                      /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "12px", alignItems: "center" }, children: [
                        /* @__PURE__ */ jsxs("span", { style: { fontSize: "11px", color: "#888" }, children: [
                          "ID: #",
                          ticket.id
                        ] }),
                        /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", color: "#666" }, children: [
                          getStatusIcon(ticket.status),
                          ticket.status
                        ] })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsx(ArrowRight, { size: 14, color: "#ccc" })
                  ]
                },
                ticket.id || i
              ));
            }
            return /* @__PURE__ */ jsxs("div", { style: { padding: "80px 40px", textAlign: "center" }, children: [
              /* @__PURE__ */ jsx(LifeBuoy, { size: 40, color: "#eee", style: { marginBottom: "16px" } }),
              /* @__PURE__ */ jsx("p", { style: { margin: 0, fontSize: "13px", color: "#888" }, children: searchQuery ? `No tickets matching "${searchQuery}"` : "No support tickets found." }),
              /* @__PURE__ */ jsx("p", { style: { margin: "4px 0 0 0", fontSize: "11px", color: "#aaa" }, children: "Reach out to us to start a conversation." })
            ] });
          })() })
        ] }),
        /* @__PURE__ */ jsxs("section", { style: {
          backgroundColor: "#A01E35",
          borderRadius: "8px",
          padding: "24px",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }, children: [
          /* @__PURE__ */ jsxs("div", { style: { maxWidth: "70%" }, children: [
            /* @__PURE__ */ jsx("h3", { style: { fontSize: "16px", fontWeight: "800", margin: 0 }, children: "Still need help?" }),
            /* @__PURE__ */ jsx("p", { style: { fontSize: "12px", opacity: 0.8, marginTop: "4px" }, children: "Our support specialists are ready to assist you." })
          ] }),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setIsModalOpen(true),
              style: {
                backgroundColor: "white",
                color: "#A01E35",
                padding: "10px 20px",
                borderRadius: "4px",
                border: "none",
                fontWeight: "700",
                fontSize: "13px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              },
              children: [
                /* @__PURE__ */ jsx(Plus, { size: 16 }),
                "New Ticket"
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsx("aside", { style: { display: "flex", flexDirection: "column", gap: "24px" }, children: /* @__PURE__ */ jsxs("div", { style: { backgroundColor: "white", borderRadius: "8px", border: "1px solid #eee", padding: "20px" }, children: [
        /* @__PURE__ */ jsx("h4", { style: { fontSize: "13px", fontWeight: "800", margin: "0 0 16px 0", color: "#333" }, children: "Quick Contact" }),
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "16px" }, children: [
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "12px", alignItems: "center" }, children: [
            /* @__PURE__ */ jsx("div", { style: { width: "32px", height: "32px", borderRadius: "6px", backgroundColor: "#f0f4f8", color: "#156DC4", display: "flex", alignItems: "center", justifyContent: "center" }, children: /* @__PURE__ */ jsx(Phone, { size: 16 }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { style: { fontSize: "13px", fontWeight: "700", margin: 0, color: "#1A1A1A" }, children: "1800-419-2222" }),
              /* @__PURE__ */ jsx("p", { style: { fontSize: "11px", color: "#888", margin: 0 }, children: "Hotline" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "12px", alignItems: "center" }, children: [
            /* @__PURE__ */ jsx("div", { style: { width: "32px", height: "32px", borderRadius: "6px", backgroundColor: "#fff0f0", color: "#A01E35", display: "flex", alignItems: "center", justifyContent: "center" }, children: /* @__PURE__ */ jsx(Mail, { size: 16 }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { style: { fontSize: "13px", fontWeight: "700", margin: 0, color: "#1A1A1A" }, children: "support@pnb.co.in" }),
              /* @__PURE__ */ jsx("p", { style: { fontSize: "11px", color: "#888", margin: 0 }, children: "Email" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "12px", alignItems: "center" }, children: [
            /* @__PURE__ */ jsx("div", { style: { width: "32px", height: "32px", borderRadius: "6px", backgroundColor: "#e6f4ea", color: "#1e7e34", display: "flex", alignItems: "center", justifyContent: "center" }, children: /* @__PURE__ */ jsx(MessageSquare, { size: 16 }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { style: { fontSize: "13px", fontWeight: "700", margin: 0, color: "#1A1A1A" }, children: "Live Chat" }),
              /* @__PURE__ */ jsx("p", { style: { fontSize: "11px", color: "#888", margin: 0 }, children: "Active" })
            ] })
          ] })
        ] })
      ] }) })
    ] }),
    isModalOpen && /* @__PURE__ */ jsx("div", { style: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1e3, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }, children: /* @__PURE__ */ jsxs("div", { style: { backgroundColor: "white", borderRadius: "8px", width: "500px", maxWidth: "100%", boxShadow: "0 20px 50px rgba(0,0,0,0.2)", display: "flex", flexDirection: "column" }, children: [
      /* @__PURE__ */ jsxs("div", { style: { padding: "20px 24px", borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center" }, children: [
        /* @__PURE__ */ jsx("h3", { style: { margin: 0, fontSize: "15px", fontWeight: "800", color: "#333" }, children: "Raise New Support Ticket" }),
        /* @__PURE__ */ jsx("button", { onClick: () => setIsModalOpen(false), style: { background: "none", border: "none", fontSize: "20px", color: "#aaa", cursor: "pointer" }, children: "\xD7" })
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleCreateTicket, style: { padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }, children: [
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "6px" }, children: [
          /* @__PURE__ */ jsx("label", { style: { fontSize: "12px", fontWeight: "600", color: "#666" }, children: "Subject" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              required: true,
              type: "text",
              value: newTicket.subject,
              onChange: (e) => setNewTicket({ ...newTicket, subject: e.target.value }),
              placeholder: "Summarize the issue",
              style: { padding: "10px 12px", borderRadius: "4px", border: "1px solid #ddd", fontSize: "13px" }
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "6px" }, children: [
          /* @__PURE__ */ jsx("label", { style: { fontSize: "12px", fontWeight: "600", color: "#666" }, children: "Description" }),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              required: true,
              rows: 4,
              value: newTicket.body,
              onChange: (e) => setNewTicket({ ...newTicket, body: e.target.value }),
              placeholder: "Provide more details about your concern...",
              style: { padding: "10px 12px", borderRadius: "4px", border: "1px solid #ddd", fontSize: "13px", resize: "none" }
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "8px" }, children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => setIsModalOpen(false),
              style: { padding: "10px 20px", backgroundColor: "transparent", border: "none", color: "#666", fontSize: "13px", fontWeight: "600", cursor: "pointer" },
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "submit",
              disabled: submitting,
              style: { padding: "10px 24px", backgroundColor: "#A01E35", color: "white", border: "none", borderRadius: "4px", fontSize: "13px", fontWeight: "700", cursor: submitting ? "not-allowed" : "pointer", opacity: submitting ? 0.7 : 1 },
              children: submitting ? "Submitting..." : "Submit Ticket"
            }
          )
        ] })
      ] })
    ] }) })
  ] });
};
var Support_default = Support;
export {
  Support_default as default
};
