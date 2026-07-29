import { generateClient } from 'aws-amplify/api';

const client = generateClient();

const formatGraphqlError = (err) => {
  if (!err) return 'Unknown GraphQL error';
  if (Array.isArray(err.errors) && err.errors.length) {
    return err.errors
      .map((e) => {
        const path = Array.isArray(e.path) ? e.path.join('.') : '';
        const type = e.errorType ? `[${e.errorType}] ` : '';
        return `${type}${e.message || 'Unknown error'}${path ? ` (path: ${path})` : ''}`;
      })
      .join('; ');
  }
  if (err.message) return err.message;
  try {
    return JSON.stringify(err);
  } catch {
    return String(err);
  }
};

const runGraphql = async (doc, variables) => {
  try {
    const response = await client.graphql({
      query: doc,
      variables,
      authMode: 'apiKey',
    });
    if (response && Array.isArray(response.errors) && response.errors.length) {
      const error = new Error(formatGraphqlError(response));
      error.graphqlErrors = response.errors;
      error.graphqlData = response.data;
      throw error;
    }
    return response;
  } catch (err) {
    if (err && err.graphqlErrors) throw err;
    const error = new Error(formatGraphqlError(err));
    error.graphqlErrors = err && err.errors;
    error.graphqlData = err && err.data;
    error.cause = err;
    throw error;
  }
};

export const graphqlQuery = async (query, variables = {}) => runGraphql(query, variables);

export const graphqlMutation = async (mutation, variables = {}) => runGraphql(mutation, variables);

/** Read list items from a successful response, thrown error, or Promise.allSettled result. */
export const getListItemsFromGraphqlResult = (source, listKey) => {
  if (!source) return [];

  const payload =
    source.data ??
    source.graphqlData ??
    source.value?.data ??
    source.reason?.graphqlData ??
    source.reason?.data;

  return (payload?.[listKey]?.items ?? []).filter(Boolean);
};

/** Like graphqlQuery, but returns usable list rows when AppSync rejects individual items. */
export const graphqlQueryList = async (query, listKey, variables = {}) => {
  try {
    const result = await graphqlQuery(query, variables);
    return {
      items: getListItemsFromGraphqlResult(result, listKey),
      warning: null,
    };
  } catch (err) {
    const items = getListItemsFromGraphqlResult(err, listKey);
    if (items.length) {
      return { items, warning: err.message };
    }
    throw err;
  }
};

/** Extract list items from Promise.allSettled() output. */
export const settledListItems = (settledResult, listKey) => {
  if (!settledResult) return [];
  if (settledResult.status === 'fulfilled') {
    return getListItemsFromGraphqlResult(settledResult.value, listKey);
  }
  return getListItemsFromGraphqlResult(settledResult.reason, listKey);
};
