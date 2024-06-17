export const isValidBase58 = (str: string) => {
  return !/[\u4e00-\u9fa5\u3000-\u303f\uff01-\uff5e]/.test(str);
};
