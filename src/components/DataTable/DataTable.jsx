import { useState, useMemo, useCallback, useRef } from 'react';
import { Box, Paper, useTheme } from '@mui/material';
import { FixedSizeList } from 'react-window';
import TableHeader from '../TableHeader/TableHeader';
import Row, { ACTION_WIDTH } from '../TableRow/TableRow';
import Toolbar from '../Toolbar/Toolbar';
import { useTable } from '../../context/TableContext';
import { useDerivedRows } from '../../hooks/useDerivedRows';
import { COLUMNS } from '../../utils/data';
import { styles } from './style';

const ROW_HEIGHT = 44;
const PAGE_SIZE = 100;

export default function DataTable() {
  const theme = useTheme();
  const { rows, dirtyIds, history, updateRow, undoRow, saveRow, saveAll } = useTable();

  const [filters, setFilters] = useState({});
  const [sorts, setSorts] = useState([]);
  const [mode, setMode] = useState('virtual'); // 'virtual' | 'paginated'
  const [page, setPage] = useState(0);

  const listRef = useRef(null);

  const derived = useDerivedRows(rows, filters, sorts, COLUMNS);

  const totalWidth = useMemo(
    () => COLUMNS.reduce((sum, c) => sum + c.width, 0) + ACTION_WIDTH,
    []
  );

  // ---- handlers ----
  const handleToggleSort = useCallback((key, additive) => {
    setSorts((prev) => {
      const existing = prev.find((s) => s.key === key);
      if (!additive) {
        if (!existing) return [{ key, dir: 'asc' }];
        if (existing.dir === 'asc') return [{ key, dir: 'desc' }];
        return [];
      }
      // additive (shift-click) multi-sort
      if (!existing) return [...prev, { key, dir: 'asc' }];
      if (existing.dir === 'asc') return prev.map((s) => (s.key === key ? { ...s, dir: 'desc' } : s));
      return prev.filter((s) => s.key !== key);
    });
  }, []);

  const handleFilterChange = useCallback((key, value) => {
    setPage(0);
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({});
    setSorts([]);
    setPage(0);
  }, []);

  const handleCellCommit = useCallback((id, key, value) => updateRow(id, { [key]: value }), [updateRow]);

  // Cancel = undo all queued changes for a row.
  const handleCancel = useCallback((id) => {
    const depth = (history[id] || []).length;
    for (let i = 0; i < depth; i++) undoRow(id);
  }, [history, undoRow]);

  // ---- pagination slice ----
  const pageCount = Math.max(1, Math.ceil(derived.length / PAGE_SIZE));
  const visibleRows = mode === 'paginated'
    ? derived.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE)
    : derived;

  const itemData = useMemo(
    () => ({
      rows: visibleRows,
      columns: COLUMNS,
      dirtyIds,
      onCellCommit: handleCellCommit,
      onSave: saveRow,
      onUndo: undoRow,
      onCancel: handleCancel,
      startIndex: mode === 'paginated' ? page * PAGE_SIZE : 0,
    }),
    [visibleRows, dirtyIds, handleCellCommit, saveRow, undoRow, handleCancel, mode, page]
  );

  return (
    <Box sx={styles.container}>
      <Toolbar
        columns={COLUMNS}
        derivedRows={derived}
        totalRows={rows.length}
        dirtyCount={dirtyIds.size}
        sorts={sorts}
        filters={filters}
        mode={mode}
        onModeChange={setMode}
        page={page}
        pageCount={pageCount}
        onPageChange={setPage}
        onClearFilters={handleClearFilters}
        onSaveAll={saveAll}
      />

      <Paper
        elevation={0}
        sx={styles.paper}
      >
        <Box sx={styles.scrollContainer}>
          <Box sx={{ ...styles.tableWrapper, minWidth: totalWidth }}>
            <TableHeader
              columns={COLUMNS}
              sorts={sorts}
              onToggleSort={handleToggleSort}
              filters={filters}
              onFilterChange={handleFilterChange}
            />

            <Box sx={styles.listContainer}>
              {visibleRows.length === 0 ? (
                <Box sx={styles.emptyState}>
                  No rows match the current filters.
                </Box>
              ) : (
                <AutoHeightList
                  listRef={listRef}
                  itemCount={visibleRows.length}
                  itemData={itemData}
                  rowHeight={ROW_HEIGHT}
                />
              )}
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

// Wraps FixedSizeList so it fills the available height via ResizeObserver-free measurement.
function AutoHeightList({ listRef, itemCount, itemData, rowHeight }) {
  const [height, setHeight] = useState(600);
  const measureRef = useCallback((node) => {
    if (node) setHeight(node.getBoundingClientRect().height);
  }, []);

  return (
    <Box ref={measureRef} sx={styles.autoHeightWrapper}>
      <FixedSizeList
        ref={listRef}
        height={height}
        itemCount={itemCount}
        itemSize={rowHeight}
        width="100%"
        itemData={itemData}
        overscanCount={8}
      >
        {Row}
      </FixedSizeList>
    </Box>
  );
}
