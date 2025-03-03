export type Transaction = {
  product: Product;
  reversal: boolean;
  responseCode: string;
  responseDescription: string;
  terminalId: string;
  merchantId: string;
  cashback: string;
  merchantName: string;
  merchantCategoryCode: string;
  merchantAddress: string;
  currencyCode: string;
  rrn: string;
  MTI: string;
  STAN: string;
  PAN: string;
  vasData: null;
  extraData: string;
  processor: Processor;
  _id: string;
  amount: number;
  transactionTime: string;
  __v: number;
  isCompleted: boolean;
  cardExpiration?: string;
  handlerResponseTime?: string;
  issuer?: string;
  organisation?: Organisation;
  createdAt?: string;
  updatedAt?: string;
  totalTransTime?: number;
};

export type ProcessorStats = {
  approved: number;
  incorrectPin: number;
  insufficientFund: number;
  issuerInOperative: number;
  noResponse: number;
  others: number;
  processor: string;
  exceededLimit: string;
  pinTriesExceeded: string;
  suspectedFraud: string;
  total: number;
};

export enum Processor {
  Nibss = 'NIBSS',
  ISW = 'ISW',
}

export enum Product {
  Cashout = 'CASHOUT',
  Purchase = 'purchase',
}

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}
export interface User {
  _id?: string;
  role: UserRole;
  username: string;
  email: string;
  password?: string;
  fullname: string;
  organisation_id: string;
  permissions: string[];
  organisation?: Organisation;
}

export interface PaginatedData<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter?: number;
  hasPrevPage?: boolean;
  hasNextPage?: boolean;
  prevPage?: number;
  nextPage?: number;
}

export interface Organisation {
  _id?: string;
  name: string;
  terminals_count?: number;
  transactions_count?: number;
  users_count?: number;
  hasApiKey: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface GroupTid {
  _id?: string;
  terminalId: string;
  profileId?: string;
  terminals_count?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Webhook {
  _id?: string;
  name: string;
  url: string;
  urls: string[];
  dest_urls?: string[];
  organisation?: Organisation;
  orgnaisationId: string;
  secret: string;
  request_count?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface WebhookRequest {
  _id?: string;
  id?: string;
  webhookId: string | any;
  payload: { [key: string]: any };
  terminalId: string;
  organisationId?: string | any;
  merchantName: string;
  responseBody: string;
  responseType: string;
  responseCode: number;
  isRetry: boolean;
  status: string;
  journalId: string | any;
  webhook?: Webhook;
  url?: string;
  organisation?: Organisation;
  verifyString: string;
  verifySignature: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface GeneratedTid {
  _id?: string;
  tid: string;
  linkedTo: string;
  type: 'isw' | 'hydrogen';
  rangeGenerated: string;
  prefix: string;
  terminal?: {
    _id: string;
    terminalId: string;
    brand: string;
    model: string;
    serial: string;
  };
}
