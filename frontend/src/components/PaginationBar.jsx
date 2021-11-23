
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export default function PaginationBar({ pageProps }) {

    // TODO: Reset the page count after a search for a blank value or clicking on the 'get all products' button!

    const pageSwap = (event, value) => {
        if (value !== 1) {
            const page = `http://localhost:8000/api/v1/products/?page=${value}`;
            pageProps.getProducts(page);
            return;
        }
        pageProps.getProducts();
    }

    return (
        <Pagination
            count={pageProps.pagesAmount}
            onChange={pageSwap}
            renderItem={(item) => (
                <PaginationItem
                    components={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
                    {...item}
                />
            )}
        />
    );
}
