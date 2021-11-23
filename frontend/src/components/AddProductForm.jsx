
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Button } from "@mui/material";
import { Container } from "@mui/material";
import Typography from '@mui/material/Typography';
import AuthContext from '../context/AuthContext';
import { useContext, useReducer } from 'react';
import swal from 'sweetalert';
import AddIcon from '@mui/icons-material/Add';
import { toTitleCase } from '../utils/toTitleCase';
import { Grid } from '@mui/material';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

export default function ProductForm({ close, updateGrid }) {

    const { tokens, logOut } = useContext(AuthContext);

    const [nameState, dispatchName] = useReducer((prevState, action) => {

        if (!action) return { helperText: "", isValid: true };
        else if (action.type === "invalidName") {
            return { helperText: action.text, isValid: false };
        }

    }, { helperText: "", isValid: true });

    const [unityPriceState, dispatchUnityPrice] = useReducer((prevState, action) => {

        if (!action) return { helperText: "", isValid: true };
        else if (action.type === "invalidUnityPrice") {
            return { helperText: action.text, isValid: false };
        }

    }, { value: "", isValid: true });

    const [amountInStockState, dispatchAmountInStock] = useReducer((prevState, action) => {

        if (!action) return { helperText: "", isValid: true };
        else if (action.type === "invalidAmountInStock") {
            return { helperText: action.text, isValid: false };
        }

    }, { value: "", isValid: true });

    const [suppliersPercentageState, dispatchSuppliersPercentage] = useReducer((prevState, action) => {

        if (!action) return { helperText: "", isValid: true };
        else if (action.type === "invalidSuppliersPercentage") {
            return { helperText: action.text, isValid: false };
        }

    }, { value: "", isValid: true });

    const [freightPercentageState, dispatchFreightPercentage] = useReducer((prevState, action) => {

        if (!action) return { helperText: "", isValid: true };
        else if (action.type === "invalidFreightPercentage") {
            return { helperText: action.text, isValid: false };
        }

    }, { value: "", isValid: true });

    const addProduct = async (event) => {
        event.preventDefault();
        const form = event.target;
        const newProduct = {
            name: form.name.value,
            description: form.description.value,
            is_active: form.is_active.checked,

            unity_price: form.unity_price.value,
            amount_in_stock: form.amount_in_stock.value,
            suppliers_percentage: form.suppliers_percentage.value,
            freight_percentage: form.freight_percentage.value,
        }

        let response;
        try {
            response = await fetch("http://localhost:8000/api/v1/products/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${tokens.access}`
                },
                body: JSON.stringify(newProduct)
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
            swal({
                "title": "Success",
                "text": `${newProduct.name} created successfully!`,
                "icon": "success"
            })
                .then(() => close())
                .then(() => updateGrid());
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

            // Performing a server-side validation. When a user inputs some incorrect data, the server will respond
            // specifying which fields were not satisfied. Then, based on this response, this algorithm will set
            // each field as valid or not valid with the dispatch function provided by useReducer react hook.
            const returnedDataKeys = Object.keys(returnedData);
            for (let key in newProduct) {
                const existsInReturnedData = returnedDataKeys.some(el => el === key);
                if (existsInReturnedData) {
                    switch (key) {
                        case "name":
                            dispatchName({ type: "invalidName", text: returnedData[key] });
                            break;
                        case "unity_price":
                            dispatchUnityPrice({ type: "invalidUnityPrice", text: returnedData[key] });
                            break;
                        case "amount_in_stock":
                            dispatchAmountInStock({ type: "invalidAmountInStock", text: returnedData[key] });
                            break;
                        case "suppliers_percentage":
                            dispatchSuppliersPercentage({ type: "invalidSuppliersPercentage", text: returnedData[key] });
                            break;
                        case "freight_percentage":
                            dispatchFreightPercentage({ type: "invalidFreightPercentage", text: returnedData[key] });
                            break;
                        default:
                            break;
                    }
                }
                else {
                    switch (key) {
                        case "name":
                            dispatchName();
                            break;
                        case "unity_price":
                            dispatchUnityPrice();
                            break;
                        case "amount_in_stock":
                            dispatchAmountInStock();
                            break;
                        case "suppliers_percentage":
                            dispatchSuppliersPercentage();
                            break;
                        case "freight_percentage":
                            dispatchFreightPercentage();
                            break;
                        default:
                            break;
                    }
                }
            }

            info = info.join('\n');
            swal({
                "title": "Error",
                "text": info,
                "icon": "error"
            });
        }
    }

    return (
        <Container component="form" onSubmit={addProduct} noValidate autoComplete="off" sx={{
            '& .MuiTextField-root': { mt: 1, mb: 1 },
        }}>
            <Typography id="transition-modal-title" variant="h6" component="h2">Add a new product</Typography>
            <Box sx={{
                mt: 4,
                mb: 4,
                ml: "auto",
                mr: "auto"
            }}>
                <Box sx={{ flexGrow: 1 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField fullWidth name="name" required id="outlined-required" label="Product Name"
                                error={!nameState.isValid}
                                helperText={nameState.helperText} />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField fullWidth name="description" id="outlined-required" label="Description" />
                        </Grid>

                        <Grid item xs={12}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox name="is_active" defaultChecked />} label="Is active?" />
                            </FormGroup>
                        </Grid>

                        <Grid item xs={12} md={6} lg={3}>
                            <TextField fullWidth name="unity_price" required id="outlined-number" label="Unity price" type="number"
                                error={!unityPriceState.isValid}
                                helperText={unityPriceState.helperText} />
                        </Grid>

                        <Grid item xs={12} md={6} lg={3}>
                            <TextField fullWidth name="amount_in_stock" required id="outlined-number" label="Amount in stock"
                                type="number" error={!amountInStockState.isValid} helperText={amountInStockState.helperText} />
                        </Grid>

                        <Grid item xs={12} md={6} lg={3}>
                            <TextField fullWidth name="suppliers_percentage" required id="outlined-number"
                                label="Supplier's percentage" type="number"
                                error={!suppliersPercentageState.isValid}
                                helperText={suppliersPercentageState.helperText} />
                        </Grid>

                        <Grid item xs={12} md={6} lg={3}>
                            <TextField fullWidth name="freight_percentage" required id="outlined-number"
                                label="Freight's percentage" type="number"
                                error={!freightPercentageState.isValid}
                                helperText={freightPercentageState.helperText} />
                        </Grid>
                    </Grid>
                </Box>

                <Button sx={{ mt: "1rem" }} startIcon={<AddIcon />} variant="contained" type="submit" fullWidth>Add product</Button>
            </Box>
        </Container >
    );
}
