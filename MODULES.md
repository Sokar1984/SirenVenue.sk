# Modules

A module owns its own directory and exposes exactly one public entry; nothing
imports another module's internals. If something can be a module, write it as a
module with its own on/off (or fail-off) switch. Adding a module is copying the
shape: a directory, one public entry, and a documented switch.

| Module | Owns (paths) | On/off or fail-off | Tickets |
| --- | --- | --- | --- |
| content | content/works.ts, content/legal.ts | — | — |
| page surface | app/layout.tsx, app/page.tsx, app/globals.css, app/not-found.tsx | — | — |
