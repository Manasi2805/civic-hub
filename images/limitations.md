
# Current Limitations & Future Work

- **Ephemeral File Storage:** Image attachments are stored on the local file system; high-concurrency production requires migrating to cloud object storage (e.g., AWS S3 or Cloudflare R2).
- **Heuristic Duplicate Detection:** Current duplicate detection calculates coordinate proximity and keyword matching. Incorporating deep perceptual image hashing (pHash) will improve media duplicate detection.
- **Relational Persistence:** SQLite serves as the default development database; scaling up requires provisioning managed PostgreSQL with PostGIS extensions for spatial query optimization.
- **Offline Mode:** The web app currently requires an active network connection; service workers and PWA caching can be added for offline issue drafting in low-connectivity areas.
