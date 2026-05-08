/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateLegalApp = /* GraphQL */ `
  subscription OnCreateLegalApp($filter: ModelSubscriptionLegalAppFilterInput) {
    onCreateLegalApp(filter: $filter) {
      id
      name
      users {
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
      users {
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
      users {
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
      legalApp {
        id
        name
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
      legalAppUsersId
      __typename
    }
  }
`;
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser($filter: ModelSubscriptionUserFilterInput) {
    onUpdateUser(filter: $filter) {
      id
      name
      legalApp {
        id
        name
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
      legalAppUsersId
      __typename
    }
  }
`;
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser($filter: ModelSubscriptionUserFilterInput) {
    onDeleteUser(filter: $filter) {
      id
      name
      legalApp {
        id
        name
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
      legalAppUsersId
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
      legalDocs {
        nextToken
        __typename
      }
      description
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
      legalDocs {
        nextToken
        __typename
      }
      description
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
      legalDocs {
        nextToken
        __typename
      }
      description
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
      url
      legalDocParentID {
        id
        version
        isActive
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
      url
      legalDocParentID {
        id
        version
        isActive
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
      url
      legalDocParentID {
        id
        version
        isActive
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
      user {
        id
        name
        createdAt
        updatedAt
        legalAppUsersId
        __typename
      }
      legalDoc {
        id
        version
        isActive
        url
        createdAt
        updatedAt
        legalDocTypeLegalDocsId
        legalDocLegalDocChildrenId
        __typename
      }
      createdAt
      updatedAt
      userLegalDocRecordsId
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
      user {
        id
        name
        createdAt
        updatedAt
        legalAppUsersId
        __typename
      }
      legalDoc {
        id
        version
        isActive
        url
        createdAt
        updatedAt
        legalDocTypeLegalDocsId
        legalDocLegalDocChildrenId
        __typename
      }
      createdAt
      updatedAt
      userLegalDocRecordsId
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
      user {
        id
        name
        createdAt
        updatedAt
        legalAppUsersId
        __typename
      }
      legalDoc {
        id
        version
        isActive
        url
        createdAt
        updatedAt
        legalDocTypeLegalDocsId
        legalDocLegalDocChildrenId
        __typename
      }
      createdAt
      updatedAt
      userLegalDocRecordsId
      legalDocLegalDocRecordsId
      __typename
    }
  }
`;
export const onCreateOrder = /* GraphQL */ `
  subscription OnCreateOrder($filter: ModelSubscriptionOrderFilterInput) {
    onCreateOrder(filter: $filter) {
      id
      customerID
      accountRepresentativeID
      productID
      status
      amount
      date
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateOrder = /* GraphQL */ `
  subscription OnUpdateOrder($filter: ModelSubscriptionOrderFilterInput) {
    onUpdateOrder(filter: $filter) {
      id
      customerID
      accountRepresentativeID
      productID
      status
      amount
      date
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteOrder = /* GraphQL */ `
  subscription OnDeleteOrder($filter: ModelSubscriptionOrderFilterInput) {
    onDeleteOrder(filter: $filter) {
      id
      customerID
      accountRepresentativeID
      productID
      status
      amount
      date
      createdAt
      updatedAt
      __typename
    }
  }
`;
