import Link from "next/link";

import Bus from "../svgs/nav/nav-bus.svg";
import Train from "../svgs/nav/nav-train.svg";
import CableCar from "../svgs/nav/nav-cablecar.svg";
import Ferry from "../svgs/nav/nav-ferry.svg";

const sections = [
  {
    label: "Bus",
    href: "/",
    icon: Bus,
    activeColorText: "text-yellow-500",
    activeColorBackground: "bg-yellow-500",
  },
  {
    label: "Train",
    href: "/trains",
    icon: Train,
    activeColorText: "text-green-600",
    activeColorBackground: "bg-green-600",
  },
  {
    label: "Cable Car",
    href: "/cable-car",
    icon: CableCar,
    activeColorText: "text-red-600",
    activeColorBackground: "bg-red-600",
  },
  {
    label: "Ferry",
    href: "/ferry",
    icon: Ferry,
    activeColorText: "text-blue-600",
    activeColorBackground: "bg-blue-600",
  },
];

const SvgIcon = ({ icon }) => {
  const Icon = icon;
  return <Icon width={26} height={26} className="mb-0.5 z-10" />;
};

export default function Navigation({ current }) {
  return (
    <nav className="h-20 fixed bottom-0 left-0 w-full text-sm font-semibold bg-white dark:bg-gray-800">
      {/*  border-gray-200 dark:border-gray-600 border-t */}
      <div className="w-full max-w-xl m-auto flex flex-row">
        {sections.map((el, key) => {
          const isCurrent = current === el.label.replace(" ", "").toLowerCase();
          return (
            <div className="flex-1 grid place-items-center h-20" key={key}>
              <Link href={el.href}>
                <a
                  className={`relative flex flex-col w-full items-center ${
                    isCurrent
                      ? "opacity-100 " + el.activeColorText
                      : "opacity-50"
                  }`}
                >
                  <SvgIcon icon={el.icon} width="26" height="26" />
                  <div className="z-10 hidden 2xs:block">{el.label}</div>
                  {isCurrent && (
                    <svg
                      viewBox="0 0 2 2"
                      xmlns="http://www.w3.org/2000/svg"
                      className={`absolute z-0 -top-3 w-12 opacity-10 ${el.activeColorText}`}
                    >
                      <circle cx="1" cy="1" r="1" fill="currentColor" />
                    </svg>
                  )}
                </a>
              </Link>
            </div>
          );
        })}
      </div>
    </nav>
  );
}
