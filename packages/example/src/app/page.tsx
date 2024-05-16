'use client';
import { Button } from 'antd';

export default function Home() {
  return (
    <main>
      <div className="flex flex-row gap-2">
        <a href="login">
          <Button>Go to login</Button>
        </a>

        <a href="deposit">
          <Button>Go to deposit</Button>
        </a>

        <a href="withdraw">
          <Button>Go to withdraw</Button>
        </a>
      </div>
    </main>
  );
}
