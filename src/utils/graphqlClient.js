import { API, graphqlOperation } from 'aws-amplify';

// Helper function to make GraphQL calls with API_KEY authentication
export const graphqlQuery = async (query, variables = {}) => {
  const operation = graphqlOperation(query, variables);
  return await API.graphql({
    ...operation,
    authMode: 'API_KEY',
  });
};

export const graphqlMutation = async (mutation, variables = {}) => {
  const operation = graphqlOperation(mutation, variables);
  return await API.graphql({
    ...operation,
    authMode: 'API_KEY',
  });
};

