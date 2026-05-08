/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createLegalApp = /* GraphQL */ `
  mutation CreateLegalApp(
    $input: CreateLegalAppInput!
    $condition: ModelLegalAppConditionInput
  ) {
    createLegalApp(input: $input, condition: $condition) {
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
export const updateLegalApp = /* GraphQL */ `
  mutation UpdateLegalApp(
    $input: UpdateLegalAppInput!
    $condition: ModelLegalAppConditionInput
  ) {
    updateLegalApp(input: $input, condition: $condition) {
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
export const deleteLegalApp = /* GraphQL */ `
  mutation DeleteLegalApp(
    $input: DeleteLegalAppInput!
    $condition: ModelLegalAppConditionInput
  ) {
    deleteLegalApp(input: $input, condition: $condition) {
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
export const createUser = /* GraphQL */ `
  mutation CreateUser(
    $input: CreateUserInput!
    $condition: ModelUserConditionInput
  ) {
    createUser(input: $input, condition: $condition) {
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
export const updateUser = /* GraphQL */ `
  mutation UpdateUser(
    $input: UpdateUserInput!
    $condition: ModelUserConditionInput
  ) {
    updateUser(input: $input, condition: $condition) {
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
export const deleteUser = /* GraphQL */ `
  mutation DeleteUser(
    $input: DeleteUserInput!
    $condition: ModelUserConditionInput
  ) {
    deleteUser(input: $input, condition: $condition) {
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
export const createLegalDocType = /* GraphQL */ `
  mutation CreateLegalDocType(
    $input: CreateLegalDocTypeInput!
    $condition: ModelLegalDocTypeConditionInput
  ) {
    createLegalDocType(input: $input, condition: $condition) {
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
export const updateLegalDocType = /* GraphQL */ `
  mutation UpdateLegalDocType(
    $input: UpdateLegalDocTypeInput!
    $condition: ModelLegalDocTypeConditionInput
  ) {
    updateLegalDocType(input: $input, condition: $condition) {
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
export const deleteLegalDocType = /* GraphQL */ `
  mutation DeleteLegalDocType(
    $input: DeleteLegalDocTypeInput!
    $condition: ModelLegalDocTypeConditionInput
  ) {
    deleteLegalDocType(input: $input, condition: $condition) {
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
export const createLegalDoc = /* GraphQL */ `
  mutation CreateLegalDoc(
    $input: CreateLegalDocInput!
    $condition: ModelLegalDocConditionInput
  ) {
    createLegalDoc(input: $input, condition: $condition) {
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
export const updateLegalDoc = /* GraphQL */ `
  mutation UpdateLegalDoc(
    $input: UpdateLegalDocInput!
    $condition: ModelLegalDocConditionInput
  ) {
    updateLegalDoc(input: $input, condition: $condition) {
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
export const deleteLegalDoc = /* GraphQL */ `
  mutation DeleteLegalDoc(
    $input: DeleteLegalDocInput!
    $condition: ModelLegalDocConditionInput
  ) {
    deleteLegalDoc(input: $input, condition: $condition) {
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
export const createLegalDocRecord = /* GraphQL */ `
  mutation CreateLegalDocRecord(
    $input: CreateLegalDocRecordInput!
    $condition: ModelLegalDocRecordConditionInput
  ) {
    createLegalDocRecord(input: $input, condition: $condition) {
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
export const updateLegalDocRecord = /* GraphQL */ `
  mutation UpdateLegalDocRecord(
    $input: UpdateLegalDocRecordInput!
    $condition: ModelLegalDocRecordConditionInput
  ) {
    updateLegalDocRecord(input: $input, condition: $condition) {
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
export const deleteLegalDocRecord = /* GraphQL */ `
  mutation DeleteLegalDocRecord(
    $input: DeleteLegalDocRecordInput!
    $condition: ModelLegalDocRecordConditionInput
  ) {
    deleteLegalDocRecord(input: $input, condition: $condition) {
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
export const createOrder = /* GraphQL */ `
  mutation CreateOrder(
    $input: CreateOrderInput!
    $condition: ModelOrderConditionInput
  ) {
    createOrder(input: $input, condition: $condition) {
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
export const updateOrder = /* GraphQL */ `
  mutation UpdateOrder(
    $input: UpdateOrderInput!
    $condition: ModelOrderConditionInput
  ) {
    updateOrder(input: $input, condition: $condition) {
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
export const deleteOrder = /* GraphQL */ `
  mutation DeleteOrder(
    $input: DeleteOrderInput!
    $condition: ModelOrderConditionInput
  ) {
    deleteOrder(input: $input, condition: $condition) {
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
