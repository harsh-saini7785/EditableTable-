import { memo, useState, useEffect, useRef } from 'react';
import { Box, InputBase, Typography } from '@mui/material';
import { styles } from './style';

// Inline editable cell. Click to edit; Enter commits, Esc reverts the in-progress edit.
function EditableCell({ value, column, onCommit }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef(null);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select?.();
    }
  }, [editing]);

  const commit = () => {
    setEditing(false);
    if (column.type === 'number') {
      const num = parseFloat(draft);
      if (!Number.isNaN(num) && num !== value) onCommit(num);
      else setDraft(value);
    } else if (draft !== value) {
      onCommit(draft);
    }
  };

  const cancel = () => {
    setDraft(value);
    setEditing(false);
  };

  const display = column.format ? column.format(value) : value;

  if (!column.editable) {
    return (
      <Typography
        variant="body2"
        sx={{ ...styles.nonEditableText, textAlign: column.align || 'left' }}
      >
        {display}
      </Typography>
    );
  }

  if (editing) {
    return (
      <InputBase
        inputRef={inputRef}
        value={draft}
        type={column.type === 'number' ? 'number' : 'text'}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') commit();
          else if (e.key === 'Escape') cancel();
        }}
        sx={{
          ...styles.editingInputBase,
          '& input': { textAlign: column.align || 'left', p: 0, py: 0.5 },
        }}
      />
    );
  }

  return (
    <Box
      onClick={() => setEditing(true)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') setEditing(true);
      }}
      sx={{
        ...styles.editableBoxBase,
        textAlign: column.align || 'left',
      }}
    >
      <Typography variant="body2" sx={styles.editableText} component="span">
        {display}
      </Typography>
    </Box>
  );
}

export default memo(EditableCell);
