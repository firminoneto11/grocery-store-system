
// Custom components import
import Title from '../components/Title';
import Base from '../components/Base';
import AuthContext from '../context/AuthContext';
import swal from 'sweetalert';
import { toTitleCase } from '../utils/toTitleCase';

// React imports
import { useContext, useState, useEffect, Fragment } from 'react';

// MUI imports
import { Box } from '@mui/system';
import {
    Toolbar, Button, TextField, Grid, Paper, Container, Autocomplete, Tooltip, IconButton, CircularProgress
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

export default function SellPage() {

    const { tokens, logOut } = useContext(AuthContext);
    const [cartProducts, setCartProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState('');

    // States for the asynchronous Autocomplete
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState([]);
    const loading = open && options.length === 0;

    const getAllProducts = async () => {
        const url = "http://localhost:8000/api/v1/all_products/";
        let response;
        try {
            response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${tokens.access}`
                }
            })
        }
        catch (error) {
            swal({
                "title": "Error",
                "text": `Could not get a response from the server. More details about it:\n${error.message}`,
                "icon": "error"
            });
            return;
        }

        const returnedData = await response.json();

        if (response.status === 200) {
            return returnedData;
        }
        else if (response.status === 401) {
            logOut();
        }
        else {
            let info = [];
            for (let att in returnedData) {
                let attName = att.split('_');
                attName = attName.join(" ");
                attName = toTitleCase(attName);
                info.push(`${attName} - ${returnedData[att]}`);
            }
            info = info.join('\n');
            swal({
                "title": "Error",
                "text": info,
                "icon": "error"
            });
        }
    }

    const addProduct = (event) => {
        event.preventDefault();
        if (!selectedProduct) return alert("Select a product!");
        else if (!event.target.amount.value) return alert("Set an amount!");

        const product = {
            product_id: selectedProduct.id,
            amount: event.target.amount.value
        };

        // Inserting the selected product into the cart
        setCartProducts((prevState) => {
            if (prevState.some(el => el.product_id === product.product_id)) {
                alert("Product added already!");
                return [...prevState];
            }
            else if (product.amount > selectedProduct.amount_in_stock) {
                alert(
                    `Can't buy ${product.amount}x of '${selectedProduct.name}' because it will exceed the amount in stock for this item.`
                );
                return [...prevState];
            }
            else if (!prevState.length) {
                // Resetting the states
                // TODO: Find a way to remove the little 'X' icon after a insertion in the cart
                setSelectedProduct('');
                event.target.amount.value = "";
                return [product];
            }
            // Resetting the states
            // TODO: Find a way to remove the little 'X' icon after a insertion in the cart
            setSelectedProduct('');
            event.target.amount.value = "";
            return [product, ...prevState];
        })
    };

    const submitHandler = (event) => {
        event.preventDefault();
    };

    // useEffect hook for the Autocomplete component
    useEffect(() => {
        let active = true;
        if (!loading) return undefined;

        if (!options.length) {
            getAllProducts()
                .then(data => {
                    if (active) setOptions([...data]);
                })
        }

        return () => {
            active = false;
        };
    }, [loading]);
    // ---

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
                                                        open={open}
                                                        onOpen={() => setOpen(true)}
                                                        onClose={() => setOpen(false)}
                                                        loading={loading}
                                                        loadingText="Loading..."
                                                        options={options}
                                                        disablePortal
                                                        getOptionLabel={(option) => option.name}
                                                        inputValue={selectedProduct ? selectedProduct.name : ''}
                                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                                        onChange={(event, newValue) => setSelectedProduct(newValue)}
                                                        renderOption={(props, option) => {
                                                            return (
                                                                <Box component="li" {...props}>
                                                                    {option.name} | Amount in stock: {option.amount_in_stock}
                                                                </Box>
                                                            )
                                                        }}
                                                        renderInput={(params) => {
                                                            return (
                                                                <TextField {...params} label="Product" name="product_label"
                                                                    InputProps={{
                                                                        ...params.InputProps,
                                                                        endAdornment: (
                                                                            <Fragment>
                                                                                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                                                                {params.InputProps.endAdornment}
                                                                            </Fragment>
                                                                        ),
                                                                    }} />
                                                            )
                                                        }}
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
                                                    {cartProducts && cartProducts.map((el) => {
                                                        return (
                                                            <p key={el.product_id}>{el.product_id} | Amount: {el.amount}</p>
                                                        )
                                                    })}
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
