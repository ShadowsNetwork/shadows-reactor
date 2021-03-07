import { WithTranslation } from 'react-i18next'

export default interface TransactionStatusProps extends WithTranslation {
  content: string | undefined;
  hash: string | undefined;
  error: Error | undefined;
  success: boolean | undefined;
  inProgress: boolean | undefined;
  closed: boolean;
  onClosed: () => void;
}

export interface TransactionStatusType {
  hash: string | null;
  error: Error | null;
  exception: Error | null;
  success: boolean;
  inProgress: boolean;
  toBeConfirmed: boolean;
  closed: boolean;
}
