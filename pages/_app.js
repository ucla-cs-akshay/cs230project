import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client"
import "semantic-ui-css/semantic.min.css"

import "../styles/index.css"

const gqlClient =
  new ApolloClient({
    uri: "https://sourcegraph.com/.api/graphql",
    headers: {
      Authorization: "94d9eac7ca1c5311c74d0525ac9271b3c08c346d"
    },
    cache: new InMemoryCache()
  })

function MyApp({ Component, pageProps }) {

  return (
    <Component {...pageProps } {...{ gqlClient }} />
  )
}

export default MyApp
