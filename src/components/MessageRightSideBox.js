import {Avatar, Button, Grid, TextField, Typography} from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import logo from "../assets/DevSolver-logo.png";
import { gql, useLazyQuery, useMutation, useSubscription } from "@apollo/client";
import { GET_MESSAGE } from "../graphql/queries"; 
import { getErrorMsg } from "../utils/helperFunction";
import { useEffect, useRef, useState } from "react";
import Spinner from "./Spinner";
import { useForm } from "react-hook-form";
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { SEND_MESSAGE } from "../graphql/mutations";
import { useStateContext } from "../context/stateContext";
import { decryptWithAES, encryptWithAES } from "../utils/encryptDecrypt";
import { NEW_MESSAGE } from "../graphql/subscription";

const useStyles = () => ({
    container: {
        width: "80%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderLeft: "1px solid #C4C4C4"
    },
    noContent: {
        width: "80%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        borderLeft: "1px solid #C4C4C4"
    },
    userContainer: {
        display: "flex",
        alignItem: "center",
        width: "100%", 
        height: "55px",
        border: "1px solid #C4C4C4",
        padding: "5px"
    },
    messageInputBox: {
        width: "93%", 
        borderRadius: "10px",
        bottom: "0",
        marginLeft: "10px"
    },
    messageBoxContainer: {
        height: "90%",
        display: "flex",
        flexDirection: "row"
    },
    inputBox: {
        width: "100%",
        display: "flex",
        alignItem: "center"
    },
    messageContainer: {
        width: "100%",
        display: "flex",
        flexDirection: "column",
        height: "90%",        
        overflowY: "scroll"
    },
    senderMessage: { 
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        border: "2px solid #97C6E3",
        borderRadius: "10px",
        padding: "5px",
        margin: "5px",
        height: "fit-content",
        width: "fit-content", 
        color: "#6a5656",
        maxWidth: "70%",
        backgroundColor: "#A8DDFD",
        marginBottom: "1px"
    },
    receiverMessage: { 
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        border: "2px solid #dfd087",
        borderRadius: "10px",
        padding: "5px",
        margin: "5px",
        height: "fit-content",
        width: "fit-content",
        color: "#6a5656",
        maxWidth: "70%",
        backgroundColor: "#f8e896"
    },
    senderMessageContainer: {
        display: "flex", justifyContent: "flex-end", margin: "5px"
    },
    receiverMessageContainer: {
        display: "flex", justifyContent: "flex-start", margin: "5px"
    }
});


const validationSchema = yup.object({
    content: yup.string().required('Required').min(1)
});

