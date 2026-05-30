export const styles = {
  rowBase: {
    display: 'flex',
    alignItems: 'center',
    borderBottom: '1px solid',
    borderColor: 'divider',
    '&:hover': { bgcolor: 'rgba(255,255,255,0.03)' },
  },
  cellWrapper: {
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
  },
  actionsWrapperBase: {
    flexShrink: 0,
    display: 'flex',
    justifyContent: 'center',
    gap: 0.25,
    transition: 'opacity 0.15s ease',
  },
};
