
import Base from "../components/Base";
import { Button } from "@mui/material";
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import { Container } from "@mui/material";
import CustomModal from "../components/CustomModal";
import { useState } from "react";

export default function ProductsPage() {

    const [displayForm, setDisplayForm] = useState(false);
    const setDisplayFormHandler = () => setDisplayForm(!displayForm);

    return (
        <Base>
            <CustomModal active={displayForm} close={setDisplayFormHandler} />
            <Box component="div" sx={{
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
                    <Button onClick={setDisplayFormHandler} variant="contained">Add Product</Button>
                </Container>
            </Box>
        </Base>
    );
}
