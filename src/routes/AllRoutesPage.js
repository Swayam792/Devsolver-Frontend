import { Container } from '@mui/material';
import {Route, Routes} from 'react-router-dom'; 
import {Grid} from '@mui/material';
import NavMenuDesktop from "../components/NavMenuDesktop.js";
import UserPage from "../pages/UserPage.js";
import NotFoundPage from '../pages/NotFoundPage.js';
import RightSidePanel from "../components/RightSidePanel.js";
import QuestionListPage from '../pages/QuesListPage.js';
import AskQuestionPage from '../pages/AskQuestionPage.js';
import QuestionPage from '../pages/QuestionPage.js';
import AllUsersPage from '../pages/AllUsersPage.js';
import AllTagsPage from '../pages/AllTagsPage.js';
import MessagePage from '../pages/MessagePage.js';
import { useAuthContext } from '../context/authContext.js';

const AllRoutes = () => { 
    const user = useAuthContext();
    return (
        <Container disableGutters>
            <Grid container direction="row" wrap="nowrap" justify="space-between">
                <Routes>
                    <Route exact path="/" 
                      element={[<NavMenuDesktop />, <QuestionListPage />, <RightSidePanel />]}
                    /> 

                    <Route exact path='/users'
                      element={[<NavMenuDesktop />, <AllUsersPage />]} 
                    /> 

                    <Route exact path="/user/:username" 
                    element={[<NavMenuDesktop />, <UserPage />]}/>

                    <Route exact path="/questions/:quesId" 
                    element={[<NavMenuDesktop />, <QuestionPage />]}/>

                    <Route exact path="/tags" 
                    element={[<NavMenuDesktop />, <AllTagsPage />]}/>

                    <Route exact path="/tags/:tagName" 
                    element={[<NavMenuDesktop />, <QuestionListPage tagFilterActive={true} />, <RightSidePanel />]}/>
 
                    <Route exact path="/search/:query" 
                    element={[<NavMenuDesktop />, <QuestionListPage searchFilterActive={true} />, <RightSidePanel />]}/>

                    <Route exact path="/ask" 
                        element={[
                        <NavMenuDesktop />,
                        <AskQuestionPage />,
                        <RightSidePanel />]}
                    />  

                    <Route exact path="/messages" element={[<MessagePage />]}/> 

                    <Route path='*' element={[<NavMenuDesktop />, <NotFoundPage />, <RightSidePanel />]} />  
                </Routes>   
            </Grid>
        </Container>
    );
};

export default AllRoutes;