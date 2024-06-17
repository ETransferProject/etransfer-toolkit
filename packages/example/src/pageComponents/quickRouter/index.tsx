import { Button } from 'antd';

export default function QuickRouter() {
  return (
    <div>
      <div className="flex flex-row gap-2">
        <a href="deposit">
          <Button>Go to deposit</Button>
        </a>

        <a href="withdraw">
          <Button>Go to withdraw</Button>
        </a>
      </div>
    </div>
  );
}
