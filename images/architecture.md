
# System Architecture

## High-Level Topology

Civic Hub implements a decoupled client-server architecture designed around asynchronous event reporting, localized geo-spatial clustering, and administrative oversight.
Component Breakdown

1. **Frontend Presentation (React 18 + Vite):**
   - Single Page Application (SPA) utilizing React Router v6.
   - Client-side persistence via `localStorage` (`civic_citizen_user`) to enable session continuity and form pre-fills across visits.
   - Dynamic map integration with coordinate selection and radius-based clustering visualization.

2. **Backend Services (FastAPI + SQLAlchemy):**
   - RESTful API with route prefix `/api/complaints`.
   - Asynchronous request processing and CORS configuration allowing local and remote origins.
   - Lifecycle event logging with automatic `created_at` and `updated_at` timestamps for auditability.

3. **Networking & Public Deployment:**
   - Integrated tunnel handler (`portable_api.py`) leveraging Cloudflare tunnels to expose local backend services over HTTPS without static IP or port-forwarding requirements.
