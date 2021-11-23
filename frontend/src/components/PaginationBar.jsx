
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useEffect, useState } from 'react';

export default function PaginationBar({ pageProps }) {

    const [curPage, setCurPage] = useState(1);

    const pageSwap = (event, value) => {
        setCurPage(value);
        if (value !== 1) {
            const page = `http://localhost:8000/api/v1/products/?page=${value}`;
            pageProps.getProducts(page);
            return;
        }
        pageProps.getProducts();
    }

    useEffect(() => {
        if (pageProps.shouldHide) setCurPage(1);
        if (pageProps.shouldReset) {
            setCurPage(1);
            pageProps.setShouldReset(false);
        }
    }, [{ shouldHide: pageProps }, { shouldReset: pageProps }])

    return (
        <Pagination
            count={pageProps.pagesAmount}
            onChange={pageSwap}
            page={curPage}
            renderItem={(item) => (
                <PaginationItem
                    components={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
                    {...item}
                />
            )}
        />
    );
}
