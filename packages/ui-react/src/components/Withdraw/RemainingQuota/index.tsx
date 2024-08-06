import { useCallback, useState } from 'react';
import CommonSvg from '../../CommonSvg';
import { ComponentStyle } from '../../../types';
import CommonModalTips from '../../CommonModalTips';

export default function RemainingQuota({
  content,
  componentStyle = ComponentStyle.Web,
}: {
  content: string;
  componentStyle?: ComponentStyle;
}) {
  const [openModal, setOpenModal] = useState(false);

  const handleView = useCallback(() => {
    setOpenModal(true);
  }, []);

  const handleOk = useCallback(() => {
    setOpenModal(false);
  }, []);

  return (
    <>
      {componentStyle === ComponentStyle.Mobile && <CommonSvg type="questionMark" onClick={handleView} />}

      <CommonModalTips
        getContainer="body"
        title="24-Hour Limit"
        open={openModal}
        closable={false}
        okText="OK"
        onOk={handleOk}>
        <div className="text-center">{content}</div>
      </CommonModalTips>
    </>
  );
}
