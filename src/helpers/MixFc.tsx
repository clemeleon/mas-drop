/**
 * Package: mas-drop.
 * 13 April 2021
 */
import React, { ReactNode, ComponentType, FC } from "react";
import { Render } from "./types";

const Loading: FC<{ bol: boolean }> = ({ bol }): Render => {
    return (
      <div className={`${bol ? "loading show" : "loading"}`}>
        <div />
        <div />
        <div />
        <div />
      </div>
    );
  },
  Auth: FC<{
    lose: boolean;
    condition: boolean;
    main: ReactNode | ComponentType;
    other: ReactNode;
  }> = ({ lose, condition, main, other }): Render => {
    console.log(condition);
    return <div>{!lose && condition ? main : other}</div>;
  };

export { Loading, Auth };
