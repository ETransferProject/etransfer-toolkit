'use client';
import { eTransferCore } from '@/utils/core';
import { PortkeyVersion } from '@etransfer/types';
import { Button } from 'antd';
import { useCallback } from 'react';

export default function GetAuth() {
  const fetchAuthToken = useCallback(async () => {
    await eTransferCore.getAuth({
      pubkey:
        '04671bfc20edb4cdc171bd7d20877aa64862e88dc9f52173673db9789e0dea71aca45472fd4841cad362cae8b5b6f05c55a350014f7917fe90870fd680c845edae',
      signature:
        '05d641d117822f42f25278d8893f3a1ba9a36c32590080f84fe1d1095712819d223c3b3fa0c1de8f62b9b6ac89992c7e2f09678ad01eef1e97b0f21d6c6bd49c01',
      plainText: '4e6f6e63653a31373136333538353032393233',
      caHash: '134374c6dc3be101de6009e20d3888da43eaf7683bc7f41faac254286e85e032',
      chainId: 'tDVW',
      managerAddress: '7iC6EQtt4rKsqv9vFiwpUDvZVipSoKwvPLy7pRG189qJjyVT7',
      version: PortkeyVersion.v2,
    });
  }, []);

  const fetchNewAuthToken = useCallback(async () => {
    await eTransferCore.getAuthApi({
      pubkey:
        '04671bfc20edb4cdc171bd7d20877aa64862e88dc9f52173673db9789e0dea71aca45472fd4841cad362cae8b5b6f05c55a350014f7917fe90870fd680c845edae',
      signature:
        '05d641d117822f42f25278d8893f3a1ba9a36c32590080f84fe1d1095712819d223c3b3fa0c1de8f62b9b6ac89992c7e2f09678ad01eef1e97b0f21d6c6bd49c01',
      plain_text: '4e6f6e63653a31373136333538353032393233',
      ca_hash: '134374c6dc3be101de6009e20d3888da43eaf7683bc7f41faac254286e85e032',
      chain_id: 'tDVW',
      managerAddress: '7iC6EQtt4rKsqv9vFiwpUDvZVipSoKwvPLy7pRG189qJjyVT7',
      version: PortkeyVersion.v2,
    });
  }, []);

  return (
    <div>
      <Button onClick={fetchAuthToken}>Get ETransfer Token</Button>
      <span style={{ display: 'inline-block', width: 8 }} />
      <Button onClick={fetchNewAuthToken}>Get New ETransfer Token</Button>
    </div>
  );
}
