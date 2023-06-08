import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App'; 
import {BrowserRouter as Router} from 'react-router-dom';
import {ApolloProvider} from "@apollo/client";
import { AuthProvider } from './context/authContext.js';
import { StateProvider } from './context/stateContext.js';
import client from './config/apolloClient.js';

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(  
    <ApolloProvider client={client}>
        <Router>
            <AuthProvider>
                <StateProvider>
                 <App />
                </StateProvider>
            </AuthProvider>        
        </Router>  
    </ApolloProvider>
); 