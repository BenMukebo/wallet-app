"use client";
import React, { PropsWithChildren } from "react";
import { SWRConfig } from "swr";

const SwrProvider = ({ children }: PropsWithChildren) => {
  return (
    <SWRConfig
      value={{
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        refreshInterval: 0,
      }}
    >
      {children}
    </SWRConfig>
  );
};

export default SwrProvider;
