- Keep comments short and precise, related to the codebase and not user's prompt
- Don't test the project yourself, end user will do testing on their end
  themseleves
- Follow existing project structure
  - Use shadcn components whenever possible, add new components if needed
  - Do server-side-rendering, minimize client-side JavaScript and fetch()
    requests, unless not practical
  - Use zod for requests validation
- If you intend to write descriptions and other text related to UI, follow these
  standards:
  - Dots should not be used for separating info inline. Use commas instead or
    adjust the layout.
  - Em dashes should be used rarely.
  - Don't write text in UPPER CASE.
  - Date and time should not be American, a good format is HH:MM:SS for time and DD.MM.YYYY for date.
- If appropriate, suggest user to commit the changes with suggested commit
  message. Do not commit yourself - always ask first.
