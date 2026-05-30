import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded';
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded';
import { Box, InputBase, Typography } from '@mui/material';
import { memo } from 'react';
import { ACTION_WIDTH } from './TableRow';

function SortIndicator({ dir, order }) {
  if (!dir) return null;
  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', ml: 0.5, color: 'primary.main' }}>
      {dir === 'asc' ? (
        <ArrowUpwardRoundedIcon sx={{ fontSize: 14 }} />
      ) : (
        <ArrowDownwardRoundedIcon sx={{ fontSize: 14 }} />
      )}
      {order != null && (
        <Typography component="span" sx={{ fontSize: 10, fontWeight: 700, ml: 0.2 }}>
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
    <Box sx={{ position: 'sticky', top: 0, zIndex: 2 }}>
      {/* Labels */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'stretch',
          bgcolor: '#11141c',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        {columns.map((col) => {
          const s = sortMap[col.key];
          return (
            <Box
              key={col.key}
              onClick={(e) => onToggleSort(col.key, e.shiftKey)}
              sx={{
                width: col.width,
                flexShrink: 0,
                px: 1.5,
                py: 1.25,
                display: 'flex',
                alignItems: 'center',
                justifyContent: col.align === 'right' ? 'flex-end' : 'flex-start',
                cursor: 'pointer',
                userSelect: 'none',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.03)' },
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: s ? 'primary.main' : 'text.secondary',
                  fontSize: '0.68rem',
                }}
              >
                {col.label}
              </Typography>
              <SortIndicator dir={s?.dir} order={multi ? s?.order : null} />
            </Box>
          );
        })}
        <Box sx={{ width: ACTION_WIDTH, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'text.secondary', fontSize: '0.68rem' }}>
            Actions
          </Typography>
        </Box>
      </Box>

      {/* Filter inputs */}
      <Box
        sx={{
          display: 'flex',
          bgcolor: '#0e1118',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        {columns.map((col) => (
          <Box key={col.key} sx={{ width: col.width, flexShrink: 0, p: 0.75 }}>
            <InputBase
              placeholder={col.type === 'number' ? 'e.g. >100' : 'filter…'}
              value={filters[col.key] || ''}
              onChange={(e) => onFilterChange(col.key, e.target.value)}
              sx={{
                width: '100%',
                fontSize: '0.78rem',
                px: 1,
                py: 0.25,
                borderRadius: 1,
                bgcolor: 'rgba(255,255,255,0.04)',
                color: 'text.primary',
                '& input': { textAlign: col.align || 'left', p: 0 },
                '& input::placeholder': { color: 'text.secondary', opacity: 0.6 },
              }}
            />
          </Box>
        ))}
        <Box sx={{ width: ACTION_WIDTH, flexShrink: 0 }} />
      </Box>
    </Box>
  );
}

export default memo(TableHeader);
