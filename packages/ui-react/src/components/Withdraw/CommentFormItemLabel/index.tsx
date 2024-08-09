import clsx from 'clsx';
import './index.less';
import CommonSvg from '../../CommonSvg';
import { WITHDRAWAL_COMMENT_TIP } from '../../../constants';
import { ComponentStyle } from '../../../types';
import CommonSpace from '../../CommonSpace';
import SimpleTipAutoScreen from '../../Modal/SimpleTipAutoScreen';
import CommonTooltip from '../../CommonTooltip';

export default function CommentFormItemLabel({
  componentStyle = ComponentStyle.Web,
}: {
  componentStyle?: ComponentStyle;
}) {
  return (
    <div className={clsx('flex-row-center')}>
      <span className={'etransfer-ui-comment-form-label'}>Comment</span>
      <CommonSpace direction={'horizontal'} size={4} />
      {componentStyle === ComponentStyle.Mobile ? (
        <SimpleTipAutoScreen title="Please confirm the Memo/Tag" content={WITHDRAWAL_COMMENT_TIP} />
      ) : (
        <CommonTooltip
          className={clsx('etransfer-ui-comment-question-label')}
          placement="top"
          title={WITHDRAWAL_COMMENT_TIP}>
          <CommonSvg type="questionMark" />
        </CommonTooltip>
      )}
    </div>
  );
}
