
import Base from "../components/Base";
import { Button } from "@mui/material";
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import { Container } from "@mui/material";
import CustomModal from "../components/CustomModal";
import { Fragment, useState } from "react";
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
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Tooltip from '@mui/material/Tooltip';

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

    const deleteProduct = async (id) => {
        swal({
            title: "Delete product",
            text: "Are you sure that you want to delete this product?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then(async (willDelete) => {
                if (willDelete) {

                    let response;
                    try {
                        response = await fetch(`http://localhost:8000/api/v1/products/${id}`, {
                            method: "DELETE",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${tokens.access}`
                            }
                        });
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
                    if (response.status === 204) {
                        swal({
                            "icon": "success",
                            "title": "Success",
                            "text": returnedData.success
                        });
                        getProducts();
                    }
                    else if (response.status === 401) {
                        logOut();
                    }
                    else {
                        swal({
                            "icon": "info",
                            "title": "",
                            "text": returnedData.detail
                        });
                    }
                }
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
                                                <TableCell>Unity Price</TableCell>
                                                <TableCell />
                                                <TableCell />
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {data.map((row) => (
                                                <Fragment key={row.id}>
                                                    <TableRow hover sx={{ transition: "0.3s" }}>
                                                        <TableCell>{new Date(row.created_at).toLocaleDateString()}</TableCell>
                                                        <TableCell>{row.id}</TableCell>
                                                        <TableCell>{row.name}</TableCell>
                                                        <TableCell>{row.amount_in_stock}</TableCell>
                                                        <TableCell>{`R$${row.unity_price}`}</TableCell>
                                                        <TableCell>
                                                            <Tooltip title="Edit this item">
                                                                <IconButton color="primary" onClick={() => editProduct(row)}>
                                                                    <EditIcon />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Tooltip title="Delete this item">
                                                                <IconButton color="error" onClick={() => deleteProduct(row.id)}>
                                                                    <DeleteIcon />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </TableCell>
                                                    </TableRow>
                                                </Fragment>
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
                        <Tooltip title="Previous page">
                            <span>
                                <IconButton disabled={previous ? false : true} onClick={getPreviousPage} sx={{ mt: "1rem", mr: "0.5rem" }} variant="contained">
                                    <NavigateBeforeIcon />
                                </IconButton>
                            </span>
                        </Tooltip>

                        <Tooltip title="Next page">
                            <span>
                                <IconButton disabled={next ? false : true} onClick={getNextPage} sx={{ mt: "1rem", mr: "0.5rem" }} variant="contained">
                                    <NavigateNextIcon />
                                </IconButton>
                            </span>
                        </Tooltip>
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
