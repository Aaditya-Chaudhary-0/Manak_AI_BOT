# AGENTVERSE_INTEGRATION.md — ManakAI

Owner: Dev 2. **Read this before writing any code that touches Agentverse** — this is the doc most likely to
cause confusion between the two backend devs if skipped, because "AI agent" is an overloaded term across this
project (BIS PS material talks about an "AI agent orchestrator" in the generation sense; Fetch.ai Agentverse is
a different thing: an agent hosting/messaging framework built on `uAgents`).

## 1. What Agentverse Actually Is

Fetch.ai Agentverse hosts and coordinates **uAgents** — autonomous services that communicate over a defined
protocol (Almanac registration, agent-to-agent messaging). It is an **orchestration/routing framework**, not a
generative-AI framework. It does not write prose answers. Nothing about using Agentverse reopens the "no LLM
generation" decision in the PRD.

## 2. Its Role in ManakAI (Scoped Narrowly)

Agentverse's job here is **intent routing / retrieval coordination**:

```
User query → Agentverse router agent
                 ├─ classifies intent: standard_search | certification | hallmarking | lab_lookup
                 └─ dispatches to the matching retrieval function in FastAPI
```

It is **not** responsible for:
- Ranking or scoring results (that's `RETRIEVAL_LOGIC.md`, implemented directly in FastAPI/Python).
- Generating any answer text.
- Talking to Qdrant or Postgres directly — those calls stay inside FastAPI's retrieval service; Agentverse only
  decides *which* retrieval function to call.

## 3. MVP Fallback (If Agentverse Integration Slips)

Because Agentverse is an additional moving part with its own hosting/registration requirements, the intent
classification step must have a **plain-FastAPI fallback** that doesn't depend on it:

```python
def classify_intent_fallback(query: str) -> str:
    q = query.lower()
    if re.search(r"is[\s-]?\d{3,6}", q):
        return "standard_search"
    if any(w in q for w in ["certificate", "certification", "licence", "license"]):
        return "certification"
    if any(w in q for w in ["hallmark", "huid", "jeweller", "jewelry", "jewellery"]):
        return "hallmarking"
    if any(w in q for w in ["lab", "laboratory", "testing facility"]):
        return "lab_lookup"
    return "standard_search"  # default
```

Build and ship this fallback first. Wire in Agentverse as an enhancement layer that can replace the fallback's
decision when available — never make Agentverse a hard dependency of the demo path.

## 4. Why This Boundary Matters

If either dev assumes Agentverse does *ranking* or *answer generation*, they'll either duplicate logic that
belongs in `RETRIEVAL_LOGIC.md`, or build a dependency on an external agent registration process that can fail
right before a live demo. Keeping Agentverse strictly at the intent-routing layer, with a local fallback, avoids
both failure modes.

## 5. Integration Checklist

- [ ] Confirm whether Agentverse will actually be wired in for the hackathon demo, or whether the fallback
      classifier alone is sufficient (this is a legitimate scope call for a 2-person team — don't add Agentverse
      just because the README mentions it if the fallback already meets the requirement).
- [ ] If wiring it in: register the router uAgent, define the message schema (query text in → intent label out),
      and keep the FastAPI-side fallback as a live backup, not dead code.
- [ ] Document the final decision here once made, so the PRD/pitch stays accurate.
