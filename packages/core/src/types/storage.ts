export type TJwtData = {
  access_token: string;
  expires_in: number;
  token_type: string;
};

export type TETransferJWTData = {
  expiresTime?: number;
} & TJwtData;
