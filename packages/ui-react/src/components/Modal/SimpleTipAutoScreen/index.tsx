import { useCallback, useState } from 'react';
import CommonSvg from '../../CommonSvg';
import { ComponentStyle } from '../../../types';
import CommonModalTips from '../../CommonModalTips';
import { GOT_IT } from '../../../constants';

export default function SimpleTipAutoScreen({
  title,
  content,
  componentStyle = ComponentStyle.Web,
}: {
  title?: string;
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
        title={title}
        open={openModal}
        closable={false}
        okText={GOT_IT}
        onOk={handleOk}>
        <div className="text-center">{content}</div>
      </CommonModalTips>
    </>
  );
}
