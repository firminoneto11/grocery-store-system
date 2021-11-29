
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
    Toolbar, Button, TextField, Grid, Paper, Container, Autocomplete, Tooltip, IconButton, CircularProgress, Accordion,
    AccordionSummary, AccordionDetails, Typography
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CancelIcon from '@mui/icons-material/Cancel';

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
        if (!selectedProduct) {
            swal({
                "title": "Pick a product",
                "text": "Select a product!",
                "icon": "info"
            });
            return;
        }
        else if (!event.target.amount.value) {
            swal({
                "title": "Set an amount",
                "text": "Set an amount for this item",
                "icon": "info"
            });
            return;
        }

        const product = {
            product_id: selectedProduct.id,
            name: selectedProduct.name,
            unity_price: selectedProduct.unity_price,
            amount: event.target.amount.value
        };

        // Inserting the selected product into the cart
        setCartProducts((prevState) => {
            if (prevState.some(el => el.product_id === product.product_id)) {
                swal({
                    "title": "Can't add",
                    "text": "Product added already!",
                    "icon": "info"
                });
                return [...prevState];
            }
            else if (product.amount > selectedProduct.amount_in_stock) {
                swal({
                    "title": "Can't add",
                    "text": `Can't add ${product.amount}x of '${selectedProduct.name}' because it will exceed the amount in stock for this item.`,
                    "icon": "info"
                });
                return [...prevState];
            }
            else if (!prevState.length) {
                event.target.amount.value = "";
                return [product];
            }
            event.target.amount.value = "";
            return [product, ...prevState];
        })
    };

    const submitHandler = async (event) => {
        event.preventDefault();
        const sellForm = event.target;
        const sellData = {
            customers_name: sellForm.customers_name.value,
            customers_cpf: sellForm.customers_cpf.value,
            sales: cartProducts.map(el => {
                return { product_id: el.product_id, amount: el.amount }
            })
        };

        if (!sellData.sales.length) {
            swal({
                "title": "Empty cart",
                "icon": "error",
                "text": "List of products is empty!"
            });
            return;
        }

        const url = "http://localhost:8000/api/v1/sales/";
        let response;
        try {
            response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${tokens.access}`
                },
                body: JSON.stringify(sellData)
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

        if (response.status === 201) {
            sellForm.customers_name.value = "";
            sellForm.customers_cpf.value = "";
            setCartProducts([]);
            swal({
                "title": "Success",
                "text": "Sale registered successfully!",
                "icon": "success"
            });
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
    };

    // useEffect hook for the Autocomplete component
    useEffect(() => {
        let active = true;
        if (!loading) return undefined;

        if (!options.length) {
            getAllProducts()
                .then(data => {
                    if (active && data) setOptions([...data]);
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
                                                <Grid item xs={12} lg={6}>
                                                    {/* inputValue={selectedProduct ? selectedProduct.name : ''} */}
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

                                                <Grid item xs={6} lg={5}>
                                                    <TextField name="amount" label="Amount" type="number" fullWidth />
                                                </Grid>

                                                <Grid item xs={6} lg={1} sx={{ mt: "1rem" }}>
                                                    <Tooltip title="Add this product to the cart">
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
                                                            <Accordion sx={{ mt: "0.5rem" }} key={el.product_id}>
                                                                <AccordionSummary
                                                                    expandIcon={<ExpandMoreIcon />}
                                                                    aria-controls="panel1a-content"
                                                                    id="panel1a-header">
                                                                    <IconButton onClick={() => {
                                                                        setCartProducts(prevState => {
                                                                            const index = prevState.findIndex((ele) =>
                                                                                ele.product_id === el.product_id)
                                                                            prevState.splice(index, 1);
                                                                            return [...prevState];
                                                                        });
                                                                    }}>
                                                                        <Tooltip title="Remove this item from the cart">
                                                                            <CancelIcon />
                                                                        </Tooltip>
                                                                    </IconButton>
                                                                    <Typography sx={{ mt: "0.5rem" }}>{el.name} |
                                                                        Total: R${(el.amount * el.unity_price).toFixed(2)}</Typography>
                                                                </AccordionSummary>
                                                                <AccordionDetails>
                                                                    <Typography>
                                                                        Product ID: {el.product_id} |
                                                                        Amount bought: {el.amount} |
                                                                        Total: R${(el.amount * el.unity_price).toFixed(2)} |
                                                                        Unity price: R${(el.unity_price * 1).toFixed(2)}
                                                                    </Typography>
                                                                </AccordionDetails>
                                                            </Accordion>
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
