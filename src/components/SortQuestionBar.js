import { ButtonGroup, Button } from "@mui/material";

const useStyles = () => ({
    btnGroupWrapper: {
        width: '100%',
        display: 'flex',
        justifyContent: 'flex-end',
        margin: '1em 0',
        mobileStyle: {
          width: '97%',
          margin: '1em auto',
        },
    },
});

const SortQuestionBar = ({ isMobile, sortBy, setSortBy}) => {
    const classes = useStyles();

    const handleSortChange = (e) => {
        setSortBy(e.target.innerText.toUpperCase());
    }

    return (
        <div style={!isMobile ? classes.btnGroupWrapper : classes.btnGroupWrapper.mobileStyle}>
            <ButtonGroup color="secondary" disableElevation size={isMobile ? 'small' : 'medium'} fullWidth={isMobile}>

                <Button variant={sortBy === 'HOT' ? 'contained' : 'outlined'}
                onClick={handleSortChange}>Hot</Button>

                <Button variant={sortBy === 'VOTES' ? 'contained' : 'outlined'} onClick={handleSortChange} > Votes </Button>

                <Button variant={sortBy === 'VIEWS' ? 'contained' 
                :'outlined'} onClick={handleSortChange}> Views </Button>

                <Button  variant={sortBy === 'NEWEST' ? 'contained' : 'outlined'} onClick={handleSortChange} > Newest </Button>

                <Button variant={sortBy === 'OLDEST' ? 'contained' : 'outlined'} onClick={handleSortChange}> Oldest</Button>

            </ButtonGroup>
         </div>
    );
}

export default SortQuestionBar;