export enum TRANSFER_DETAIL_LABEL {
  Type = 'Type',
  CreateTime = 'CreateTime',
  TransactionFee = 'Transaction Fee',
  SourceTxHash = 'Source Tx Hash',
  SourceChain = 'Source Chain',
  Amount = 'Amount',
  Address = 'Address',
  Status = 'Status',
  DestinationTxHash = 'Destination Tx Hash',
  DestinationChain = 'Destination Chain',
  ReceiveAmount = 'Receive Amount',
  ReceiveAddress = 'Receive Address',
}

export const TRANSFER_DETAIL = 'Transfer Detail';

export enum TransferStatusType {
  Pending = 'Pending',
  Success = 'Success',
  Failed = 'Failed',
}
