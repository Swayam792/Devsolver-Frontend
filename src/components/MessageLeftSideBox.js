import { useMutation, useQuery } from "@apollo/client";
import { Avatar, Grid, MenuItem } from "@mui/material";
import { useEffect, useState } from "react";
import { GET_UNSEEN_MESSAGES } from "../graphql/queries"; 
import { getErrorMsg } from "../utils/helperFunction";
import { useStateContext } from "../context/stateContext";
import Spinner from "./Spinner";
import { MARK_SEEN } from "../graphql/mutations";
import { WHOLE_NEW_MESSAGE } from "../graphql/subscription";

const useStyles = () => ({
    container: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "92%",
        paddingLeft: "0px",
        paddingRight: "0px",
        overflow: "scroll",
        overflowX: "hidden",
        msOverflowStyle: "none",
        scrollbarWidth: "none",
    },
    heading: {
        fontSize: "24px", fontWeight: "800", color: "#9C27B0",
        margin: "0px", padding: "10px", width: "auto"
    },
    userContainer: {
        display: "flex",
        flexDirection: "row",
        alignItem: "center",
        justifyContent: "flex-start",
        width: "100%",
        height: "60px",
        borderBottom: "1px solid #C4C4C4",
        paddingLeft: "5px",
    },
    avatar: {
        height: "80%",
        margin: "auto 8px auto 0px"
    },
    messageCount: {
        border: "1px solid red",
        padding: "3px",
        height: "1em",
        borderRadius: "50%",
        width: "1em",
        fontWeight: "800",
        fontSize: "10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "red",
        color: "white"
    }
});

const MessageLeftSideBox = ({ user, userContacts, setSelectedUser, selectedUser }) => {     
    const classes = useStyles(); 
    const { notify } = useStateContext();
    // const {data: unseenMessage, loading: seenMessageLoading, subscribeToMore} = useQuery(GET_UNSEEN_MESSAGES, { 
    //     onError: (err) => {
    //         notify(getErrorMsg(err), 'error');
    //     }
    // });

    // const [markSeenFunc, {loading}] = useMutation(MARK_SEEN,{
    //     onError: (err) => {
    //         notify(getErrorMsg(err), 'error');
    //     }
    // });

    // useEffect(() => {
         
    // },[selectedUser])

    const handleSelectedUser = (contact) => { 
        if(contact != ""){
            setSelectedUser(contact); 
            // markSeenFunc({
            //     variables: {sender: contact.id},
            //     update: (proxy,{ data }) => {
            //         const dataInCache = proxy.readQuery({
            //             query: GET_UNSEEN_MESSAGES
            //         }); 
            //         const updatedData = dataInCache?.getUnseenMessageCount.filter((a) => { 
            //             return a.sender.toString() !== contact.id.toString()
            //         }); 
            //         console.log(updatedData);
            //         if(updatedData?.length == 0){
            //             proxy.writeQuery({
            //                 query: GET_UNSEEN_MESSAGES,
            //                 data: {getUnseenMessageCount: []}
            //             });
            //         }
            //         proxy.writeQuery({
            //             query: GET_UNSEEN_MESSAGES,
            //             data: {getUnseenMessageCount: updatedData}
            //         });
            //     }
            // })
        }   
    } 
     
    // useEffect(() => { 
    //     if(selectedUser != ""){
    //         subscribeToMore({
    //             document: WHOLE_NEW_MESSAGE,
    //             updateQuery: (prev, { subscriptionData }) => {
    //                 if (!subscriptionData.data) return prev;
    //                 const newMessage = subscriptionData.data.wholeNewMessage;
    //                 let allSenderUsers = prev?.getUnseenMessageCount.map((user) => {
    //                     return {sender: user.sender, count: user.count};
    //                 });
                   
    //                 let allUsers = [...allSenderUsers];   
    //                 console.log(allUsers);
    //                 let isUserExist = allUsers.find((a) => a.sender.toString() == newMessage.id.toString());
    //                 console.log(isUserExist);
    //                 if(isUserExist){
    //                     let updatedData = prev?.getUnseenMessageCount.map((a) => {
    //                         if(newMessage.id.toString() == selectedUser.id.toString()){
    //                             return {sender: a.sender, count: 0}
    //                         }
    //                         else if(a.sender.toString() == newMessage.id.toString()){
    //                             return {sender: a.sender, count: a.count + 1}
    //                         }else{
    //                             return {sender: a.sender, count: a.count}
    //                         }
    //                     });
    //                     let upData = updatedData.filter((a) => {
    //                          return a.count > 0
    //                     }); 
    //                     console.log(upData);
    //                     return Object.assign({}, prev, {
    //                         getUnseenMessageCount: upData
    //                     });
    //                 }else{
    //                     let updata = newMessage.id.toString() !== selectedUser.id.toString() ? {
    //                         getUnseenMessageCount: [...prev?.getUnseenMessageCount, {sender: newMessage.id, count: 1}]
    //                     }: {
    //                         getUnseenMessageCount: [...prev?.getUnseenMessageCount]
    //                     }
    //                     console.log(updata);
    //                     return Object.assign({}, prev, updata);
    //                 }
    //             }
    //         }) 
    //     }
    // }, [user, selectedUser, subscribeToMore]);
    
    
    return (
        <div style={{ width: "20%" }}>
            <p style={classes.heading}>Messages</p>
            <Grid item style={classes.container}>
                {
                    userContacts?.map((contact) => (
                        contact.id != user.id && <MenuItem
                            key={contact.id}
                            style={classes.userContainer}
                            selected={
                                contact.id == selectedUser
                            }
                            onClick={() => handleSelectedUser(contact)}
                        >
                            <Avatar
                                alt={contact.username}
                                src={`https://secure.gravatar.com/avatar/${contact.id}?s=164&d=identicon`}
                                style={classes.avatar}
                            />
                            <p style={{ color: "#1976D2" }}>{contact.username}</p>
                            <div style={{width: "4em", display: "flex", justifyContent: "flex-end"}}>
                                {
                                    // unseenMessage?.getUnseenMessageCount?.map((a) => ( 
                                    //     a.sender.toString() == contact.id.toString()
                                        //    && 
                                        //    <p key={a.sender} style={classes.messageCount}>{a.count}</p> 
                                    // )) 
                                }                                    
                            </div>
                        </MenuItem>  
                    ))
                }
            </Grid>
        </div>
    );
}

export default MessageLeftSideBox;