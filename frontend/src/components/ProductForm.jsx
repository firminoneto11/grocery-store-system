
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Button } from "@mui/material";
import { Container } from "@mui/material";
import Typography from '@mui/material/Typography';
import AuthContext from '../context/AuthContext';
import { useContext } from 'react';
import swal from 'sweetalert';
import AddIcon from '@mui/icons-material/Add';
import { toTitleCase } from '../utils/toTitleCase';
import { Grid } from '@mui/material';

export default function ProductForm({ close, updateGrid }) {

    const { tokens, logOut } = useContext(AuthContext);

    const addProduct = async (event) => {
        event.preventDefault();
        const form = event.target;
        const newProduct = {
            name: form.name.value,
            unity_price: form.unity_price.value,
            suppliers_percentage: form.suppliers_percentage.value,
            freight_percentage: form.freight_percentage.value,
            amount_in_stock: form.amount_in_stock.value,
            description: form.description.value
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
            info = info.join('\n');
            swal({
                "title": "Error",
                "text": info,
                "icon": "error"
            });
        }
    }

    return (
        <Box component="form" onSubmit={addProduct} noValidate autoComplete="off" sx={{
            '& .MuiTextField-root': { m: 1, width: "25ch%" },
        }}>
            <Typography id="transition-modal-title" variant="h6" component="h2">Add a new product</Typography>
            <Box sx={{ flexGrow: 1 }} sx={{ mt: 4, mb: 4 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={12} lg={12}>
                        <TextField name="name" required id="outlined-required" label="Product Name" />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField name="description" id="outlined-required" label="Description" />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField name="unity_price" required id="outlined-number" label="Unity price" type="number" />
                        <TextField name="amount_in_stock" required id="outlined-number" label="Amount in stock" type="number" />
                        <TextField name="suppliers_percentage" required id="outlined-number" label="Supplier's percentage" type="number" />
                        <TextField name="freight_percentage" required id="outlined-number" label="Freight's percentage" type="number" />
                    </Grid>
                </Grid>
                <Button sx={{
                    display: "block",
                    width: "50%",
                    marginLeft: "auto",
                    marginRight: "auto"
                }} startIcon={<AddIcon />} variant="contained" type="submit">
                    Add product
                </Button>
            </Box>
        </Box >
    );
}
