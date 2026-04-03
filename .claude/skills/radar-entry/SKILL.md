---
name: radar-entry
description: Adds new blip entries and new editions to the technology radar at data/radar.json. Triggers on "add blip", "add to radar", "new radar entry", "add technology to radar", "create radar edition", "new edition", "radar entry", or any request to record or document a technology, tool, technique, or platform on Kristian Garza's personal technology radar.
---

## Workflow

### Adding a blip to an existing edition

1. Read `references/schema.md` to recall field requirements
2. Ask the user for the following details:
   - **name** — the technology, tool, technique, or platform name
   - **quadrant** — one of: `techniques`, `tools`, `platforms`, `languages-and-frameworks`
   - **ring** — one of: `adopt`, `trial`, `assess`, `hold`
   - **isNew** — is this the first time this entry appears on the radar? (true/false)
   - **movement** — one of: `moved_in`, `moved_out`, `no_change`
   - **previousRing** — required if movement is `moved_in` or `moved_out`
   - **links** — any relevant URLs (can be empty)
   - **tags** — suggest tags based on the technology type
3. Ask for raw notes or thoughts about the technology — what they think of it, how they use it, what's good or bad about it
4. Read `references/voice-guide.md` — generate a description in Kristian's voice from the raw notes
5. Present the generated description and ask for approval or feedback; iterate until approved
6. Construct the complete blip JSON object using schema.md
7. Insert the blip into the correct edition's `blips` array in `data/radar.json`
8. Show the inserted JSON to confirm

### Adding a new edition

1. Read `references/schema.md` to recall edition field requirements
2. Ask for the following details:
   - **id** — in `YYYY-MM` format
   - **version** — version string
   - **releaseDate** — release date
   - **description** — brief description of this edition
3. Construct the edition object with an empty `blips` array
4. Append to the `editions` array in `data/radar.json`
5. Ask if the user wants to add blips to this new edition now; if yes, follow the blip workflow above

## Notes

- Always read `schema.md` before constructing JSON to avoid field errors
- Always read `voice-guide.md` before generating descriptions
- The `data/radar.json` file is the only data file — edit it directly
- Preserve existing JSON formatting (2-space indent, no trailing commas)
- After inserting, show only the new JSON object (not the whole file) to confirm
