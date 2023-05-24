// import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Button,
  Image,
  TouchableNativeFeedback,
  TouchableOpacityBase,
  TouchableOpacity,
  Alert,
  Platform,
  StatusBar,
  Dimensions,
  TextInput,
  FlatList,
  ScrollView,
} from "react-native";

import { useDeviceOrientation } from "@react-native-community/hooks";

import {
  ApolloProvider,
  ApolloClient,
  HttpLink,
  InMemoryCache,
  gql,
} from "@apollo/client";

import { useQuery } from "@apollo/react-hooks";

const HASURA_PROJECT_GRAPHQL_ENDPOINT = "https://nftval.hasura.app/v1/graphql";

export const createApolloClient = ({ authToken } = {}) => {
  if (authToken) {
    return new ApolloClient({
      link: new HttpLink({
        uri: HASURA_PROJECT_GRAPHQL_ENDPOINT,
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      }),
      cache: new InMemoryCache(),
    });
  } else {
    return new ApolloClient({
      link: new HttpLink({
        uri: HASURA_PROJECT_GRAPHQL_ENDPOINT,
      }),
      cache: new InMemoryCache(),
    });
  }
};

export default function App() {
  const [state, setState] = useState();
  const [loading, setLoading] = useState(false);
  const apolloClient = createApolloClient();

  // console.log(apolloClient);

  const GetDealsByMerchantId = gql`
    query {
      deals {
        id
        merchant_id
        description
        title
        created_at
        updated_at
        collectionDeals {
          collection {
            contract_address
            name
            image
          }
        }
      }
    }
  `;

  useEffect(() => {
    (async () => {
      // Call Hasura to fetch deals of merchat Id 3
      console.log("Use effect");
      setLoading(true);
      const { data } = await apolloClient.query({
        query: GetDealsByMerchantId,
      });
      console.log("FDFDF", data.deals[0].title);
      setState(data);
      setLoading(false);
    })();
  }, []);

  return (
    // <ApolloProvider client={apolloClient}>
    <SafeAreaView style={styles.container}>
      <View
        style={{
          backgroundColor: "red",
          width: "100%",
          height: 300,
          flex: 1,
          flexDirection: "row",
        }}
      >
        <View style={{ backgroundColor: "black", flex: 1 }} />
        <View style={{ backgroundColor: "gold", flex: 1 }} />
        <View style={{ backgroundColor: "tomato", flex: 1 }} />
      </View>
      <TextInput
        style={{
          padding: 20,
          marginTop: 10,
          backgroundColor: "pink",
          color: "red",
        }}
      />
      <Button title="Submit" />
      <ScrollView>
        {loading && <Text style={styles.container}>Loading.....</Text>}
        {state &&
          state.deals.map((item, key) => <Text key={key}>{item.title}</Text>)}
      </ScrollView>
    </SafeAreaView>

    // </ApolloProvider>
  );
}

// 1. This create the validation for style property
// 2. React Native are working optimization so it good to work on the this
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});
