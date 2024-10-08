import { useEffect, useMemo, useRef, useState } from 'react';
import { etransferEvents } from '@etransfer/utils';
import { OrderStatusEnum, TGetRecordDetailResult } from '@etransfer/types';
import { ComponentStyle } from '../../types';
import MobileTransferDetail from './MobileTransferDetail';
import WebTransferDetail from './WebTransferDetail';
import { etransferCore, setLoading } from '../../utils';
import { useIsHaveJWT } from '../../hooks/login';

export interface TransferDetailProps {
  className?: string;
  orderId: string;
  isShowMobilePoweredBy?: boolean;
  isShowBackElement?: boolean;
  componentStyle?: ComponentStyle;
  onBack?: () => void;
}

export default function TransferDetail({
  className,
  orderId,
  componentStyle,
  isShowMobilePoweredBy,
  isShowBackElement,
  onBack,
}: TransferDetailProps) {
  const isMobileStyle = useMemo(() => componentStyle === ComponentStyle.Mobile, [componentStyle]);

  const isHaveJWT = useIsHaveJWT();
  const isHaveJWTRef = useRef(isHaveJWT);
  isHaveJWTRef.current = isHaveJWT;

  const [detailData, setDetailData] = useState<TGetRecordDetailResult>();

  const getDetailRef = useRef<(isLoading?: boolean) => Promise<void>>();
  const updateTimerRef = useRef<NodeJS.Timeout>();
  const { getDetail, stopTimer } = useMemo(() => {
    const getDetail = async (isLoading = true) => {
      try {
        if (!orderId || !isHaveJWTRef.current) {
          return;
        }

        isLoading && setLoading(true);

        const data = await etransferCore.services.getRecordDetail(orderId);
        setDetailData(data);

        if (data.status === OrderStatusEnum.Processing) {
          // Interval update transfer detail
          resetTimer();
        } else {
          // Stop interval
          stopTimer();
        }
      } catch (error) {
        console.log('getRecordDetail error', error);
      } finally {
        setLoading(false);
      }
    };
    getDetailRef.current = getDetail;

    const handleSetTimer = async () => {
      updateTimerRef.current = setInterval(() => {
        getDetailRef.current?.(false);
      }, 30 * 1000);
    };

    const resetTimer = () => {
      clearInterval(updateTimerRef.current);
      updateTimerRef.current = undefined;

      handleSetTimer();
    };

    const stopTimer = () => {
      clearInterval(updateTimerRef.current);
      updateTimerRef.current = undefined;
    };

    return { getDetail, stopTimer };
  }, [orderId]);

  useEffect(() => {
    if (isHaveJWT) {
      getDetail();
    }

    return () => {
      stopTimer();
    };
  }, [getDetail, isHaveJWT, stopTimer]);

  useEffect(() => {
    const { remove } = etransferEvents.AuthTokenSuccess.addListener(() => {
      console.log('login success');
      getDetailRef.current?.();
    });
    return () => {
      remove();
    };
  }, []);

  if (detailData?.id) {
    return isMobileStyle ? (
      <MobileTransferDetail
        className={className}
        data={detailData}
        isShowPoweredBy={isShowMobilePoweredBy}
        isShowBackIcon={isShowBackElement}
        onBack={onBack}
      />
    ) : (
      <WebTransferDetail
        className={className}
        data={detailData}
        isShowBackElement={isShowBackElement}
        onBack={onBack}
      />
    );
  } else {
    return null;
  }
}
