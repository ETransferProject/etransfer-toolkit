export interface IStorageSuite {
  getItem: (key: string) => Promise<any>;
  setItem: (key: string, value: string) => Promise<any>;
  removeItem: (key: string) => Promise<any>;
}

export type TJwtData = {
  access_token: string;
  expires_in: number;
  token_type: string;
};

export type TETransferJWTData = {
  expiresTime?: number;
} & TJwtData;
