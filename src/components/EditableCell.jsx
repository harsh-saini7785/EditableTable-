import { memo, useState, useEffect, useRef } from 'react';
import { Box, InputBase, Typography } from '@mui/material';

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
        sx={{ color: 'text.secondary', textAlign: column.align || 'left', px: 1.5, width: '100%' }}
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
          px: 1.5,
          width: '100%',
          fontSize: '0.875rem',
          color: 'text.primary',
          bgcolor: 'rgba(232,179,57,0.08)',
          borderRadius: 1,
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
        px: 1.5,
        py: 0.5,
        width: '100%',
        cursor: 'text',
        borderRadius: 1,
        textAlign: column.align || 'left',
        transition: 'background 0.12s ease',
        '&:hover': { bgcolor: 'rgba(255,255,255,0.04)' },
        '&:focus-visible': { outline: '1px solid', outlineColor: 'primary.main' },
      }}
    >
      <Typography variant="body2" sx={{ color: 'text.primary' }} component="span">
        {display}
      </Typography>
    </Box>
  );
}

export default memo(EditableCell);
