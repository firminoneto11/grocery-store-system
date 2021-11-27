
// Custom components import
import Title from '../components/Title';
import Base from '../components/Base';
import AuthContext from '../context/AuthContext';

// React imports
import { useContext, useState } from 'react';

// MUI imports
import { Box } from '@mui/system';
import { Toolbar, Button, TextField, Grid, Paper, Container, Autocomplete, Tooltip, IconButton } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

export default function SellPage() {

    const { tokens, logOut } = useContext(AuthContext);
    const [products, setProducts] = useState([]);
    const [clearIcon, setClearIcon] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState('');

    const addProduct = (event) => {
        event.preventDefault();
        if (!selectedProduct) return alert("Select a product!");
        else if (!event.target.amount.value) return alert("Set an amount!");

        const product = {
            product_id: selectedProduct.id,
            amount: event.target.amount.value
        };

        // Resetting the states
        setSelectedProduct('');
        event.target.amount.value = "";
        setClearIcon(false);

        console.log(product);
    };

    const submitHandler = (event) => {
        event.preventDefault();
    };

    const topFilms = [
        { label: 'The Shawshank Redemption', id: 1, amount: 20 },
        { label: 'The Godfather', id: 2, amount: 30 },
        { label: 'The Godfather: Part II', id: 3, amount: 40 },
        { label: 'The Dark Knight', id: 4, amount: 50 },
        { label: '12 Angry Men', id: 5, amount: 20 },
        { label: "Schindler's List", id: 6, amount: 30 },
        { label: 'Pulp Fiction', id: 7, amount: 10 },
        { label: 'The Lord of the Rings: The Return of the King', id: 8, amount: 20 }
    ]

    return (
        <Base>
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
                <Container maxWidth="lg" sx={{ mt: 2, mb: 2 }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>

                            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', overflowX: "auto" }}>
                                <Title>Sell Form</Title>

                                {/* Form to pick the products and add them to the 'cart' */}
                                <Container component="form" onSubmit={addProduct} autoComplete="off" sx={{
                                    '& .MuiTextField-root': { mt: 1, mb: 1 },
                                }}>
                                    <Box sx={{
                                        mt: 1,
                                        mb: 1,
                                        ml: "auto",
                                        mr: "auto"
                                    }}>
                                        <Box sx={{ flexGrow: 1 }}>
                                            <Grid container spacing={1}>
                                                <Grid item xs={6}>
                                                    <Autocomplete
                                                        id="combo-box-demo"
                                                        fullWidth
                                                        clearOnBlur={true}
                                                        disablePortal
                                                        options={topFilms}
                                                        disablePortal
                                                        inputValue={selectedProduct ? selectedProduct.label : ''}
                                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                                        onChange={(event, newValue) => setSelectedProduct(newValue)}
                                                        renderOption={(props, option) => {
                                                            return (
                                                                <Box component="li" {...props}>
                                                                    {option.label} | Amount in stock: {option.amount}
                                                                </Box>
                                                            )
                                                        }}
                                                        renderInput={(params) => <TextField {...params} label="Product" name="product_label" />}
                                                    />
                                                </Grid>

                                                <Grid item xs={5}>
                                                    <TextField name="amount" label="Amount" type="number" fullWidth />
                                                </Grid>

                                                <Grid item xs={1} sx={{ mt: "1rem" }}>
                                                    <Tooltip title="Add this product">
                                                        <IconButton type="submit">
                                                            <CheckIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    </Box>
                                </Container>
                                {/* Form to pick the products and add them to the 'cart' */}

                                <Container component="form" onSubmit={submitHandler} autoComplete="off" sx={{
                                    '& .MuiTextField-root': { mt: 1, mb: 1 },
                                }}>
                                    <Box sx={{
                                        mt: 1,
                                        mb: 1,
                                        ml: "auto",
                                        mr: "auto"
                                    }}>
                                        <Box sx={{ flexGrow: 1 }}>
                                            <Grid container spacing={2}>
                                                <Grid item xs={12}>
                                                    <TextField id="test" fullWidth name="customers_name" label="Customer's name" />
                                                </Grid>

                                                <Grid item xs={12}>
                                                    <TextField fullWidth name="customers_cpf" label="Customer's cpf" />
                                                </Grid>

                                                <Grid item xs={12}>
                                                    {products && products}
                                                </Grid>
                                            </Grid>
                                        </Box>

                                        <Button sx={{ mt: "2rem" }} startIcon={<CheckIcon />} variant="contained" type="submit" fullWidth>Register Sale</Button>
                                    </Box>
                                </Container>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Base >
    );
}
