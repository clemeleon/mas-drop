/**
 * Package: mas-drop.
 * 13 April 2021
 */
import React, { ReactNode, ComponentType, FC } from "react";
import { Render } from "./types";
import { Error } from "../pages/Error";
import { ProductParams } from "../App";

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
    return <>{!lose && condition ? main : other}</>;
  },
  Conditional: FC<{
    params: ProductParams;
    action: (params: { [key: string]: any }) => Render;
    names: string[];
    uri: string;
  }> = ({ params, action, names, uri }): Render => {
    const datas: ProductParams = {},
      mgs = `Url not found with the path of ${uri}`;
    for (const [key, val] of Object.entries(params)) {
      if (names.includes(key)) {
        datas[key] = val;
      }
    }
    return (
      <>
        {Object.keys(params).length === Object.keys(datas).length &&
        Object.keys(datas).length === names.length ? (
          action(datas)
        ) : (
          <Error mgs={mgs} />
        )}
      </>
    );
  };

export { Loading, Auth, Conditional };
