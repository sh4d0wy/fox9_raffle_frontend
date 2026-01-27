/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

declare global {
  namespace JSX {
    type Element = React.ReactElement<any, any>;
  }
}
