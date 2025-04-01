import { NextPage } from "next";
import { AppProps } from "next/app";

declare module "next" {
  type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
    getLayout?: (page: React.ReactElement) => React.ReactNode;
  };
}

declare module "next/app" {
  interface AppPropsWithLayout extends AppProps {
    Component: NextPageWithLayout;
  }
} 