import React, { useMemo } from 'react';
import Lottie from 'lottie-react';
import IndicatiorJSON from '../../assets/lottie/button_indicator.json';

export interface IAppButtonIndicator {
  hidden?: boolean;
}
const AppButtonIndicator: React.FC<IAppButtonIndicator> = (props) => {
  return useMemo(
    () => (
      <div style={{ display: props.hidden ? 'none' : 'flex', justifyContent: 'center' }}>
        <Lottie style={{ height: 20 }} animationData={IndicatiorJSON} loop />
      </div>
    ),
    [props]
  );
};

export default AppButtonIndicator;
