export const styles = {
  nonEditableText: {
    color: 'text.secondary',
    px: 1.5,
    width: '100%',
  },
  editingInputBase: {
    px: 1.5,
    width: '100%',
    fontSize: '0.875rem',
    color: 'text.primary',
    bgcolor: 'rgba(232,179,57,0.08)',
    borderRadius: 1,
  },
  editableBoxBase: {
    px: 1.5,
    py: 0.5,
    width: '100%',
    cursor: 'text',
    borderRadius: 1,
    transition: 'background 0.12s ease',
    '&:hover': { bgcolor: 'rgba(255,255,255,0.04)' },
    '&:focus-visible': { outline: '1px solid', outlineColor: 'primary.main' },
  },
  editableText: {
    color: 'text.primary',
  },
};

