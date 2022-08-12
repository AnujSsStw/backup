import React from "react";
import ReactDOM from "react-dom/client";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  gql,
  createHttpLink,
} from "@apollo/client";
import App from "./App";
import { setContext } from "@apollo/client/link/context";
import { getAccessToken } from "./accessToken";

const authLink = setContext((_, { headers }) => {
  // get the authentication token from accesstoken.ts
  const token = getAccessToken();
  // return the headers to the context so httpLink can read them
  console.log("checking", token);
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const httpLink = createHttpLink({
  uri: "http://localhost:4000/graphql",
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  credentials: "include",
  link: authLink.concat(httpLink),
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <ApolloProvider client={client}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ApolloProvider>
);
