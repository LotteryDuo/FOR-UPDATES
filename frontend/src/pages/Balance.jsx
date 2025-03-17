import React from "react";
import Layout from "../layout/default.jsx";
import DisplayBalance from "../components/DisplayBalance.jsx";

export default function Home() {
  return (
    <Layout>
      <DisplayBalance />
    </Layout>
  );
}
