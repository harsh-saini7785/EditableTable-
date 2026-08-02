import { createContext, useContext, useReducer, useMemo, useCallback } from 'react';
import { generateRows } from '../utils/data';

const TableContext = createContext(null);

const ROW_COUNT = 10000;

function init() {
  const rows = generateRows(ROW_COUNT);
  const byId = new Map(rows.map((r) => [r.id, r]));
  return {
    rows,
    byId,
    // per-row history stack for undo: id -> array of previous snapshots
    history: {},
    // ids touched since last "saved" baseline
    dirtyIds: new Set(),
  };
}

function reducer(state, action) {
  switch (action.type) {
    case 'UPDATE_ROW': {
      const { id, changes } = action;
      const idx = state.rows.findIndex((r) => r.id === id);
      if (idx === -1) return state;
      const prev = state.rows[idx];
      const next = { ...prev, ...changes };

      const rows = state.rows.slice();
      rows[idx] = next;
      const byId = new Map(state.byId);
      byId.set(id, next);

      const history = { ...state.history };
      history[id] = [...(history[id] || []), prev];

      const dirtyIds = new Set(state.dirtyIds);
      dirtyIds.add(id);

      return { ...state, rows, byId, history, dirtyIds };
    }

    case 'UNDO_ROW': {
      const { id } = action;
      const stack = state.history[id];
      if (!stack || stack.length === 0) return state;

      const restored = stack[stack.length - 1];
      const idx = state.rows.findIndex((r) => r.id === id);
      if (idx === -1) return state;

      const rows = state.rows.slice();
      rows[idx] = restored;
      const byId = new Map(state.byId);
      byId.set(id, restored);

      const history = { ...state.history };
      history[id] = stack.slice(0, -1);

      const dirtyIds = new Set(state.dirtyIds);
      if (history[id].length === 0) {
        delete history[id];
        dirtyIds.delete(id);
      }

      return { ...state, rows, byId, history, dirtyIds };
    }

    case 'SAVE_ROW': {
      // Commit: clear this row's history + dirty flag (baseline = current).
      const { id } = action;
      const history = { ...state.history };
      delete history[id];
      const dirtyIds = new Set(state.dirtyIds);
      dirtyIds.delete(id);
      return { ...state, history, dirtyIds };
    }

    case 'SAVE_ALL': {
      return { ...state, history: {}, dirtyIds: new Set() };
    }

    default:
      return state;
  }
}

export function TableProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, init);

  const updateRow = useCallback((id, changes) => dispatch({ type: 'UPDATE_ROW', id, changes }), []);
  const undoRow = useCallback((id) => dispatch({ type: 'UNDO_ROW', id }), []);
  const saveRow = useCallback((id) => dispatch({ type: 'SAVE_ROW', id }), []);
  const saveAll = useCallback(() => dispatch({ type: 'SAVE_ALL' }), []);

  const value = useMemo(
    () => ({
      rows: state.rows,
      history: state.history,
      dirtyIds: state.dirtyIds,
      updateRow,
      undoRow,
      saveRow,
      saveAll,
    }),
    [state.rows, state.history, state.dirtyIds, updateRow, undoRow, saveRow, saveAll]
  );

  return <TableContext.Provider value={value}>{children}</TableContext.Provider>;
}

export function useTable() {
  const ctx = useContext(TableContext);
  if (!ctx) throw new Error('useTable must be used within a TableProvider');
  return ctx;
}

