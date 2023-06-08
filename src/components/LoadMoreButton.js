import { Button, CircularProgress } from "@mui/material";
import AutorenewIcon from "@mui/icons-material/Autorenew"; 

const useStyles = () => ({    
    loadBtnWrapper: {
      display: 'flex',
      justifyContent: 'center',
    },
    loadBtn: {
      marginTop: '0.8em',
      marginBottom: '0.4em',
      width: '50%',
      display: 'flex',
    }
});

const LoadMoreButton = ({ handleLoadPosts, loading }) => {
    const classes = useStyles();

    return (
        <div style={classes.loadBtnWrapper}>
            <Button color="primary" 
            variant="outlined" 
            size="large"
            onClick={handleLoadPosts}
            startIcoon={!loading && <AutorenewIcon />}
            style={classes.loadBtn}
            disables={loading}
            >
                { loading && (
                    <CircularProgress disableShrink
                        size={22}
                        style={{ marginRight :  '1em'}}
                    />
                )}
                {loading ? 'Loading...' : 'Load More'}
            </Button>
        </div>
    );
};

export default LoadMoreButton; 