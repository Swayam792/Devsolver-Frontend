import { InputAdornment, TextField, IconButton } from '@mui/material';
import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
 
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';  

const useStyles = () => ({
  searchBar: {
      flexGrow: 0.6,
      mobileStyle: {
          flexGrow: 1,
          marginLeft: '0.6em',
          marginRight: '0.6em'
      },
  },
  searchBtn: {
      padding: '0.2em'
  },    
});


const SearchBar = ({isMobile, setSearchOpen}) => {
  const [searchInput, setSearchInput] = useState('');
  const navigate = useNavigate();  
  const classes = useStyles(); 

  const handleSearch = (e) => {
    e.preventDefault();
    if(searchInput === '')return;
    navigate(`/search/${searchInput}`);
  }

  const clearSearch = () => {
    if(isMobile){
        setSearchOpen(false);
    }
    setSearchInput('');
  }

  return (
    <div style={!isMobile ? classes.searchBar: classes.searchBar.mobileStyle}>
        <form onSubmit={handleSearch}>
            <TextField
              type='search'
              size='small'
              placeholder='Search for question'
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              variant='outlined'
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="primary" />
                  </InputAdornment>
                ),
                endAdornment: (searchInput || isMobile) && (
                  <InputAdornment position="end">
                    <IconButton color="primary" size="small" onClick={clearSearch}>
                      <ArrowBackIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            /> 
        </form>
    </div>
  );
}

export default SearchBar;
 