import React, { useMemo } from 'react';
import Lottie from 'lottie-react';
import IndicatiorJSON from '../../assets/lottie/indicator.json';

export interface IAppIndicator {
  width: number;
  height: number;
  disableDelay?: boolean;
}
const IndicatorLottie = (props: IAppIndicator) =>
  useMemo(
    () => (
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {/* eslint-disable-next-line max-len,prettier/prettier */}
        <Lottie style={{ height: props.height, width: props.width }} animationData={IndicatiorJSON} loop />
      </div>
    ),
    [props]
  );

const AppIndicator: React.FC<IAppIndicator> = (props) => {
  return <IndicatorLottie {...props} />;
};

export default AppIndicator;
