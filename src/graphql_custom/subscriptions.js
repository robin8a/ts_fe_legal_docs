/* eslint-disable */
// Custom GraphQL subscriptions aligned with amplify/backend/api/tsbelegaldocsapi/schema.graphql

export const onCreateLegalApp = /* GraphQL */ `
  subscription OnCreateLegalApp($filter: ModelSubscriptionLegalAppFilterInput) {
    onCreateLegalApp(filter: $filter) {
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

export const onUpdateLegalApp = /* GraphQL */ `
  subscription OnUpdateLegalApp($filter: ModelSubscriptionLegalAppFilterInput) {
    onUpdateLegalApp(filter: $filter) {
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

export const onDeleteLegalApp = /* GraphQL */ `
  subscription OnDeleteLegalApp($filter: ModelSubscriptionLegalAppFilterInput) {
    onDeleteLegalApp(filter: $filter) {
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

export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser($filter: ModelSubscriptionUserFilterInput) {
    onCreateUser(filter: $filter) {
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

export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser($filter: ModelSubscriptionUserFilterInput) {
    onUpdateUser(filter: $filter) {
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

export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser($filter: ModelSubscriptionUserFilterInput) {
    onDeleteUser(filter: $filter) {
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

export const onCreateUserLegalApp = /* GraphQL */ `
  subscription OnCreateUserLegalApp(
    $filter: ModelSubscriptionUserLegalAppFilterInput
  ) {
    onCreateUserLegalApp(filter: $filter) {
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

export const onUpdateUserLegalApp = /* GraphQL */ `
  subscription OnUpdateUserLegalApp(
    $filter: ModelSubscriptionUserLegalAppFilterInput
  ) {
    onUpdateUserLegalApp(filter: $filter) {
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

export const onDeleteUserLegalApp = /* GraphQL */ `
  subscription OnDeleteUserLegalApp(
    $filter: ModelSubscriptionUserLegalAppFilterInput
  ) {
    onDeleteUserLegalApp(filter: $filter) {
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

export const onCreateLegalDocType = /* GraphQL */ `
  subscription OnCreateLegalDocType(
    $filter: ModelSubscriptionLegalDocTypeFilterInput
  ) {
    onCreateLegalDocType(filter: $filter) {
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

export const onUpdateLegalDocType = /* GraphQL */ `
  subscription OnUpdateLegalDocType(
    $filter: ModelSubscriptionLegalDocTypeFilterInput
  ) {
    onUpdateLegalDocType(filter: $filter) {
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

export const onDeleteLegalDocType = /* GraphQL */ `
  subscription OnDeleteLegalDocType(
    $filter: ModelSubscriptionLegalDocTypeFilterInput
  ) {
    onDeleteLegalDocType(filter: $filter) {
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

export const onCreateLegalDoc = /* GraphQL */ `
  subscription OnCreateLegalDoc($filter: ModelSubscriptionLegalDocFilterInput) {
    onCreateLegalDoc(filter: $filter) {
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

export const onUpdateLegalDoc = /* GraphQL */ `
  subscription OnUpdateLegalDoc($filter: ModelSubscriptionLegalDocFilterInput) {
    onUpdateLegalDoc(filter: $filter) {
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

export const onDeleteLegalDoc = /* GraphQL */ `
  subscription OnDeleteLegalDoc($filter: ModelSubscriptionLegalDocFilterInput) {
    onDeleteLegalDoc(filter: $filter) {
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

export const onCreateLegalDocRecord = /* GraphQL */ `
  subscription OnCreateLegalDocRecord(
    $filter: ModelSubscriptionLegalDocRecordFilterInput
  ) {
    onCreateLegalDocRecord(filter: $filter) {
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

export const onUpdateLegalDocRecord = /* GraphQL */ `
  subscription OnUpdateLegalDocRecord(
    $filter: ModelSubscriptionLegalDocRecordFilterInput
  ) {
    onUpdateLegalDocRecord(filter: $filter) {
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

export const onDeleteLegalDocRecord = /* GraphQL */ `
  subscription OnDeleteLegalDocRecord(
    $filter: ModelSubscriptionLegalDocRecordFilterInput
  ) {
    onDeleteLegalDocRecord(filter: $filter) {
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
