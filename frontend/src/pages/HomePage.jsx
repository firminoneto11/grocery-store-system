
// MUI Imports
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';

// Custom Components
import Chart from '../dashboard_files/Chart';
import Orders from '../dashboard_files/Orders';
import Deposits from '../components/Deposits';
import Copyright from '../components/Copyright';
import Base from '../components/Base';

export default function HomePage() {

    return (
        <Base>
            <Box component="main" sx={{
                backgroundColor: (theme) =>
                    theme.palette.mode === 'light'
                        ? theme.palette.grey[100]
                        : theme.palette.grey[900],
                flexGrow: 1,
                height: '100vh',
                overflow: 'auto',
            }}>
                <Toolbar />
                <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                    <Grid container spacing={3}>
                        {/* Chart */}
                        <Grid item xs={12} md={8} lg={9}>
                            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 240 }}>
                                <Chart />
                            </Paper>
                        </Grid>
                        {/* Recent Deposits */}
                        <Grid item xs={12} md={4} lg={3}>
                            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 240, }}>
                                <Deposits />
                            </Paper>
                        </Grid>
                        {/* Recent Orders */}
                        <Grid item xs={12}>
                            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', overflowX: "auto" }}>
                                <Orders />
                            </Paper>
                        </Grid>
                    </Grid>
                    <Copyright sx={{ pt: 4 }} />
                </Container>
            </Box>
        </Base>
    );
}
