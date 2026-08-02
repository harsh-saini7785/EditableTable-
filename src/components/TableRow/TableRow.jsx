import { memo } from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import UndoRoundedIcon from '@mui/icons-material/UndoRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import EditableCell from '../EditableCell/EditableCell';
import { styles } from './style';

const ACTION_WIDTH = 132;

// One virtualized row. `style` comes from react-window and MUST be applied.
function Row({ index, style, data }) {
  const { rows, columns, dirtyIds, onCellCommit, onSave, onUndo, onCancel, startIndex = 0 } = data;
  const row = rows[index];
  if (!row) return null;

  const isDirty = dirtyIds.has(row.id);
  const zebra = index % 2 === 0;

  return (
    <Box
      style={style}
      sx={{
        ...styles.rowBase,
        bgcolor: isDirty
          ? 'rgba(232,179,57,0.06)'
          : zebra
            ? 'transparent'
            : 'rgba(255,255,255,0.012)',
        borderLeft: isDirty ? '2px solid' : '2px solid transparent',
        borderLeftColor: isDirty ? 'primary.main' : 'transparent',
      }}
    >
      {columns.map((col) => (
        <Box key={col.key} sx={{ ...styles.cellWrapper, width: col.width }}>
          <EditableCell
            value={col.key === 'id' ? startIndex + index + 1 : row[col.key]}
            column={col}
            onCommit={(val) => onCellCommit(row.id, col.key, val)}
          />
        </Box>
      ))}

      <Box
        sx={{
          ...styles.actionsWrapperBase,
          width: ACTION_WIDTH,
          opacity: isDirty ? 1 : 0.25,
        }}
      >
        <Tooltip title="Save row">
          <span>
            <IconButton size="small" disabled={!isDirty} onClick={() => onSave(row.id)} color="primary">
              <SaveRoundedIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Undo last change">
          <span>
            <IconButton size="small" disabled={!isDirty} onClick={() => onUndo(row.id)}>
              <UndoRoundedIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Cancel all changes">
          <span>
            <IconButton size="small" disabled={!isDirty} onClick={() => onCancel(row.id)} color="error">
              <CloseRoundedIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
      </Box>
    </Box>
  );
}

export { ACTION_WIDTH };
export default memo(Row);

