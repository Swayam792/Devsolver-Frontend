import { CircularProgress } from "@mui/material";

const Spinner = ({ size, marginTop }) => {
    return (
        <div style={{ 
            textAlign: 'center',
            marginTop: marginTop || '3em',
            marginBottom: '1em'
        }}>
            <CircularProgress disableShrink  size={size || 40}/>
        </div>
    );
};

export default Spinner;