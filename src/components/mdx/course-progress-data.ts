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
};
