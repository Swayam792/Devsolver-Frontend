import { useStateContext } from "../context/stateContext.js";

import {Snackbar} from "@mui/material";
import Alert from '@mui/material/Alert';

const ToastNotification = () => {
    const { notification, clearNotif } = useStateContext();

    if(!notification?.message) return null;

    const { message, severity } = notification;

    return (
        <Snackbar open={!!notification} onClose={() => clearNotif()} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
            <Alert onClose={() => clearNotif()} severity={severity}>
                {message}
            </Alert>
        </Snackbar>
    );
}

export default ToastNotification;