import { gql } from "@apollo/client";

export const NEW_MESSAGE = gql`
    subscription newMessage{
        newMessage{
            id
            content
            receiver{
                id
                username
            }
            sender{
                id
                username
            }
            createdAt
        }
    }
`;

export const WHOLE_NEW_MESSAGE = gql`
    subscription wholeNewMessage{
        wholeNewMessage{
            id
            username
        }
    }
`;