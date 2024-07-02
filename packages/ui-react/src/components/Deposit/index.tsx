import { DepositSelectGroupForMobile, DepositSelectGroupForWeb } from './DepositSelectGroup';

export default function Deposit() {
  return (
    <div>
      <DepositSelectGroupForMobile
        tokenList={[
          {
            contractAddress: '',
            decimals: 6,
            icon: 'https://d.cobo.com/public/logos/USDT%403x.png',
            name: 'Tether USD',
            symbol: 'USDT',
          },
          {
            contractAddress: '',
            decimals: 8,
            icon: 'https://raw.githubusercontent.com/Awaken-Finance/assets/main/blockchains/AELF/assets/SGR-1/logo24%403x.png',
            name: 'SGR',
            symbol: 'SGR-1',
          },
        ]}
        depositTokenSelected={{
          contractAddress: '',
          decimals: 6,
          icon: 'https://d.cobo.com/public/logos/USDT%403x.png',
          name: 'Tether USD',
          symbol: 'USDT',
        }}
        depositTokenChanged={(token) => {
          console.log('depositTokenChanged', token);
        }}
        networkList={[
          {
            network: 'SETH',
            name: 'SEthereum (ERC20)',
            multiConfirm: '64 confirmations',
            multiConfirmTime: '21mins',
            contractAddress: '0xdac17f958d2ee523a2206206994597c13d831ec7',
            explorerUrl: 'https://etherscan.io/address/0xdac17f958d2ee523a2206206994597c13d831ec7',
            status: 'Health' as any,
          },
          {
            network: 'TRX',
            name: 'TRON (TRC20)',
            multiConfirm: '27 confirmations',
            multiConfirmTime: '5mins',
            contractAddress: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
            explorerUrl: 'https://tronscan.io/#/contract/TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
            status: 'Health' as any,
          },
          {
            network: 'BSC',
            name: 'BNB Smart Chain (BEP20)',
            multiConfirm: '15 confirmations',
            multiConfirmTime: '4mins',
            contractAddress: '0x3f280ee5876ce8b15081947e0f189e336bb740a5',
            explorerUrl: 'https://testnet.bscscan.com/address/0x3f280ee5876ce8b15081947e0f189e336bb740a5',
            status: 'Health' as any,
          },
        ]}
        networkSelected={{
          network: 'SETH',
          name: 'SEthereum (ERC20)',
          multiConfirm: '64 confirmations',
          multiConfirmTime: '21mins',
          contractAddress: '0xdac17f958d2ee523a2206206994597c13d831ec7',
          explorerUrl: 'https://etherscan.io/address/0xdac17f958d2ee523a2206206994597c13d831ec7',
          status: 'Health' as any,
        }}
        networkChanged={async (item) => {
          console.log('networkChanged', item);
        }}
      />
      <DepositSelectGroupForWeb
        tokenList={[
          {
            contractAddress: '',
            decimals: 6,
            icon: 'https://d.cobo.com/public/logos/USDT%403x.png',
            name: 'Tether USD',
            symbol: 'USDT',
          },
          {
            contractAddress: '',
            decimals: 8,
            icon: 'https://raw.githubusercontent.com/Awaken-Finance/assets/main/blockchains/AELF/assets/SGR-1/logo24%403x.png',
            name: 'SGR',
            symbol: 'SGR-1',
          },
        ]}
        depositTokenSelected={{
          contractAddress: '',
          decimals: 6,
          icon: 'https://d.cobo.com/public/logos/USDT%403x.png',
          name: 'Tether USD',
          symbol: 'USDT',
        }}
        depositTokenChanged={(item) => {
          console.log('item', item);
        }}
        networkList={[
          {
            network: 'SETH',
            name: 'SEthereum (ERC20)',
            multiConfirm: '64 confirmations',
            multiConfirmTime: '21mins',
            contractAddress: '0xdac17f958d2ee523a2206206994597c13d831ec7',
            explorerUrl: 'https://etherscan.io/address/0xdac17f958d2ee523a2206206994597c13d831ec7',
            status: 'Health' as any,
          },
          {
            network: 'TRX',
            name: 'TRON (TRC20)',
            multiConfirm: '27 confirmations',
            multiConfirmTime: '5mins',
            contractAddress: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
            explorerUrl: 'https://tronscan.io/#/contract/TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
            status: 'Health' as any,
          },
          {
            network: 'BSC',
            name: 'BNB Smart Chain (BEP20)',
            multiConfirm: '15 confirmations',
            multiConfirmTime: '4mins',
            contractAddress: '0x3f280ee5876ce8b15081947e0f189e336bb740a5',
            explorerUrl: 'https://testnet.bscscan.com/address/0x3f280ee5876ce8b15081947e0f189e336bb740a5',
            status: 'Health' as any,
          },
        ]}
        networkSelected={{
          network: 'TRX',
          name: 'TRON (TRC20)',
          multiConfirm: '27 confirmations',
          multiConfirmTime: '5mins',
          contractAddress: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
          explorerUrl: 'https://tronscan.io/#/contract/TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
          status: 'Health' as any,
        }}
        networkChanged={async (item) => {
          console.log('item', item);
        }}
      />
    </div>
  );
}
