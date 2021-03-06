/**
 * Package: mas-drop.
 * 18 April 2021
 */

import React, { Component } from "react";
import { Render } from "../../helpers/types";

type PanelProps = {
  label: string | Render;
  active: number;
  activate: (index: number) => void;
  index: number;
  own: boolean;
  children: Render;
};

type PanelState = { open: boolean };

class Panel extends Component<PanelProps, PanelState> {
  constructor(props: PanelProps) {
    super(props);
    this.state = {
      open: this.props.index === 0,
    };
  }
  private activate = () => {
    const { open } = this.state;
    this.setState({ open: !open });
  };
  render() {
    let { label, active, index, activate, children, own } = this.props,
      on = active === index,
      { open } = this.state;
    if (own) {
      on = open;
    }
    return (
      <div className={on ? "panel-body active" : "panel-body"}>
        <div className={"label"}>
          <button
            role="tab"
            onClick={() => (own ? this.activate() : activate(index))}
          >
            {label}
          </button>
        </div>
        <div className={"content"}>{children}</div>
      </div>
    );
  }
}

export { Panel };
export type { PanelState, PanelProps };
