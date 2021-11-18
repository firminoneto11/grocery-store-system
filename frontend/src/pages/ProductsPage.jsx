
import Base from "../components/Base";
import { Button } from "@mui/material";
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import { Container } from "@mui/material";
import CustomModal from "../components/CustomModal";
import { useState } from "react";
import ProductForm from '../components/ProductForm';
import { useEffect } from "react";
import swal from 'sweetalert';
import Copyright from '../components/Copyright';
import AuthContext from '../context/AuthContext';
import { useContext } from 'react';
import { toTitleCase } from '../utils/toTitleCase';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { CircularProgress } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import Search from "../components/Search";
import ClearIcon from '@mui/icons-material/Clear';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from '../components/Title';

export default function ProductsPage() {

    const [displayForm, setDisplayForm] = useState(false);
    const setDisplayFormHandler = () => setDisplayForm(prevState => setDisplayForm(!prevState));
    const [data, setData] = useState(null);
    const { tokens, logOut } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);

    const [previous, setPrevious] = useState(null);
    const [next, setNext] = useState(null);

    const getProducts = async (page = "http://localhost:8000/api/v1/products/") => {
        setLoading(true);
        let response;
        try {
            response = await fetch(page, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${tokens.access}`
                }
            })
        }
        catch (error) {
            setLoading(false);
            swal({
                "title": "Error",
                "text": `Could not get a response from the server. More details about it:\n${error.message}`,
                "icon": "error"
            });
            return;
        }
        const returnedData = await response.json();

        if (response.status === 200) {
            if (!returnedData.count) {
                setData(null);
            }
            else {
                setNext(returnedData.next);
                setPrevious(returnedData.previous);
                setData([...returnedData.results]);
            }
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
        setLoading(false);
    }

    const getNextPage = () => getProducts(next);
    const getPreviousPage = () => getProducts(previous);

    const searchProduct = async (element) => {
        if (!element) {
            getProducts();
            return;
        }

        setLoading(true);
        let response;

        try {
            response = await fetch(`http://localhost:8000/api/v1/products/${element}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${tokens.access}`
                }
            });
        }
        catch (error) {
            setLoading(false);
            swal({
                "title": "Error",
                "text": `Could not get a response from the server. More details about it:\n${error.message}`,
                "icon": "error"
            });
            return;
        }

        const returnedData = await response.json();

        if (response.status === 200) {
            if (!returnedData.length) {
                setData(null);
            }
            else {
                setNext(null);
                setPrevious(null);
                setData(returnedData);
            }
        }
        else if (response.status === 401) {
            logOut();
        }
        setLoading(false);
    }

    const editProduct = (args) => {
        const productData = { ...args };
        let resp = '';
        for (let [key, value] of Object.entries(productData)) {
            resp = resp + `${key} - ${value}\n`;
        }
        swal({
            "icon": "info",
            "title": "Product's data",
            "text": resp
        });
    }

    useEffect(() => {
        getProducts();
    }, []);

    return (
        <Base>
            <CustomModal active={displayForm} close={setDisplayFormHandler}>
                <ProductForm close={setDisplayFormHandler} updateGrid={getProducts} />
            </CustomModal>
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
                        <Grid item xs={12} md={6} lg={3}>
                            <Search searchAction={searchProduct} />
                        </Grid>
                        <Grid item xs={12} md={6} lg={3}>
                            <Button sx={{ mt: "0.25rem" }} onClick={() => getProducts()} startIcon={<ClearIcon />} variant="contained">Show all products</Button>
                        </Grid>
                    </Grid>
                </Container>

                <Container maxWidth="lg" sx={{ mt: 2, mb: 2 }}>
                    {/* Table of data */}
                    {loading && (
                        <Box sx={{ textAlign: "center" }}>
                            <CircularProgress />
                        </Box>
                    )}
                    {data && !loading && (
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', overflowX: "auto" }}>
                                    <Title>Products List</Title>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Created at</TableCell>
                                                <TableCell>Product ID</TableCell>
                                                <TableCell>Name</TableCell>
                                                <TableCell>Amount in stock</TableCell>
                                                <TableCell align="right">Unity Price</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {data.map((row) => (
                                                <TableRow hover sx={{ cursor: "pointer", transition: "0.3s" }} key={row.id} onClick={() => editProduct(row)}>
                                                    <TableCell>{new Date(row.created_at).toLocaleDateString()}</TableCell>
                                                    <TableCell>{row.id}</TableCell>
                                                    <TableCell>{row.name}</TableCell>
                                                    <TableCell>{row.amount_in_stock}</TableCell>
                                                    <TableCell align="right">{`R$${row.unity_price}`}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </Paper>
                            </Grid>
                        </Grid>
                    )}
                    {!data && !loading && (
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                                    <Title>No products found</Title>
                                </Paper>
                            </Grid>
                        </Grid>
                    )}

                    <Container sx={{ textAlign: "center" }}>
                        <IconButton disabled={previous ? false : true} onClick={getPreviousPage} sx={{ mt: "1rem", mr: "0.5rem" }} variant="contained">
                            <NavigateBeforeIcon />
                        </IconButton>
                        <IconButton disabled={next ? false : true} onClick={getNextPage} sx={{ mt: "1rem", mr: "0.5rem" }} variant="contained">
                            <NavigateNextIcon />
                        </IconButton>
                    </Container>

                    <Container sx={{ textAlign: "left" }}>
                        <Button startIcon={<AddIcon />} sx={{ mt: "1rem" }} onClick={setDisplayFormHandler} variant="contained">Add Product</Button>
                    </Container>
                    <Copyright sx={{ pt: 4 }} />
                </Container>
            </Box>
        </Base>
    );
}
