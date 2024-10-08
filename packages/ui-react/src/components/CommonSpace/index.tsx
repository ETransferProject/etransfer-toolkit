interface CommonSpaceProps {
  direction?: 'vertical' | 'horizontal';
  size: number;
}

export default function CommonSpace({ direction = 'vertical', size }: CommonSpaceProps) {
  return (
    <div
      style={{
        width: direction === 'horizontal' ? size : 0,
        height: direction === 'vertical' ? size : 0,
      }}
    />
  );
}
