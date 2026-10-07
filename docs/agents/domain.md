# Domain Documentation Configuration

This repository uses a **single-context** domain documentation layout.

## Locations

- **Glossary**: [`GLOSSARY.md`](../../GLOSSARY.md) (or [`CONTEXT.md`](../../CONTEXT.md)) at the repository root. Defines domain entities, concepts, and ubiquitous vocabulary.
- **Architectural Decision Records (ADRs)**: [`docs/adr/`](../adr/) at the repository root. Stores immutable architectural records.

## Consumer Rules

1. **Check Before Design**: Before proposing new interfaces or altering existing domain models, review `CONTEXT.md` / `GLOSSARY.md` and existing ADRs in `docs/adr/`.
2. **Respect Decided Seams**: Do not re-litigate decisions documented in ADRs without explicitly identifying a strong operational or architectural reason.
3. **Keep Current**: When introducing new domain models or deepening existing modules, update `GLOSSARY.md` / `CONTEXT.md` inline to keep agent and human alignment intact.
