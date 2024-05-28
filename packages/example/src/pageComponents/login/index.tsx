'use client';
import { eTransferCore } from '@/utils/core';
import { PortkeyVersion } from '@etransfer/types';
import { Button, message } from 'antd';
import { useCallback } from 'react';
import { WebLoginState, useWebLogin } from 'aelf-web-login';
import { useQueryAuthToken } from '@/hooks/authToken';

export default function GetAuth() {
  const { getAuthToken } = useQueryAuthToken();
  const fetchAuthToken = useCallback(async () => {
    await getAuthToken();
  }, [getAuthToken]);

  const fetchNewAuthToken = useCallback(async () => {
    // Please set freely.
    await eTransferCore.getAuthTokenFromApi({
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

  const { login, loginState } = useWebLogin();
  const onLogin = useCallback(() => {
    if (loginState === WebLoginState.logining) return;
    if (loginState === WebLoginState.logined) {
      message.info('You are logged in.');
    }
    if (loginState === WebLoginState.initial || loginState === WebLoginState.lock) {
      login();
    }
  }, [login, loginState]);

  return (
    <div>
      <Button className="mr-2" onClick={onLogin}>
        Log in
      </Button>
      <Button className="mr-2" onClick={fetchAuthToken}>
        Get ETransfer Token
      </Button>
      <Button onClick={fetchNewAuthToken}>Get New ETransfer Token</Button>
    </div>
  );
}
