import { Fragment, JSX } from "react";
import Home from "@/views/Home/Home";

const IndexPage = (pageProps: JSX.IntrinsicAttributes) => {
  return (
    <Fragment>
      <Home
        {...pageProps}
      />
    </Fragment>
  );
};

export default IndexPage;
