import { Grid } from "@mui/material";
import MessageLeftSideBox from "../components/MessageLeftSideBox";
import MessageRightSideBox from "../components/MessageRightSideBox";
import {useAuthContext} from "../context/authContext.js";
import { useQuery } from "@apollo/client";
import { GET_ALL_MESSAGES } from "../graphql/queries";
import { getErrorMsg } from "../utils/helperFunction"; 
import Spinner from "../components/Spinner";
import { useStateContext } from "../context/stateContext";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";

const useStyles = () => ({
    messageContainer: {
        width: "100vw",
        height: "90vh",
        display: "flex",
        flexDirection: "row",
        border: "1px solid #C4C4C4"
    },
    leftContainer: {
        width: "30%" 
    }
});

const MessagePage = () => {
    const classes = useStyles();
    const {user} = useAuthContext();
    const {notify} = useStateContext();
    const [searchParams] = useSearchParams(); 
    const [userContacts, setUserContacts] = useState([]);
    const {state} = useLocation(); 
    const [selectedUser, setSelectedUser] = useState((state?.username && state?.id)? {username: state.username,id: state.id} :"");
    const navigate = useNavigate();
    const {loading, data} = useQuery(GET_ALL_MESSAGES, {
        fetchPolicy: "no-cache",
        onError: (err) => {
            notify(getErrorMsg(err), 'error');
        }
    }); 
    useEffect(() => {
        if(data){
            let allSenderUsers = data?.getAllMessages.map((user) => {
                return {id: user.sender.id, username: user.sender.username};
            });
            let allReceiverUser = data?.getAllMessages.map((user) => {
                return {id: user.receiver.id, username: user.receiver.username};
            });
            let allUsers = [...allSenderUsers, ...allReceiverUser];             
            setUserContacts([... new Map(allUsers.map((user) => [user['id'], user])).values()]);
        }
    },[data]);

    if(loading){
        return (
            <div style={{ minWidth: '100%', marginTop: '20%' }}>
                <Spinner size={80} />
            </div>
        );
    } 

    if(!user){ 
        return navigate("/");
    }
    return (
        user && <Grid style={classes.messageContainer}>
            <MessageLeftSideBox user={user} setSelectedUser={setSelectedUser} selectedUser={selectedUser} userContacts={userContacts} style={classes.leftContainer} /> 
            <MessageRightSideBox user={user} selectedUser={selectedUser}/>
        </Grid>
    );
};

export default MessagePage;