import { Skeleton } from 'antd';
import './index.less';

const NetworkListSkeletonCountList = [1, 1, 1, 1, 1];

export function NetworkListSkeletonForWeb() {
  return (
    <div className={'etransfer-ui-network-list-skeleton-for-web'}>
      {NetworkListSkeletonCountList.map((_item, index) => {
        return (
          <div className={'skeleton'} key={'NetworkListSkeletonForWeb' + index}>
            <div className={'left'}>
              <div className={'row1'}>
                <Skeleton.Input active />
              </div>
              <div className={'row2'}>
                <Skeleton.Input active />
              </div>
            </div>
            <div className={'right'}>
              <div className={'row1'}>
                <Skeleton.Input active />
              </div>
              <div className={'row2'}>
                <Skeleton.Input active />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function NetworkListSkeletonForMobile() {
  return (
    <div className={'etransfer-ui-network-list-skeleton-for-mobile'}>
      {NetworkListSkeletonCountList.map((_item, index) => {
        return (
          <div className={'skeleton'} key={'NetworkListSkeletonForMobile' + index}>
            <div className={'row1'}>
              <Skeleton.Input active />
            </div>
            <div className={'row2'}>
              <Skeleton.Input active />
            </div>
            <div className={'row3'}>
              <Skeleton.Input active />
            </div>
          </div>
        );
      })}
    </div>
  );
}
