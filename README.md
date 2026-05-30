# Aperture — Advanced Editable Data Table

A data-intensive, inline-editable React table built with **Material UI** that handles **10,000+ rows** smoothly via virtual scrolling, with multi-column sorting, per-column filtering, per-row save/cancel/undo, CSV export, and an unsaved-changes guard.

---

## Setup

Requires Node.js 18+.

```bash
npm install
npm run dev      # starts Vite dev server on http://localhost:3000
npm run build    # production build into /dist
npm run preview  # preview the production build
```

---

## Features

### Editing
- **Inline editing** for text (name, email, department, status) and numeric (salary, qty, rating) fields. Click a cell to edit, **Enter** to commit, **Esc** to revert the in-progress edit.
- **Per-row actions**: Save, Undo (steps back through each change), and Cancel (reverts all queued changes for the row). Dirty rows are highlighted with an amber left border.

### Large dataset handling
- Ships with a deterministic 10,000-row generator.
- **Virtual scrolling** via `react-window` (`FixedSizeList`) — only visible rows are mounted, so DOM stays light regardless of dataset size.
- **Pagination fallback** (100 rows/page) toggleable from the toolbar.

### Sorting & filtering
- **Multi-column sort**: click a header to cycle asc → desc → off. **Shift-click** to add secondary/tertiary sort keys (numbered indicators show priority).
- **Per-column filters**: text columns do case-insensitive contains; numeric columns support operators (`>100`, `<=50`, `=4.5`, etc.).
- **Clear** button resets all filters and sorts.

### Bonus
- **Export to CSV** of the currently filtered + sorted view.
- **Unsaved-changes guard** (`beforeunload`) prompts before leaving with pending edits.
- **Context + useReducer** state management (a lightweight Redux-style store).

---

## Approach & decisions

- **State management**: `TableContext` backed by `useReducer`. Rows live in a single store; edits, undo history (a per-row snapshot stack), and a `dirtyIds` set are all reducer-managed. This keeps mutation logic centralized and predictable, mirroring Redux patterns without the dependency.
- **Performance**:
  - Derived rows (filter → sort) are computed in a memoized hook (`useDerivedRows`) keyed on inputs, so re-renders from editing don't re-sort unnecessarily.
  - Rows and cells are `React.memo`-ized; `itemData` is memoized so `react-window` rows only re-render when their slice or dirty state changes.
  - The reducer copies only the touched row (and uses a `Map` index) rather than deep-cloning the dataset.
- **Column-driven design**: a single `COLUMNS` config defines rendering, edit type, alignment, formatting, sort, filter, and export — adding a column is a one-line change.
- **Theme/UX**: a custom MUI dark theme (warm ink + amber accent, Space Grotesk type) for an editorial feel rather than default MUI blue. Sticky header + filter row, zebra striping, and accessible focus states.

---

## Known limitations

- The dataset is generated client-side and held in memory; there is no backend persistence — "Save" commits to the in-memory baseline only.
- Horizontal layout uses fixed pixel column widths (table scrolls horizontally on narrow screens) rather than fully fluid columns.
- Undo is per-row; there is no global cross-row undo timeline.
- Numeric filter parsing supports single operators only (no ranges like `10..20`).
# EditableTable-
