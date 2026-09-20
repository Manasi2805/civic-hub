
# AI & Automated Triage Specification

Civic Hub integrates an automated heuristic triage pipeline to assess, score, and group citizen-lodged complaints before dispatching municipal field workers.

---

## 1. Automated Verification Pipeline

When a complaint is submitted, it is processed through `verification_engine.py` using a multi-factor confidence model:

- **Geo-Coordinate Precision:** Verifies that latitude and longitude conform to Mysuru city coordinates (12.20°N–12.38°N, 76.55°E–76.72°E) and contain decimal precision consistent with authentic mobile GPS readings.
- **Media Header & Metadata Validation:** Checks uploaded image files for valid MIME signatures, acceptable file size thresholds, and basic camera metadata presence to discourage synthetic or stock asset uploads.
- **Text & Severity Analysis:** Evaluates description depth, regex pattern presence, and profanity filtering.
- **Composite Scoring:** Produces a normalized score (0–100%):
  - **$\ge 75\%$:** Marked as `LIKELY GENUINE` and routed directly to the active queue.
  - **$50\% - 74\%$:** Marked as `NEEDS VERIFICATION` for officer overview.
  - **$< 50\%$:** Flagged for manual review to curb spam and fraudulent entries.

---

## 2. Spatial Duplicate Detection & Clustering

To avoid sending multiple repair teams to the same incident:

- **Proximity Threshold:** The backend scans open complaints within a 100-meter radius sharing the same `issue_type` (e.g., potholes, garbage heaps).
- **Incident Grouping:** Subsequent matching reports are linked to the primary ticket and increment its cluster count rather than creating duplicate work orders.
- **Priority Escalation:** Each linked complaint increases the issue's community impact weighting, escalating its priority queue position automatically.

---

## 3. Jurisdiction & Boundary Engine

Using `routing_engine.py` and local ward boundary polygons (`mysuru_boundaries.geojson`):

- Incoming GPS coordinates undergo point-in-polygon spatial queries to assign the responsible ward and municipal department (e.g., Solid Waste Management, Roads & Infrastructure, Electrical).
- Edge coordinates falling near jurisdictional boundaries are flagged with a low-confidence routing marker and routed to a supervisor queue for cross-departmental coordination.
