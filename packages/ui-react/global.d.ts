/// <reference types="react-scripts" />

declare module 'aelf-sdk';
declare module '*.svg' {
  const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  export default content;
}

declare module '*.png' {
  const content: React.FunctionComponent<React.ImgHTMLAttributes>;

  export default content;
}
