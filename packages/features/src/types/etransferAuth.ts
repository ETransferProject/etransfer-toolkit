import { PortkeyVersion } from '@etransfer/types';

export type TGetAuthApiBaseConfig = {
  grant_type: string;
  scope: string;
  client_id: string;
  source: string;
};

export type TGetAuthApiRequest = {
  pubkey: string;
  signature: string;
  plain_text: string;
  ca_hash: string;
  chain_id: string;
  managerAddress: string;
  version: PortkeyVersion;
};
