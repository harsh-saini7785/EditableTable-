import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded';
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded';
import { Box, InputBase, Typography } from '@mui/material';
import { memo } from 'react';
import { ACTION_WIDTH } from '../TableRow/TableRow';
import { styles } from './style';

function SortIndicator({ dir, order }) {
  if (!dir) return null;
  return (
    <Box sx={styles.sortIndicatorWrapper}>
      {dir === 'asc' ? (
        <ArrowUpwardRoundedIcon sx={styles.sortIcon} />
      ) : (
        <ArrowDownwardRoundedIcon sx={styles.sortIcon} />
      )}
      {order != null && (
        <Typography component="span" sx={styles.sortOrder}>
          {order}
        </Typography>
      )}
    </Box>
  );
}

function TableHeader({ columns, sorts, onToggleSort, filters, onFilterChange }) {
  const sortMap = Object.fromEntries(sorts.map((s, i) => [s.key, { dir: s.dir, order: i + 1 }]));
  const multi = sorts.length > 1;

  return (
    <Box sx={styles.stickyHeader}>
      {/* Labels */}
      <Box sx={styles.labelsContainer}>
        {columns.map((col) => {
          const s = sortMap[col.key];
          return (
            <Box
              key={col.key}
              onClick={(e) => onToggleSort(col.key, e.shiftKey)}
              sx={{
                ...styles.labelCell,
                width: col.width,
                justifyContent: col.align === 'right' ? 'flex-end' : 'flex-start',
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  ...styles.labelText,
                  color: s ? 'primary.main' : 'text.secondary',
                }}
              >
                {col.label}
              </Typography>
              <SortIndicator dir={s?.dir} order={multi ? s?.order : null} />
            </Box>
          );
        })}
        <Box sx={{ ...styles.actionsLabelWrapper, width: ACTION_WIDTH }}>
          <Typography variant="caption" sx={styles.actionsLabelText}>
            Actions
          </Typography>
        </Box>
      </Box>

      {/* Filter inputs */}
      <Box sx={styles.filtersContainer}>
        {columns.map((col) => (
          <Box key={col.key} sx={{ ...styles.filterCell, width: col.width }}>
            <InputBase
              placeholder={col.type === 'number' ? 'e.g. >100' : 'filter…'}
              value={filters[col.key] || ''}
              onChange={(e) => onFilterChange(col.key, e.target.value)}
              sx={{
                ...styles.filterInput,
                '& input': { textAlign: col.align || 'left', p: 0 },
              }}
            />
          </Box>
        ))}
        <Box sx={{ ...styles.actionsSpacer, width: ACTION_WIDTH }} />
      </Box>
    </Box>
  );
}

export default memo(TableHeader);

