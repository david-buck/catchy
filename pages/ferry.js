import Head from "next/head";
import Link from "next/link";

import Nav from "../components/Nav";

export default function Ferry() {
  return (
    <>
      <Nav current="ferry" />
      <div className="flex flex-col mb-20 p-5">Ferry good</div>
    </>
  );
}
