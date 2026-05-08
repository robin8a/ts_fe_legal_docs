import { ModelInit, MutableModel, __modelMeta__, ManagedIdentifier } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled, AsyncCollection, AsyncItem } from "@aws-amplify/datastore";





type EagerLegalApp = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<LegalApp, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name: string;
  readonly users?: (User | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyLegalApp = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<LegalApp, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name: string;
  readonly users: AsyncCollection<User>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type LegalApp = LazyLoading extends LazyLoadingDisabled ? EagerLegalApp : LazyLegalApp

export declare const LegalApp: (new (init: ModelInit<LegalApp>) => LegalApp) & {
  copyOf(source: LegalApp, mutator: (draft: MutableModel<LegalApp>) => MutableModel<LegalApp> | void): LegalApp;
}

type EagerUser = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<User, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name: string;
  readonly legalApp?: LegalApp | null;
  readonly legalDocRecords?: (LegalDocRecord | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly legalAppUsersId?: string | null;
}

type LazyUser = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<User, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name: string;
  readonly legalApp: AsyncItem<LegalApp | undefined>;
  readonly legalDocRecords: AsyncCollection<LegalDocRecord>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly legalAppUsersId?: string | null;
}

export declare type User = LazyLoading extends LazyLoadingDisabled ? EagerUser : LazyUser

export declare const User: (new (init: ModelInit<User>) => User) & {
  copyOf(source: User, mutator: (draft: MutableModel<User>) => MutableModel<User> | void): User;
}

type EagerLegalDocType = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<LegalDocType, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name: string;
  readonly shortName?: string | null;
  readonly legalDocs?: (LegalDoc | null)[] | null;
  readonly description?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyLegalDocType = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<LegalDocType, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name: string;
  readonly shortName?: string | null;
  readonly legalDocs: AsyncCollection<LegalDoc>;
  readonly description?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type LegalDocType = LazyLoading extends LazyLoadingDisabled ? EagerLegalDocType : LazyLegalDocType

export declare const LegalDocType: (new (init: ModelInit<LegalDocType>) => LegalDocType) & {
  copyOf(source: LegalDocType, mutator: (draft: MutableModel<LegalDocType>) => MutableModel<LegalDocType> | void): LegalDocType;
}

type EagerLegalDoc = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<LegalDoc, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly version: string;
  readonly isActive: boolean;
  readonly url: string;
  readonly legalDocParentID?: LegalDoc | null;
  readonly legalDocChildren?: (LegalDoc | null)[] | null;
  readonly legalDocType: LegalDocType;
  readonly legalDocRecords?: (LegalDocRecord | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly legalDocTypeLegalDocsId?: string | null;
  readonly legalDocLegalDocChildrenId?: string | null;
}

type LazyLegalDoc = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<LegalDoc, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly version: string;
  readonly isActive: boolean;
  readonly url: string;
  readonly legalDocParentID: AsyncItem<LegalDoc | undefined>;
  readonly legalDocChildren: AsyncCollection<LegalDoc>;
  readonly legalDocType: AsyncItem<LegalDocType>;
  readonly legalDocRecords: AsyncCollection<LegalDocRecord>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly legalDocTypeLegalDocsId?: string | null;
  readonly legalDocLegalDocChildrenId?: string | null;
}

export declare type LegalDoc = LazyLoading extends LazyLoadingDisabled ? EagerLegalDoc : LazyLegalDoc

export declare const LegalDoc: (new (init: ModelInit<LegalDoc>) => LegalDoc) & {
  copyOf(source: LegalDoc, mutator: (draft: MutableModel<LegalDoc>) => MutableModel<LegalDoc> | void): LegalDoc;
}

type EagerLegalDocRecord = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<LegalDocRecord, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly sign: string;
  readonly legalSignDate: number;
  readonly user?: User | null;
  readonly legalDoc?: LegalDoc | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly userLegalDocRecordsId?: string | null;
  readonly legalDocLegalDocRecordsId?: string | null;
}

type LazyLegalDocRecord = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<LegalDocRecord, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly sign: string;
  readonly legalSignDate: number;
  readonly user: AsyncItem<User | undefined>;
  readonly legalDoc: AsyncItem<LegalDoc | undefined>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly userLegalDocRecordsId?: string | null;
  readonly legalDocLegalDocRecordsId?: string | null;
}

export declare type LegalDocRecord = LazyLoading extends LazyLoadingDisabled ? EagerLegalDocRecord : LazyLegalDocRecord

export declare const LegalDocRecord: (new (init: ModelInit<LegalDocRecord>) => LegalDocRecord) & {
  copyOf(source: LegalDocRecord, mutator: (draft: MutableModel<LegalDocRecord>) => MutableModel<LegalDocRecord> | void): LegalDocRecord;
}