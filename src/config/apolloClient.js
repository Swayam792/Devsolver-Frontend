import { ApolloClient, HttpLink , InMemoryCache } from "@apollo/client";
import backendURL from "./backendUrl.js";
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { split } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { setContext } from "@apollo/client/link/context";
import { loadUser } from "../utils/localStorage.js";

const httpLink = new HttpLink({
    uri: backendURL
});

const wsLink = new GraphQLWsLink(createClient({
    url: 'wss://devsolver-backend.onrender.com/graphql',
}));

const authLink = setContext(() => {
    const loggedUser = loadUser();
    return {
        headers: {
            authorization: loggedUser ? loggedUser.token: null
        },
    };
});

const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      );
    },
    wsLink,
    httpLink,
);

const client = new ApolloClient({
    link: authLink.concat(splitLink),
    cache: new InMemoryCache()
});

export default client;