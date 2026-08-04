export type CourseProgressItem = {
  id: string;
  label: string;
  phase: string;
};

/**
 * Checklist data lives here rather than inline in MDX: next-mdx-remote
 * strips JS expression props from MDX by default (a deliberate guard
 * against executing arbitrary JS in untrusted content), so a `<CourseProgress
 * items={[...]} />` prop would silently compile away. A plain string
 * `courseId` looked up here sidesteps that entirely.
 */
export const courseChecklists: Record<string, CourseProgressItem[]> = {
  "genai-0-to-hero": [
    { id: "p0-setup", phase: "Phase 0 — Tooling setup", label: "Python idioms + NumPy array thinking" },
    { id: "p0-pytorch", phase: "Phase 0 — Tooling setup", label: "Install PyTorch, run the 60-minute blitz" },
    { id: "p0-build", phase: "Phase 0 — Tooling setup", label: "Build: notebook loading a CSV, NumPy math, a matplotlib plot" },
    { id: "p1-linalg", phase: "Phase 1 — Just-enough math", label: "3Blue1Brown — Essence of Linear Algebra" },
    { id: "p1-calc", phase: "Phase 1 — Just-enough math", label: "3Blue1Brown — Essence of Calculus" },
    { id: "p1-prob", phase: "Phase 1 — Just-enough math", label: "Probability: distributions, sampling, expectation, softmax" },
    { id: "p2-micrograd-video", phase: "Phase 2 — Neural networks from scratch", label: "Karpathy — micrograd video" },
    { id: "p2-micrograd-build", phase: "Phase 2 — Neural networks from scratch", label: "Build: type out micrograd yourself, then modify it" },
    { id: "p2-makemore", phase: "Phase 2 — Neural networks from scratch", label: "Karpathy — makemore (first 2–3 videos)" },
    { id: "p2-checkpoint", phase: "Phase 2 — Neural networks from scratch", label: "Checkpoint: explain backprop through a two-layer net out loud" },
    { id: "p3-mechanics", phase: "Phase 3 — Deep learning foundations", label: "Training mechanics: losses, optimizers, LR, batching, regularization" },
    { id: "p3-blocks", phase: "Phase 3 — Deep learning foundations", label: "Core building blocks: embeddings, tokenization, activations, normalization" },
    { id: "p3-reference", phase: "Phase 3 — Deep learning foundations", label: "d2l.ai or fast.ai as a lookup / parallel track" },
    { id: "p3-build", phase: "Phase 3 — Deep learning foundations", label: "Build: train a small network in pure PyTorch (MNIST or text classifier)" },
    { id: "p4-gpt-video", phase: "Phase 4 — Transformers & LLMs from scratch", label: "Karpathy — Let's build GPT: from scratch, in code, spelled out" },
    { id: "p4-tokenizer", phase: "Phase 4 — Transformers & LLMs from scratch", label: "Karpathy — Let's build the GPT Tokenizer" },
    { id: "p4-paper", phase: "Phase 4 — Transformers & LLMs from scratch", label: "Read: Attention Is All You Need (after building GPT)" },
    { id: "p4-nanogpt", phase: "Phase 4 — Transformers & LLMs from scratch", label: "Study and tinker with nanoGPT" },
    { id: "p4-build", phase: "Phase 4 — Transformers & LLMs from scratch", label: "Build: train your own tiny GPT on a corpus you care about" },
    { id: "p4-checkpoint", phase: "Phase 4 — Transformers & LLMs from scratch", label: "Checkpoint: draw the transformer from memory, explain attention" },
    { id: "p5-finetune", phase: "Phase 5 — Modern generative AI", label: "Fine-tuning & adaptation: full fine-tune vs. LoRA/PEFT" },
    { id: "p5-alignment", phase: "Phase 5 — Modern generative AI", label: "Alignment concepts: RLHF / instruction-tuning / DPO" },
    { id: "p5-plumbing", phase: "Phase 5 — Modern generative AI", label: "Practical plumbing: RAG, embeddings/vector search, agents" },
    { id: "p5-diffusion", phase: "Phase 5 — Modern generative AI", label: "Optional: diffusion models (forward noising → learned denoising)" },
    { id: "p5-build", phase: "Phase 5 — Modern generative AI", label: "Build: LoRA fine-tune an open model + a minimal RAG pipeline" },
    { id: "p6-track", phase: "Phase 6 — Capstone & specialization", label: "Pick one track: LLMs/text, image generation, or applied GenAI products" },
    { id: "p6-project", phase: "Phase 6 — Capstone & specialization", label: "Build one real end-to-end project you'd show someone" },
    { id: "p6-current", phase: "Phase 6 — Capstone & specialization", label: "Stay current: follow practitioners, skim papers, reimplement techniques" },
  ],
  "rag-local-open-source": [
    { id: "p0-budget", phase: "Phase 0 — Know your constraint", label: "nvidia-smi baseline: know your real VRAM budget (~7.3 GB, not 8192)" },
    { id: "p0-tier", phase: "Phase 0 — Know your constraint", label: "Settle the model tier: 7–9B at Q4_K_M" },
    { id: "p0-turing", phase: "Phase 0 — Know your constraint", label: "Turing gotchas: fp16 not bf16, sdpa not FlashAttention 2" },
    { id: "p0-env", phase: "Phase 0 — Know your constraint", label: "Set OLLAMA_FLASH_ATTENTION, KV_CACHE_TYPE=q8_0, NUM_PARALLEL=1" },
    { id: "p0-runtime", phase: "Phase 0 — Know your constraint", label: "Start the Ollama daemon, pull a chat model and an embedding model" },
    { id: "p0-speed", phase: "Phase 0 — Know your constraint", label: "Measure tokens/second with --verbose (expect ~35–55 on an 8B)" },
    { id: "p0-checkpoint", phase: "Phase 0 — Know your constraint", label: "Checkpoint: full GPU offload confirmed, works with the network unplugged" },
    { id: "p1-corpus", phase: "Phase 1 — The naive pipeline", label: "Pick a small corpus you can verify by hand" },
    { id: "p1-build", phase: "Phase 1 — The naive pipeline", label: "Build: chunk → embed → retrieve → stuff, no framework" },
    { id: "p1-inspect", phase: "Phase 1 — The naive pipeline", label: "Print and read the retrieved chunks on every query" },
    { id: "p1-paper", phase: "Phase 1 — The naive pipeline", label: "Read: the original RAG paper (arXiv:2005.11401)" },
    { id: "p2-embeddings", phase: "Phase 2 — Understand each moving part", label: "Embeddings: similarity, symmetric vs. asymmetric, query/passage prefixes" },
    { id: "p2-chunking", phase: "Phase 2 — Understand each moving part", label: "Chunking: fixed vs. recursive vs. structural vs. semantic, and overlap" },
    { id: "p2-index", phase: "Phase 2 — Understand each moving part", label: "Vector stores: flat vs. HNSW, and the recall/latency trade" },
    { id: "p2-context", phase: "Phase 2 — Understand each moving part", label: "Context assembly + 'Lost in the Middle' (arXiv:2307.03172)" },
    { id: "p2-harness", phase: "Phase 2 — Understand each moving part", label: "Build: experiment harness with switches for chunk size, model, k" },
    { id: "p3-golden", phase: "Phase 3 — Evaluation, before optimisation", label: "Write a 30–50 question golden set with the source chunks" },
    { id: "p3-split", phase: "Phase 3 — Evaluation, before optimisation", label: "Measure retrieval (recall@k, MRR) separately from generation" },
    { id: "p3-ceiling", phase: "Phase 3 — Evaluation, before optimisation", label: "Establish the ceiling: generate with hand-fed correct chunks" },
    { id: "p3-script", phase: "Phase 3 — Evaluation, before optimisation", label: "Build: eval.py, committed alongside the golden set" },
    { id: "p4-rerank", phase: "Phase 4 — Make retrieval actually good", label: "Add bge-reranker-base on CPU (retrieve 25–50, rerank, keep 4–5)" },
    { id: "p4-hybrid", phase: "Phase 4 — Make retrieval actually good", label: "Hybrid search: BM25 + dense, fused with RRF" },
    { id: "p4-query", phase: "Phase 4 — Make retrieval actually good", label: "Query transformation: rewriting, multi-query, HyDE" },
    { id: "p4-small-to-big", phase: "Phase 4 — Make retrieval actually good", label: "Small-to-big retrieval (embed small, return the parent section)" },
    { id: "p4-context-headers", phase: "Phase 4 — Make retrieval actually good", label: "Contextual chunk headers at index time" },
    { id: "p4-metadata", phase: "Phase 4 — Make retrieval actually good", label: "Metadata filtering (source, date, section, type)" },
    { id: "p4-benchmark", phase: "Phase 4 — Make retrieval actually good", label: "Re-run the eval after each change; record the numbers" },
    { id: "p5-citations", phase: "Phase 5 — Generation, grounding, serving", label: "Citations per claim, verified programmatically" },
    { id: "p5-refusal", phase: "Phase 5 — Generation, grounding, serving", label: "Teach it to decline: instructions, example, similarity floor" },
    { id: "p5-structured", phase: "Phase 5 — Generation, grounding, serving", label: "Structured output via JSON mode or GBNF grammars" },
    { id: "p5-budget", phase: "Phase 5 — Generation, grounding, serving", label: "Context budgeting against the KV cache + streaming responses" },
    { id: "p5-serving", phase: "Phase 5 — Generation, grounding, serving", label: "Compare Q4_K_M vs. Q5_K_M on your eval set (skip vLLM at 8 GB)" },
    { id: "p6-ingestion", phase: "Phase 6 — Ship one real thing", label: "Real ingestion: PDFs, tables, scans — read the extracted text" },
    { id: "p6-incremental", phase: "Phase 6 — Ship one real thing", label: "Incremental indexing: hash chunks, re-embed only what changed" },
    { id: "p6-ui", phase: "Phase 6 — Ship one real thing", label: "A low-friction interface (CLI or Streamlit)" },
    { id: "p6-logging", phase: "Phase 6 — Ship one real thing", label: "Log queries + retrieved chunks; mine them for new eval questions" },
    { id: "p6-deep", phase: "Phase 6 — Ship one real thing", label: "Go deep on one: bge-small fine-tune, QLoRA on the 8B, agentic retrieval, GraphRAG" },
  ],
};
