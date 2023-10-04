import React from 'react';
import { DappProvider } from '@multiversx/sdk-dapp/wrappers/DappProvider';
import type { AppProps } from 'next/app';
import { network } from "../api/net.config";
import dynamic from "next/dynamic";
import { AxiosInterceptorContext } from "@multiversx/sdk-dapp/wrappers/AxiosInterceptorContext";
import { sampleAuthenticatedDomains } from "../config";

const SignTransactionsModals: any = dynamic(
  async () => {
    return (await import("@multiversx/sdk-dapp/UI/SignTransactionsModals"))
      .SignTransactionsModals;
  },
  { ssr: false }
);
const NotificationModal: any = dynamic(
  async () => {
    return (await import("@multiversx/sdk-dapp/UI/NotificationModal"))
      .NotificationModal;
  },
  { ssr: false }
);
const TransactionsToastList: any = dynamic(
  async () => {
    return (await import("@multiversx/sdk-dapp/UI/TransactionsToastList"))
      .TransactionsToastList;
  },
  { ssr: false }
);

const withDappProvider = (WrappedComponent: React.ComponentType<AppProps>) => {
  const WithDappProvider: React.FC<AppProps> = (props) => {
    return (
      <AxiosInterceptorContext.Provider>
        {/* @ts-ignore */}
        <AxiosInterceptorContext.Interceptor
          authenticatedDomanis={sampleAuthenticatedDomains}
        >
          <DappProvider
            environment={network.id}
            customNetworkConfig={{
              name: "Hackathon Dapp",
              walletConnectV2ProjectId: "b2d85a1d5f8e40aa6d2858b1e2ed83d8",
            }}
            dappConfig={{
              shouldUseWebViewProvider: true,
            }}
          >
            <>
              <TransactionsToastList />
              <NotificationModal />
              <SignTransactionsModals className="custom-class-for-modals" />
            </>
            <AxiosInterceptorContext.Listener />
            <WrappedComponent {...props} />
          </DappProvider>
        </AxiosInterceptorContext.Interceptor>
      </AxiosInterceptorContext.Provider>
    );
  };

  return WithDappProvider;
};
export default withDappProvider;
