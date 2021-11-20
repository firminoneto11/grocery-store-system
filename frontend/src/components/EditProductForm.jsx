
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Button } from "@mui/material";
import { Container } from "@mui/material";
import Typography from '@mui/material/Typography';
import AuthContext from '../context/AuthContext';
import { useContext } from 'react';
import swal from 'sweetalert';
import { toTitleCase } from '../utils/toTitleCase';
import { Grid } from '@mui/material';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import SaveIcon from '@mui/icons-material/Save';

export default function EditProductForm({ close, updateGrid, productData }) {

    const { tokens, logOut } = useContext(AuthContext);

    const addProduct = async (event) => {
        event.preventDefault();
        const form = event.target;
        const product = {
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
            response = await fetch(`http://localhost:8000/api/v1/products/${productData.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${tokens.access}`
                },
                body: JSON.stringify(product)
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
            swal({
                "title": "Success",
                "text": `${product.name} updated successfully!`,
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

            const newProductKeys = Object.keys(product);
            for (let att in returnedData) {
                let field = newProductKeys.find(el => el === att);
                console.log(field);
                if (field) {
                    form[field].error = true;
                    // TODO: Create a useReducer to validate the fields, with server-side validation.
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
            <Typography id="transition-modal-title" variant="h6" component="h2">Edit this product</Typography>
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
                                defaultValue={productData.name} />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField fullWidth name="description" id="outlined-required" label="Description"
                                defaultValue={productData.description} />
                        </Grid>

                        <Grid item xs={12}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox name="is_active" defaultChecked={productData.is_active} />}
                                    label="Is active?" />
                            </FormGroup>
                        </Grid>

                        <Grid item xs={12} md={6} lg={3}>
                            <TextField fullWidth name="unity_price" required id="outlined-number" label="Unity price" type="number"
                                defaultValue={productData.unity_price} />
                        </Grid>

                        <Grid item xs={12} md={6} lg={3}>
                            <TextField fullWidth name="amount_in_stock" required id="outlined-number" label="Amount in stock"
                                type="number" defaultValue={productData.amount_in_stock} />
                        </Grid>

                        <Grid item xs={12} md={6} lg={3}>
                            <TextField fullWidth name="suppliers_percentage" required id="outlined-number" label="Supplier's percentage" type="number" defaultValue={productData.suppliers_percentage} />
                        </Grid>

                        <Grid item xs={12} md={6} lg={3}>
                            <TextField fullWidth name="freight_percentage" required id="outlined-number" label="Freight's 
                            percentage" type="number" defaultValue={productData.freight_percentage} />
                        </Grid>
                    </Grid>
                </Box>

                <Button sx={{ mt: "1rem" }} startIcon={<SaveIcon />} variant="contained" type="submit" fullWidth>Save changes</Button>
            </Box>
        </Container >
    );
}
