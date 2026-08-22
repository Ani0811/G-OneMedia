# G-One Media — Database & Table Architectures

This directory contains all SQL scripts for setting up, seeding, and administering the G-One Media Supabase database. The files are organized logically by their specific domain and use case.

## 📂 Folder Structure

```
database/
├── core/
│   ├── schema.sql              # Base schema creation (tables: projects, case studies, bookings, payments, leads)
│   ├── seed_portfolio.sql      # Seeds standard portfolio project card listings
│   └── seed_case_studies.sql   # Seeds detailed case study profiles for routing
│
├── bookings/
│   └── bookings_setup.sql      # Management queries and filters for standard callback bookings
│
├── reviews/
│   └── reviews_setup.sql       # Reviews table setup, index, RLS policies, and storage bucket setup instructions
│
├── chat/
│   └── chat_agent_setup.sql    # Tables (chat_leads, chat_contacts, chat_refund_requests) populated by AI Chat Agent
│
├── rag/
│   └── rag_setup.sql           # pgvector extension configuration, documents table, and match_documents RPC
│
├── explore/
│   └── explore_queries.sql     # Collection of diagnostics, counts, column checks, and database size stats
│
└── README.md                   # This file
```

---

## ⚡ Database Setup Order

Paste and run the `.sql` scripts directly in the **Supabase SQL Editor** in the following sequence:

1. **`core/schema.sql`** — Initializes the foundation tables, UUID structures, and base permissions.
2. **`core/seed_portfolio.sql`** — Loads the project records.
3. **`core/seed_case_studies.sql`** — Loads the rich metadata and metrics for the slug routes.
4. **`reviews/reviews_setup.sql`** — Sets up the client reviews table and lists the bucket policies for profile image storage uploads.
5. **`chat/chat_agent_setup.sql`** — Deploys the logging tables for contacts, leads, and refunds initiated by the AI chat agent.
6. **`rag/rag_setup.sql`** — Activates `pgvector` and structures the semantic context mapping store.

---

## 🧪 Admin & Query Inspection

For ongoing troubleshooting and analytics (such as counting rows, identifying tables, inspecting columns, or checking database sizes), run the scripts inside **`explore/explore_queries.sql`**.

---

## 🔗 Supabase Project Reference

- **API Endpoint:** `https://thsqjwkbqaewdyymeybd.supabase.co`
- **Dashboard Access:** [Supabase Console - Project Dashboard](https://supabase.com/dashboard/project/thsqjwkbqaewdyymeybd)
