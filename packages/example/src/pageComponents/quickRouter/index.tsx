import { Button, Divider } from 'antd';

export default function QuickRouter() {
  return (
    <div>
      <div className="flex flex-row gap-2">
        <Divider plain>CORE SDK</Divider>
        <a href="deposit-core" className="mr-2">
          <Button>Go to deposit</Button>
        </a>

        <a href="withdraw-core">
          <Button>Go to withdraw</Button>
        </a>

        <Divider plain>UI SDK</Divider>
        <a href="deposit" className="mr-2">
          <Button>Go to deposit</Button>
        </a>

        <a href="withdraw" className="mr-2">
          <Button>Go to withdraw</Button>
        </a>

        <a href="history">
          <Button>Go to history</Button>
        </a>
      </div>
    </div>
  );
}
