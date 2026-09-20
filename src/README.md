
# Civic Hub — Mysuru

A lightweight civic issue reporting and tracking web platform designed for Mysuru. It enables residents to lodge hyper-local civic anomalies (such as open potholes, garbage accumulation, and broken streetlights) and monitor real-time municipal resolution stages, while equipping local authorities with an automated triage dashboard backed by geo-spatial clustering and verification confidence scores.

---

## Key Capabilities

- **Guided 5-Step Reporting:** Form flow handling issue categorization, description input, evidence attachment, and map-based coordinate pinning.
- **Persistent Citizen Session:** Automatic prefill of contact parameters (`reporter_name`, `reporter_phone`, `reporter_email`) across report submissions via local client state (`civic_citizen_user`).
- **Automated Triage & Validation:** Heuristic confidence scoring, ward boundary spatial intersection, and duplicate clustering within a 100-meter radius.
- **Real-Time Issue Tracking:** Dynamic status lookup by ticket ID (e.g., `MYS-2026-00001`) displaying audit logs and municipal department routing.
- **Officer Administration Portal:** Session-secured administrative interface (`admin` / `civicadmin2026`) providing category/status filtering, priority overrides (0–3), and live modification audit timestamps (`updated_at`).
- **Portable Tunnel Deployment:** Integrated helper (`portable_api.py`) leveraging Cloudflare tunnels to expose local backend services over a public HTTPS URL without router port forwarding or static IP requirements.

---

## Technology Stack

- **Frontend:** React 18, Vite, React Router v6, Lucide Icons, Custom CSS
- **Backend:** FastAPI, Python 3.11+, SQLAlchemy, Pydantic v2, Uvicorn
- **Database:** SQLite (default local file) / PostgreSQL compatible
- **Tunneling & Transport:** `pycloudflared` (Global TLS/HTTPS reverse tunnel)

---

## Directory Layout

```text
civic-hub/
├── frontend/
│   ├── src/
│   │   ├── components/       # EvidenceUpload, LocationPicker, Navbar, RoutingResult, VerificationCard
│   │   ├── pages/            # Admin, CitizenLogin, Dashboard, Home, ReportIssue, TrackComplaint
│   │   ├── services/         # API abstraction layer
│   │   ├── App.jsx           # Route registry and primary navigation layout
│   │   └── App.css           # Global layout and styling rules
│   ├── package.json
│   └── vite.config.js
└── backend/
    ├── app/
    │   ├── routes/           # complaints.py (CRUD, status patch, metrics)
    │   ├── database.py       # SQLAlchemy engine and session factories
    │   ├── models.py         # Relational database models
    │   ├── schemas.py        # Pydantic schema validation
    │   └── main.py           # FastAPI entrypoint and CORS policy setup
    ├── portable_api.py       # Global Cloudflare tunnel script
    └── requirements.txt
