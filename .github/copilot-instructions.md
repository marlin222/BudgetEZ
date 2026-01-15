# Copilot / AI agent instructions for BudgetEZ

Purpose: Help AI coding agents become productive quickly in this repository.

Quick summary
- Repo currently contains only the [README.md](README.md) with a one-line project description.
- There are no discovered source files, package manifests, or CI configs. If you expect code, ask the maintainer where it lives.

How to start (actionable checklist)
- Inspect root for language manifests: `package.json`, `pyproject.toml`, `requirements.txt`, `go.mod`, `Cargo.toml`. Use these to infer runtime and build commands.
- Look for app layout folders: `src/`, `app/`, `backend/`, `frontend/`, `ios/`, `android/` to identify components and service boundaries.
- If you find `package.json`: assume Node/JS/React—use `npm ci` or `yarn install`, then `npm run dev` or `npm start`.
- If you find Python manifests: prefer `poetry` if `pyproject.toml` contains it, otherwise `pip install -r requirements.txt` and run tests with `pytest`.
- If you find Dockerfile or `docker-compose.yml`: prefer reproducing run steps via Docker for consistent environment.

Architecture & discovery rules (what to look for and why)
- Use filenames and directory layout as the primary signal for architecture. Examples:
  - `frontend/` or `web/` + `package.json` → web SPA (React/Vue). Check `src/components` and `src/pages` for routing and UI patterns.
  - `backend/` or `api/` + `requirements.txt`/`pyproject.toml` → Python service. Look for `app/` or `main.py` for entrypoints and `models/` for data shape.
  - `mobile/`, `ios/`, `android/` → platform-specific clients; look for CocoaPods (`Podfile`) or Gradle (`build.gradle`).

Project-specific conventions discovered
- Only a top-level [README.md](README.md) exists and contains no build instructions—treat this repository as scaffold/missing-source until the user indicates otherwise.
- When code is added, prefer relying on project-local scripts (e.g., `scripts/`, `Makefile`, `package.json` `scripts`) instead of guessing commands.

Integration & infra points to check
- Look for `.env` or `.env.example` (runtime secrets), `Dockerfile`, `docker-compose.yml`, `firebase.json`, `netlify.toml`, `Procfile`.
- Look for CI config: `.github/workflows/`, `.gitlab-ci.yml`, or other pipeline definitions to discover test/build commands.

Editing / PR guidance for AI agents
- If proposing changes, include a brief summary at the top of the PR describing the intent and manual verification steps.
- If tests or linting are added, include commands to run them locally in the PR description.

If you cannot find source files
- Ask the repository owner where the app source lives (monorepo subfolder? private submodule?). Provide a short list of filenames you searched for and their absence (e.g., `package.json`, `pyproject.toml`, `src/`, `backend/`).

References
- Current repo README: [README.md](README.md)

What I changed
- Added this file because no existing `.github/copilot-instructions.md` was found. If you have an existing agent guide, paste it here and I will merge and condense it.

Questions for the maintainer
- Where is the application source code (if present)?
- Preferred language/runtime and any required environment variables or DB credentials to run locally?

— End of instructions —
