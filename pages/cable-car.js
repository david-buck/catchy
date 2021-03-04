import Head from "next/head";
import Link from "next/link";

import Nav from "../components/Nav";

export default function CableCar() {
  return (
    <>
      <Nav current="cablecar" />
      <div className="flex flex-col mb-20 p-5">Mabel car</div>
    </>
  );
}
