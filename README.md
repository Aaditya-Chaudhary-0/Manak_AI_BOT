# BIS Intelligence Assistant

An AI-powered, source-backed assistant for discovering, understanding, and navigating Indian Standards and BIS services.

> **Smart India Hackathon 2026 — Problem Statement 26107**

## 🚀 What is this?

The BIS Intelligence Assistant makes complex BIS information easier to find and understand.

Instead of manually searching across standards, documents, certification information, and service pages, a user can describe a product or ask a normal-language question. The system retrieves relevant BIS evidence, explains the result, and shows the official source used.

**Core idea:**

`Ask → Understand → Retrieve BIS Evidence → Reason → Answer → Verify`

BIS remains the authority. The AI is a decision-support and information-discovery layer, not an official certification or legal decision-maker.

## 🎯 Problem

People often know their **product or problem**, but they do not know:

- Which Indian Standard (IS) applies
- Whether a standard is current
- What certification path may be relevant
- What testing or compliance information to check
- Where the authoritative BIS information is located

The information exists, but users may need to search multiple pages/documents and interpret technical information themselves.

### Example

A manufacturer can ask:

> "I manufacture LED bulbs. Which BIS standards should I check?"

The assistant can identify likely standards, explain why they match, and provide the supporting BIS source.

## ✨ Core Features

This intermediate-level implementation focuses on 10 features:

1. **AI BIS Assistant** — conversational BIS question answering with context.
2. **BIS Standards Search** — search by IS number, product name, keyword, or phrase.
3. **Product → Standard Recommendation** — recommend likely standards from product details.
4. **Evidence & Citation System** — show source, evidence, confidence, and verification link.
5. **Standard Detail Page** — structured view of scope, status/version, amendments, related information, and sources.
6. **Certification Guidance** — explain the relevant certification workflow using official BIS evidence.
7. **English + Hindi Support** — bilingual UI and assistant responses.
8. **User Dashboard** — quick actions, recent questions, searches, and saved standards.
9. **History + Saved Standards** — revisit previous conversations and bookmarked standards.
10. **Admin Dashboard** — query analytics, low-confidence review queue, feedback, and knowledge-source health.

## 🧠 Why this is different from a normal search page

BIS already provides a **Know Your Standard** facility for searching standards using an IS number or keyword/product name and for viewing related standard information.

The value of this project is the **intelligence layer** around that information:

| Existing search experience | BIS Intelligence Assistant |
|---|---|
| User needs to know what to search | User can describe the problem/product naturally |
| Search results require interpretation | AI explains relevant results |
| Keyword-centric discovery | Natural-language + semantic retrieval |
| Manual comparison | Ranked recommendations with reasons |
| User has to trace documents | Evidence/citation panel is shown with the answer |
| Separate pages can require navigation | Guided workflows for BIS tasks |

The product should therefore be positioned as an **intelligent interface and evidence layer over BIS knowledge**, not as a replacement for the BIS website.

## 🏗️ High-Level Architecture

```text
┌───────────────┐
│     User      │
└───────┬───────┘
        │
        ▼
┌─────────────────────────┐
│ React + TypeScript UI   │
│ Dashboard / Chat / Search│
└───────────┬─────────────┘
            │ HTTPS/REST
            ▼
┌─────────────────────────┐
│ Python + FastAPI        │
│ Auth / APIs / Orchestrator│
└───────────┬─────────────┘
            │
            ▼
      ┌───────────────┐
      │ Intent Router │
      └───────┬───────┘
              │
       ┌──────┴────────┐
       ▼               ▼
┌─────────────┐  ┌─────────────────┐
│ Standards   │  │ RAG / AI Agent  │
│ Search      │  │ Retrieval Flow  │
└──────┬──────┘  └────────┬────────┘
       │                  │
       └─────────┬────────┘
                 ▼
      ┌──────────────────────┐
      │ PostgreSQL + pgvector│
      │ BIS metadata/evidence│
      └──────────┬───────────┘
                 │
                 ▼
      ┌──────────────────────┐
      │ Gemini / OpenAI API  │
      │ grounded generation  │
      └──────────┬───────────┘
                 │
                 ▼
      ┌──────────────────────┐
      │ Answer + Citations   │
      │ + Confidence         │
      └──────────────────────┘
```

## 🛠️ Suggested Tech Stack

### Frontend
- React
- Vite
- TypeScript
- Tailwind CSS
- Recharts

### Backend
- Python
- FastAPI

### AI
- Gemini or OpenAI API
- Embedding model for semantic retrieval
- Small tool-using orchestrator/agent

### Data
- PostgreSQL
- pgvector
- PyMuPDF for PDF parsing when needed

### Auth & Security
- JWT-based authentication
- bcrypt/Argon2 password hashing
- Role-based access control for admin endpoints
- HTTPS/TLS
- Rate limiting

### Deployment
- Frontend: Vercel or equivalent
- Backend: Dockerized FastAPI
- PostgreSQL/pgvector: managed PostgreSQL or equivalent

## 📁 Suggested Repository Structure

```text
bis-intelligence-assistant/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── i18n/
│   │   └── types/
│   └── package.json
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── models/
│   │   ├── services/
│   │   ├── rag/
│   │   ├── agent/
│   │   ├── auth/
│   │   └── main.py
│   └── requirements.txt
│
├── data/
│   ├── raw/
│   ├── processed/
│   └── benchmark/
│
├── docs/
│   ├── architecture/
│   ├── api/
│   └── product/
│
├── scripts/
├── tests/
├── .env.example
├── README.md
└── BIS_Intelligence_Assistant_PRD.md
```

## 🔑 Product Principles

1. **BIS is authoritative.**
2. **Retrieve before generating.**
3. **Show evidence for factual answers.**
4. **Never invent unavailable standards, certification decisions, or lab information.**
5. **Flag uncertainty and outdated information.**
6. **Keep user data isolated by account and role.**
7. **Do not reproduce restricted BIS standard content beyond permitted excerpts/metadata.**

## 🧪 Testing Strategy

Create a benchmark set of representative questions covering:

- Standards
- Certification
- Product-to-standard matching
- Consumer questions
- Hindi questions
- Ambiguous questions
- Low-evidence questions

Measure:

- Retrieval precision/recall
- Evidence support
- Citation correctness
- Recommendation quality
- Response latency
- UI/API reliability
- Security controls

## 🎬 Recommended Demo

The strongest demo path is:

1. Enter a **product description**, not an IS number.
2. Show ranked recommended standards.
3. Open **"Why this standard?"**
4. Display official BIS evidence.
5. Ask a certification/testing follow-up.
6. Switch English → Hindi.
7. Show the admin low-confidence/review queue.

## 🚫 Out of Scope for the Intermediate MVP

Do not spend early development time on:

- Voice assistant/calling
- Blockchain
- Custom LLM training
- Multi-agent swarm
- Browser extension
- Huge standalone mobile application
- Unauthorized/fake real-time BIS APIs
- Large-scale multilingual expansion before English/Hindi quality is good

## 📚 Official References

- BIS — Know Your Standard: https://www.bis.gov.in/know-your-standard/
- BIS — Apply for a License: https://www.bis.gov.in/apply-for-a-license/
- BIS — Product Certification Process: https://www.bis.gov.in/product-certification/product-certification-process/
- BIS — BIS Apps / BIS Care: https://www.bis.gov.in/bis-apps/

## 📄 Documentation

The complete implementation-oriented product requirements are available in:

**`BIS_Intelligence_Assistant_PRD.md`**

