import { gql } from "@apollo/client";
import { ANSWER_DETAILS, AUTHOR_DETAILS, COMMENT_DETAILS } from "./fragments.js";

export const GET_USER = gql`
    query fetchUser($username: String!){
        getUser(username: $username){
            id
            username
            role
            createdAt  
            totalQuestions
            reputation
            totalAnswers
            recentQuestions {
                id
                title
                points
                createdAt
            }
            recentAnswers {
                id
                title
                points
                createdAt
            }
        }
    }
`;

export const GET_ALL_USERS = gql`
    query {
        getAllUsers {
            id
            username
            createdAt
        }
    }
`;

export const GET_ALL_TAGS = gql`
    query {
        getAllTags {
            tagName
            count
        }
    }
`;

export const GET_QUESTIONS = gql`
    query fetchQuestions($sortBy: SortByType!, $page: Int!, $limit: Int!, $filterByTag: String, $filterBySearch: String){
        getQuestions(sortBy: $sortBy, page: $page, limit: $limit, filterByTag: $filterByTag, filterBySearch: $filterBySearch){
            next {
                page
            }
            previous {
                page
            }
            questions {
                id
                author {
                    ...AuthorDetails
                }
                title
                body
                tags
                points
                views
                createdAt
                updatedAt
                answerCount
            }
        }
    }
    ${AUTHOR_DETAILS}
`;

export const VIEW_QUESTION = gql`
    query fetQuestion($quesId: ID!) {
        viewQuestion(quesId: $quesId){
            id
            author {
                ...AuthorDetails
            }
            title
            body
            tags
            points
            views
            createdAt
            updatedAt
            answers {
                ...AnswerDetails
            }
            author {
                ...AuthorDetails
            }
            comments {
                ...CommentDetails
            }
            acceptedAnswer
            upvotedBy
            downvotedBy
        }
    }

    ${ANSWER_DETAILS}
    ${COMMENT_DETAILS}
    ${AUTHOR_DETAILS}
`;

export const GET_ALL_MESSAGES = gql`
    query fetchAllMessages {
        getAllMessages {
            id
            sender{
                id
                username
            }
            receiver{
                id
                username
            }
        }
    }
`;

export const GET_MESSAGE = gql`
    query fetchMessages($userId: String!){
        getMessages(userId: $userId){
            id
            content
            sender{
                id
                username
            }
            receiver{
                id
                username
            }
            createdAt 
        }
    }
`;

export const GET_UNSEEN_MESSAGES = gql`
    query getUnseenMessageCount{
        getUnseenMessageCount{
            sender
            count
        }
    }
`;