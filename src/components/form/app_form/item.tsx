import React from 'react';
import { Col, Row, ScreenClassMap } from 'react-grid-system';
import { useAppFormContext } from './context';
import './index.scss';

export interface _IAppFormItem {
  labelWrap?: ScreenClassMap<number>;
  colWrap?: ScreenClassMap<number>;
  children?: any;
  label?: string;
  className?: string;
  colon?: boolean;
  labelStartFromTop?: boolean;
  labelStyle?: boolean;
  disableLabelArea?: boolean;
  hidden?: boolean;
  multipleLineLabel?: boolean;
  lineContent?: boolean;
}
const _AppFormItem: React.FC<_IAppFormItem> = (props) => {
  const { labelWrap, colWrap } = useAppFormContext();
  if (props.hidden) return null;
  const renderLabel = () => {
    if (!props.label) return null;
    return <label className={props.colon === false ? '' : 'with-colon'}>{props.label}</label>;
  };
  if (props.disableLabelArea) {
    return (
      <Row className="app-form-item">
        <Col className="app-form-item-content" xs={24}>
          {props.children}
        </Col>
      </Row>
    );
  }
  return (
    <Row className={`app-form-item ${props.className}`}>
      <Col
        className={`app-form-item-label ${props.multipleLineLabel ? 'multiple-label-line' : ''}`}
        {...(props.labelWrap || labelWrap)}
        style={{ alignItems: props.labelStartFromTop ? 'flex-start' : undefined }}
      >
        {renderLabel()}
      </Col>
      <Col className="app-form-item-content" {...(props.colWrap || colWrap)}>
        {props.lineContent ? <div className="app-line" /> : props.children}
      </Col>
    </Row>
  );
};

export default _AppFormItem;
