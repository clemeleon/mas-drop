/**
 * Package: mas-drop.
 * 18 April 2021
 */

import React, { Component } from "react";
import { Panel } from "./Panel";
import { Render } from "../../helpers/types";
type AccPanel = { label: string | Render; content: Render };
type AccProps = {
  panels: Array<AccPanel>;
  multiple: boolean;
};
type AccState = { active: number };

class Accordion extends Component<AccProps, AccState> {
  constructor(props: AccProps) {
    super(props);
    this.state = {
      active: 0,
    };
  }
  private activate = (index: number): void => {
    const { active } = this.state;
    if (active === index) {
      return;
    }
    this.setState({ active: index });
  };

  render() {
    const { panels, multiple } = this.props,
      { active } = this.state;
    return (
      <div className={"accordion"} role={"tablist"}>
        {panels.map((panel, i) => (
          <Panel
            label={panel.label}
            active={active}
            activate={this.activate}
            index={i}
            own={multiple}
            id={`id-${i}`}
            key={`id-${i}`}
          >
            {panel.content}
          </Panel>
        ))}
      </div>
    );
  }
}

export { Accordion };
export type { AccProps, AccState, AccPanel };
