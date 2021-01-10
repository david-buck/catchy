import Link from "next/link";

export default function IndexPage() {
  return (
    <div>
      <Link as={`/stop/4917`} href="/stop/[sms]">
        <a>Upland</a>
      </Link>
      <br />
      <Link as={`/stop/5010`} href="/stop/[sms]">
        <a>Lamb</a>
      </Link>
    </div>
  );
}
