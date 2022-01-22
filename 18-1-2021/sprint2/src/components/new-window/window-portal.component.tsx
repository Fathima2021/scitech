import React, { Component, PureComponent } from 'react';
import { createPortal } from 'react-dom';

class WindowPortal extends PureComponent<any, any> {
  containerEl: any = null;
  externalWindow: Window | null = null;
  constructor(props: any) {
    super(props);
    this.containerEl = document.createElement('div');
    this.externalWindow = null;
  }

  componentDidMount(): void {
    this.externalWindow = window.open('', '', 'width=400,height=400');
    (this.externalWindow as Window).document.body.appendChild(this.containerEl);
    (this.externalWindow as Window).document.title = 'Library';
    (this.externalWindow as Window).document.body.style.margin = '0px';
    (this.externalWindow as Window).addEventListener('beforeunload', () => {
      this.props.closeWindowPortal();
    });
    // window.addEventListener('message', (ev) => {
    //   console.log(ev);
    // });
  }

  componentWillUnmount(): void {
    (this.externalWindow as Window).close();
  }

  render(): JSX.Element {
    return createPortal(this.props.children, this.containerEl);
  }
}

export default WindowPortal;
