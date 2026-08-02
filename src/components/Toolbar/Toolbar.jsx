import DoneAllRoundedIcon from '@mui/icons-material/DoneAllRounded';
import FileDownloadRoundedIcon from '@mui/icons-material/FileDownloadRounded';
import FilterAltOffRoundedIcon from '@mui/icons-material/FilterAltOffRounded';
import LastPageRoundedIcon from '@mui/icons-material/LastPageRounded';
import ViewStreamRoundedIcon from '@mui/icons-material/ViewStreamRounded';
import {
  Box,
  Button, Chip,
  Pagination,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip
} from '@mui/material';
import { memo } from 'react';
import { exportToCsv } from '../../utils/csv';
import { styles } from './style';

function Toolbar({
  columns, derivedRows, totalRows, dirtyCount, sorts, filters,
  mode, onModeChange, page, pageCount, onPageChange,
  onClearFilters, onSaveAll,
}) {
  const activeFilterCount = Object.values(filters).filter((v) => v != null && v !== '').length;
  const hasActive = activeFilterCount > 0 || sorts.length > 0;

  return (
    <Box>
      <Box sx={styles.header}>
        <Box sx={styles.statsContainer}>
          <Chip
            size="small"
            label={`${derivedRows.length.toLocaleString()} / ${totalRows.toLocaleString()} rows`}
            sx={styles.chipRows}
          />
          {dirtyCount > 0 && (
            <Chip
              size="small"
              color="warning"
              label={`${dirtyCount} unsaved`}
              sx={styles.chipUnsaved}
            />
          )}
          {sorts.length > 0 && (
            <Chip size="small" variant="outlined" label={`${sorts.length} sort${sorts.length > 1 ? 's' : ''}`} />
          )}
        </Box>

        <ToggleButtonGroup
          size="small"
          exclusive
          value={mode}
          onChange={(_, v) => v && onModeChange(v)}
        >
          <ToggleButton value="virtual">
            <ViewStreamRoundedIcon sx={{ fontSize: 16, mr: 0.5 }} /> Virtual
          </ToggleButton>
          <ToggleButton value="paginated">
            <LastPageRoundedIcon sx={{ fontSize: 16, mr: 0.5 }} /> Paged
          </ToggleButton>
        </ToggleButtonGroup>

        <Tooltip title="Clear filters & sorting">
          <span>
            <Button
              size="small"
              variant="outlined"
              color="inherit"
              startIcon={<FilterAltOffRoundedIcon />}
              disabled={!hasActive}
              onClick={onClearFilters}
            >
              Clear
            </Button>
          </span>
        </Tooltip>

        <Button
          size="small"
          variant="outlined"
          color="secondary"
          startIcon={<FileDownloadRoundedIcon />}
          onClick={() => exportToCsv('table-export.csv', columns, derivedRows)}
        >
          Export CSV
        </Button>

        <Tooltip title="Commit all unsaved edits">
          <span>
            <Button
              size="small"
              variant="contained"
              color="primary"
              startIcon={<DoneAllRoundedIcon />}
              disabled={dirtyCount === 0}
              onClick={onSaveAll}
              sx={styles.saveButton}
            >
              Save all
            </Button>
          </span>
        </Tooltip>
      </Box>

      {mode === 'paginated' && (
        <Box sx={styles.paginationContainer}>
          <Pagination
            size="small"
            count={pageCount}
            page={page + 1}
            onChange={(_, p) => onPageChange(p - 1)}
            color="primary"
            siblingCount={1}
          />
        </Box>
      )}
    </Box>
  );
}

export default memo(Toolbar);

