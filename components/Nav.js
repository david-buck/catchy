import Link from "next/link";

const sections = [
  { label: "Bus", href: "/" },
  { label: "Train", href: "/trains" },
  { label: "Cable Car", href: "/cable-car" },
  { label: "Ferry", href: "/ferry" },
];

export default function Navigation({ current }) {
  return (
    <nav className="flex flex-row h-20 bg-gray-400 fixed bottom-0 left-0 w-full text-sm font-semibold uppercase">
      {sections.map((el, key) => (
        <div className="flex-1 grid place-items-center" key={key}>
          <Link href={el.href}>
            <a>
              <div>{el.label}</div>
            </a>
          </Link>
        </div>
      ))}
    </nav>
  );
}
