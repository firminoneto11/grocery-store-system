
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '1px solid #000',
    boxShadow: 24,
    p: 4,
    borderRadius: '3px'
};

export default function CustomModal({ active, close, children }) {

    return (
        <Modal open={active} onClose={close} closeAfterTransition BackdropComponent={Backdrop}
            aria-labelledby="transition-modal-title" aria-describedby="transition-modal-description"
            BackdropProps={{ timeout: 500 }}>
            <Fade in={active}>
                <Box sx={style}>{children}</Box>
            </Fade>
        </Modal>
    );
}

// import Typography from '@mui/material/Typography';
{/*
<Typography id="transition-modal-title" variant="h6" component="h2">
    Text in a modal
</Typography>
<Typography id="transition-modal-description" sx={{ mt: 2 }}>
    Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
</Typography>
*/}
