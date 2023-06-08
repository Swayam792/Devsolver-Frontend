import Error404 from "../assets/Error-404.png";

const useStyles = () => ({
    root: {
        width: '100%',
        marginTop: '1em',
        padding: '0.4em 1em',
    },
    imageWrapper: {
        display: 'flex',
        alignItem: 'center',
        justifyContent: 'center',
        width: '100%'
    }    
});

const NotFoundPage = () => {
    const classes = useStyles(); 
    
    return (
        <div style={classes.root}>
            <div style={classes.imageWrapper}>
                <img src={Error404} alt="Error page" />
            </div>
        </div>
    );
};

export default NotFoundPage;