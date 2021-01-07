import useSWR from "swr";
import Link from "next/link";

const fetcher = (url) => fetch(url).then((res) => res.json());

function timeConvert(n) {
  var hours = n / 60;
  var rhours = Math.floor(hours);
  var minutes = (hours - rhours) * 60;
  var rminutes = Math.round(minutes);
  return rhours + "h : " + rminutes + " m";
}

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