const MessageRightSideBox = ({ user, selectedUser}) => {
    const classes = useStyles();    
    const {notify} = useStateContext();
    const scrollRef = useRef(); 
    const { register, handleSubmit, reset, formState: {error}} = useForm({
        mode: "onSubmit",
        resolver: yupResolver(validationSchema)
    });
    
    const [fetchMessages, {data, loading, subscribeToMore }] = useLazyQuery(GET_MESSAGE,{
        onError: (err) => {
            console.log(err);
            notify(getErrorMsg(err), 'error');
        }
    });
    
    const [sendMessage, {loading: postMessageLoading}] = useMutation(SEND_MESSAGE, {
        onError: (err) => { 
            console.log(err);
            notify(getErrorMsg(err), 'error');
        }
    });
    
    const { error: subscriptionError} = useSubscription(NEW_MESSAGE, {
        onSubscriptionData: ({client, subscriptionData}) => {
            const newMessage = subscriptionData.data.newMessage;
            console.log(newMessage);
            const receiverId = (user.id != newMessage.receiver.id) ? newMessage.receiver.id : newMessage.sender.id;
            const conversation = client.readQuery({
                query: GET_MESSAGE,
                variables: {userId: receiverId.toString()}
            }); 
            
            if(conversation){
                const updatedCache = [
                    ...conversation.getMessages,
                    newMessage
                ]
                console.log(updatedCache);
                client.writeQuery({
                    query: GET_MESSAGE,
                    variables: {userId: receiverId.toString()},
                    data: {
                        getMessages: updatedCache
                    }
                })
            }
        }
    });

    if(subscriptionError){
        console.log(subscriptionError);
    }
    // useEffect(() => {
    //     if(selectedUser != ""){     
    //         subscribeToMore({
    //             document: gql`
    //               subscription NewMessage($sender: String!, $receiver: String!) {
    //                 newMessage(sender: $sender, receiver: $receiver) {
    //                   id
    //                   content
    //                   sender{
    //                     id
    //                     username
    //                   }
    //                   receiver{
    //                     id
    //                     username
    //                   }
    //                   createdAt
    //                 }
    //               }
    //             `,
    //             variables: { sender: user.id.toString(), receiver: selectedUser.id.toString() },
    //             updateQuery: (prev, { subscriptionData }) => {  
    //                 if (!subscriptionData?.data) return prev;
    //                 const newMessage = subscriptionData?.data?.newMessage;
    //                 console.log(user,newMessage?.receiver);
    //                 // if(user.id.toString() != newMessage?.receiver?.id.toString()){
    //                 //     return Object.assign({}, prev, {
    //                 //         getMessages: [...prev?.getMessages],
    //                 //     });
    //                 // }
    //                 return Object.assign({}, prev, {
    //                     getMessages: [...prev?.getMessages, newMessage],
    //                 });
    //             },
    //         });
    //     }
    // },[user, selectedUser ,subscribeToMore]);
    
    useEffect(() => {
        if(selectedUser !== ""){ 
            fetchMessages({variables: {userId: selectedUser.id.toString()}});
        }
    }, [selectedUser]);

    useEffect(() => {        
        scrollRef.current?.scrollIntoView({behaviour: "smooth"}); 
    },[data?.getMessages]); 

    const onPostMessage = ({content}) => { 
        if(content.trim == ""){
            return notify("Message should not be empty!", 'error');
        }
        let encryptedContent = encryptWithAES(content);
        sendMessage({
            variables: { content: encryptedContent, receiver: selectedUser.id.toString() },
            update: (proxy, {data}) => {
                reset();
                // const dataInCache = proxy.readQuery({
                //     query: GET_MESSAGE,
                //     variables: {sender: user.id.toString() , receiver: selectedUser.id.toString()}
                // });

                // const updatedData = [
                //     ...dataInCache.getMessages
                // ];  
                // proxy.writeQuery({
                //     query: GET_MESSAGE,
                //     variables: {sender: user.id.toString() , receiver: selectedUser.id.toString()},
                //     data: { getMessages: updatedData },
                // });
                if(data?.sendMessage.receiver.id.toString() == user.id.toString()){
                    notify(`${data?.sendMessage.sender.username} sent you a message!`)
                }else{
                    notify('Message sent!');
                }
            }
        });         
    }

    if(selectedUser === ""){
        return (
            <div style={classes.noContent}>
                <img style={{width: "10em", height: "10em"}} src={logo} alt="" />
                <h1>WelCome To Devsolver Chat</h1>
             </div>
        );
    }  

    if(loading){
        return (
            <div style={{ minWidth: '100%', marginTop: '20%' }}>
                <Spinner size={80} />
            </div>
        );
    }
    
    return (
       <div style={classes.container}>
            <Grid container style={classes.userContainer}>
                <Avatar
                    alt={selectedUser.username}
                    src={`https://secure.gravatar.com/avatar/${selectedUser.id}?s=164&d=identicon`}
                    style={classes.avatar}
                />
                <p style={{color: "#1976D2", marginLeft: "7px", marginTop: "10px"}}>{selectedUser.username}</p>
            </Grid>
            <Grid container style={classes.messageBoxContainer}>
                <Grid item   style={classes.messageContainer}>
                    {
                        data?.getMessages?.map((message) => (
                            <div ref={scrollRef} style= {(message.sender.id == user.id && message.receiver.id.toString() == selectedUser?.id.toString()) ? classes.senderMessageContainer : classes.receiverMessageContainer}>
                                <Typography style={(message.sender.id == user.id && message.receiver.id.toString() == selectedUser?.id.toString()) ? classes.senderMessage : classes.receiverMessage} variant="body2">
                                   {decryptWithAES(message.content)}
                                    <p style={{ fontSize: "9px", fontWeight: "600", margin: "1px", color: "#000000a3"}}>{message.createdAt.slice(0,10)}</p>
                                    <p style={{ fontSize: "9px",fontWeight: "600", margin: "1px", color: "#000000a3"}}>{message.createdAt.slice(11,19)}</p>
                                </Typography>
                            </div>
                        ))
                    } 
                </Grid>
                <Grid container  >
                   <form style={classes.inputBox} onSubmit={handleSubmit(onPostMessage)}>
                        <TextField {...register("content")} name="content" style={classes.messageInputBox} placeholder="Enter your message here" />
                        <Button type="submit">
                           <SendIcon style={{color: "#1976D2", fontSize: "30px", margin: "auto"}} /> 
                        </Button>
                   </form>
                </Grid> 
            </Grid>
        </div> 
         
    );
}

export default MessageRightSideBox;