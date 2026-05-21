/* eslint-disable */
// Custom GraphQL mutations aligned with amplify/backend/api/tsbelegaldocsapi/schema.graphql

export const createLegalApp = /* GraphQL */ `
  mutation CreateLegalApp(
    $input: CreateLegalAppInput!
    $condition: ModelLegalAppConditionInput
  ) {
    createLegalApp(input: $input, condition: $condition) {
      id
      name
      userLegalApps {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;

export const updateLegalApp = /* GraphQL */ `
  mutation UpdateLegalApp(
    $input: UpdateLegalAppInput!
    $condition: ModelLegalAppConditionInput
  ) {
    updateLegalApp(input: $input, condition: $condition) {
      id
      name
      userLegalApps {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;

export const deleteLegalApp = /* GraphQL */ `
  mutation DeleteLegalApp(
    $input: DeleteLegalAppInput!
    $condition: ModelLegalAppConditionInput
  ) {
    deleteLegalApp(input: $input, condition: $condition) {
      id
      name
      userLegalApps {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;

export const createUser = /* GraphQL */ `
  mutation CreateUser(
    $input: CreateUserInput!
    $condition: ModelUserConditionInput
  ) {
    createUser(input: $input, condition: $condition) {
      id
      name
      userLegalApps {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;

export const updateUser = /* GraphQL */ `
  mutation UpdateUser(
    $input: UpdateUserInput!
    $condition: ModelUserConditionInput
  ) {
    updateUser(input: $input, condition: $condition) {
      id
      name
      userLegalApps {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;

export const deleteUser = /* GraphQL */ `
  mutation DeleteUser(
    $input: DeleteUserInput!
    $condition: ModelUserConditionInput
  ) {
    deleteUser(input: $input, condition: $condition) {
      id
      name
      userLegalApps {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;

export const createUserLegalApp = /* GraphQL */ `
  mutation CreateUserLegalApp(
    $input: CreateUserLegalAppInput!
    $condition: ModelUserLegalAppConditionInput
  ) {
    createUserLegalApp(input: $input, condition: $condition) {
      id
      user {
        id
        name
      }
      legalApp {
        id
        name
      }
      createdAt
      updatedAt
      userUserLegalAppsId
      legalAppUserLegalAppsId
      __typename
    }
  }
`;

export const updateUserLegalApp = /* GraphQL */ `
  mutation UpdateUserLegalApp(
    $input: UpdateUserLegalAppInput!
    $condition: ModelUserLegalAppConditionInput
  ) {
    updateUserLegalApp(input: $input, condition: $condition) {
      id
      user {
        id
        name
      }
      legalApp {
        id
        name
      }
      createdAt
      updatedAt
      userUserLegalAppsId
      legalAppUserLegalAppsId
      __typename
    }
  }
`;

export const deleteUserLegalApp = /* GraphQL */ `
  mutation DeleteUserLegalApp(
    $input: DeleteUserLegalAppInput!
    $condition: ModelUserLegalAppConditionInput
  ) {
    deleteUserLegalApp(input: $input, condition: $condition) {
      id
      user {
        id
        name
      }
      legalApp {
        id
        name
      }
      createdAt
      updatedAt
      userUserLegalAppsId
      legalAppUserLegalAppsId
      __typename
    }
  }
`;

export const createLegalDocType = /* GraphQL */ `
  mutation CreateLegalDocType(
    $input: CreateLegalDocTypeInput!
    $condition: ModelLegalDocTypeConditionInput
  ) {
    createLegalDocType(input: $input, condition: $condition) {
      id
      name
      shortName
      description
      legalDocs {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;

export const updateLegalDocType = /* GraphQL */ `
  mutation UpdateLegalDocType(
    $input: UpdateLegalDocTypeInput!
    $condition: ModelLegalDocTypeConditionInput
  ) {
    updateLegalDocType(input: $input, condition: $condition) {
      id
      name
      shortName
      description
      legalDocs {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;

export const deleteLegalDocType = /* GraphQL */ `
  mutation DeleteLegalDocType(
    $input: DeleteLegalDocTypeInput!
    $condition: ModelLegalDocTypeConditionInput
  ) {
    deleteLegalDocType(input: $input, condition: $condition) {
      id
      name
      shortName
      description
      legalDocs {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;

export const createLegalDoc = /* GraphQL */ `
  mutation CreateLegalDoc(
    $input: CreateLegalDocInput!
    $condition: ModelLegalDocConditionInput
  ) {
    createLegalDoc(input: $input, condition: $condition) {
      id
      version
      isActive
      is_latest
      url
      legalDocParentID {
        id
        version
        isActive
        is_latest
        url
        createdAt
        updatedAt
        legalDocTypeLegalDocsId
        legalDocLegalDocChildrenId
        __typename
      }
      legalDocChildren {
        nextToken
        __typename
      }
      legalDocType {
        id
        name
        shortName
        description
        createdAt
        updatedAt
        __typename
      }
      legalDocRecords {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      legalDocTypeLegalDocsId
      legalDocLegalDocChildrenId
      __typename
    }
  }
`;

export const updateLegalDoc = /* GraphQL */ `
  mutation UpdateLegalDoc(
    $input: UpdateLegalDocInput!
    $condition: ModelLegalDocConditionInput
  ) {
    updateLegalDoc(input: $input, condition: $condition) {
      id
      version
      isActive
      is_latest
      url
      legalDocParentID {
        id
        version
        isActive
        is_latest
        url
        createdAt
        updatedAt
        legalDocTypeLegalDocsId
        legalDocLegalDocChildrenId
        __typename
      }
      legalDocChildren {
        nextToken
        __typename
      }
      legalDocType {
        id
        name
        shortName
        description
        createdAt
        updatedAt
        __typename
      }
      legalDocRecords {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      legalDocTypeLegalDocsId
      legalDocLegalDocChildrenId
      __typename
    }
  }
`;

export const deleteLegalDoc = /* GraphQL */ `
  mutation DeleteLegalDoc(
    $input: DeleteLegalDocInput!
    $condition: ModelLegalDocConditionInput
  ) {
    deleteLegalDoc(input: $input, condition: $condition) {
      id
      version
      isActive
      is_latest
      url
      legalDocParentID {
        id
        version
        isActive
        is_latest
        url
        createdAt
        updatedAt
        legalDocTypeLegalDocsId
        legalDocLegalDocChildrenId
        __typename
      }
      legalDocChildren {
        nextToken
        __typename
      }
      legalDocType {
        id
        name
        shortName
        description
        createdAt
        updatedAt
        __typename
      }
      legalDocRecords {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      legalDocTypeLegalDocsId
      legalDocLegalDocChildrenId
      __typename
    }
  }
`;

export const createLegalDocRecord = /* GraphQL */ `
  mutation CreateLegalDocRecord(
    $input: CreateLegalDocRecordInput!
    $condition: ModelLegalDocRecordConditionInput
  ) {
    createLegalDocRecord(input: $input, condition: $condition) {
      id
      sign
      legalSignDate
      userLegalApp {
        id
        user {
          id
          name
        }
        legalApp {
          id
          name
        }
      }
      legalDoc {
        id
        version
        isActive
        is_latest
        url
        createdAt
        updatedAt
        legalDocTypeLegalDocsId
        legalDocLegalDocChildrenId
        __typename
      }
      createdAt
      updatedAt
      userLegalAppLegalDocRecordsId
      legalDocLegalDocRecordsId
      __typename
    }
  }
`;

export const updateLegalDocRecord = /* GraphQL */ `
  mutation UpdateLegalDocRecord(
    $input: UpdateLegalDocRecordInput!
    $condition: ModelLegalDocRecordConditionInput
  ) {
    updateLegalDocRecord(input: $input, condition: $condition) {
      id
      sign
      legalSignDate
      userLegalApp {
        id
        user {
          id
          name
        }
        legalApp {
          id
          name
        }
      }
      legalDoc {
        id
        version
        isActive
        is_latest
        url
        createdAt
        updatedAt
        legalDocTypeLegalDocsId
        legalDocLegalDocChildrenId
        __typename
      }
      createdAt
      updatedAt
      userLegalAppLegalDocRecordsId
      legalDocLegalDocRecordsId
      __typename
    }
  }
`;

export const deleteLegalDocRecord = /* GraphQL */ `
  mutation DeleteLegalDocRecord(
    $input: DeleteLegalDocRecordInput!
    $condition: ModelLegalDocRecordConditionInput
  ) {
    deleteLegalDocRecord(input: $input, condition: $condition) {
      id
      sign
      legalSignDate
      userLegalApp {
        id
        user {
          id
          name
        }
        legalApp {
          id
          name
        }
      }
      legalDoc {
        id
        version
        isActive
        is_latest
        url
        createdAt
        updatedAt
        legalDocTypeLegalDocsId
        legalDocLegalDocChildrenId
        __typename
      }
      createdAt
      updatedAt
      userLegalAppLegalDocRecordsId
      legalDocLegalDocRecordsId
      __typename
    }
  }
`;
