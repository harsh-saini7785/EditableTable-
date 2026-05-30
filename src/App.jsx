import { Box, Typography, Container } from '@mui/material';
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded';
import DataTable from './components/DataTable/DataTable';
import { TableProvider, useTable } from './context/TableContext';
import { useUnsavedGuard } from './hooks/useUnsavedGuard';

function Shell() {
  const { dirtyIds } = useTable();
  useUnsavedGuard(dirtyIds.size > 0);

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background:
          'radial-gradient(1200px 600px at 80% -10%, rgba(232,179,57,0.06), transparent 60%),' +
          'radial-gradient(900px 500px at -10% 110%, rgba(92,200,179,0.05), transparent 55%),' +
          '#0e1016',
      }}
    >
      <Box
        component="header"
        sx={{
          px: { xs: 2, md: 4 },
          py: 2.5,
          borderBottom: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
        }}
      >
        <Box
          sx={{
            width: 38, height: 38, borderRadius: 1.5,
            display: 'grid', placeItems: 'center',
            bgcolor: 'primary.main', color: '#1a1300',
          }}
        >
          <GridViewRoundedIcon />
        </Box>
        <Box>
          <Typography variant="h6" sx={{ lineHeight: 1.1 }}>
            Cloudagle
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Editable Data Table · 10k rows
          </Typography>
        </Box>
      </Box>

      <Container
        maxWidth={false}
        sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', py: 3, px: { xs: 2, md: 4 } }}
      >
        <DataTable />
        <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1.5, opacity: 0.7 }}>
          Click a cell to edit · Enter to commit · Esc to revert · Shift-click a header for multi-column sort
        </Typography>
      </Container>
    </Box>
  );
}

export default function App() {
  return (
    <TableProvider>
      <Shell />
    </TableProvider>
  );
}
