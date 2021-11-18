
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';

export default function Search({ searchAction }) {

    function submitHandler(event) {
        event.preventDefault();
        const value = event.target.product.value;
        event.target.product.value = '';
        searchAction(value);
    }

    return (
        <Paper onSubmit={submitHandler} autoComplete="off" component="form" sx={{ p: '2px 4px', display: 'flex', alignItems: 'center' }} >
            <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
                <SearchIcon />
            </IconButton>
            <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
            <InputBase name="product" sx={{ ml: 1, flex: 1 }} placeholder="Search a product" inputProps={{ 'aria-label': 'search a product' }} />
        </Paper>
    );
}
