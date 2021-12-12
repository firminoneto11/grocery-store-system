
// React imports
import { Fragment, useEffect, useState, useContext } from 'react';
import { useHistory } from 'react-router';

// Custom components import
import Title from '../components/Title';
import AuthContext from '../context/AuthContext';

// Sweetalert
import swal from 'sweetalert';

// MUI imports
import {
    CircularProgress, Box, Link, Table, TableBody, TableCell, TableHead, TableRow
} from "@mui/material";

export default function Orders() {

    // Declaring some states
    const [ordersData, setOrdersData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [noDataMesage, setNoDataMesage] = useState(false);

    // Getting some context data
    const { tokens, logOut } = useContext(AuthContext);

    // useHistory hook
    const history = useHistory();

    // Fired when the user clicks on the link bellow the table. Pushes the user to the /orders url
    const goToOrders = (event) => {
        event.preventDefault();
        history.push("/orders");
    };

    // Function that fetches the latest 5 recent orders
    const getRecentOrders = async () => {
        setLoading(true);
        const url = "http://localhost:8000/api/v1/sales/?latest_five=true";
        let response;

        try {
            response = await fetch(url, {
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
            setOrdersData(returnedData);
        }
        else if (response.status == 404) {
            setNoDataMesage(returnedData.detail);
        }
        else if (response.status === 401) {
            logOut();
        }
        setLoading(false);
    }

    useEffect(() => {
        getRecentOrders();
    }, []);

    return (
        <Fragment>

            {/* Rendered when a fetch call is made */}
            {loading && (
                <Box sx={{ textAlign: "center" }}>
                    <CircularProgress />
                </Box>
            )}

            {/* Rendered after a succesfull fetch call */}
            {ordersData && (
                <Fragment>
                    <Title>Recent Orders</Title>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Order ID</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Gross Total</TableCell>
                                <TableCell>Net Total</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {ordersData.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell>{order.id}</TableCell>
                                    <TableCell>
                                        {new Date(order.emitted_at).toLocaleDateString()}
                                        &nbsp;at&nbsp;
                                        {new Date(order.emitted_at).toLocaleTimeString()}
                                    </TableCell>
                                    <TableCell>R${order.gross_total}</TableCell>
                                    <TableCell>R${order.net_total}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {/* Link to go to the orders page */}
                    <Link color="primary" onClick={goToOrders} sx={{ mt: 3, cursor: "pointer" }}>
                        See more orders
                    </Link>
                </Fragment>
            )}

            {/* Rendered when the fetch call was made but returned a 404 status */}
            {!ordersData && !loading && (<Title>{noDataMesage}</Title>)}
        </Fragment>
    );
}
