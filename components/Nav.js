import Link from "next/link";

import Bus from "../svgs/nav/nav-bus.svg";
import Train from "../svgs/nav/nav-train.svg";
import CableCar from "../svgs/nav/nav-cablecar.svg";
import Ferry from "../svgs/nav/nav-ferry.svg";

const sections = [
  { label: "Bus", href: "/", icon: Bus, className: "text-yellow-500" },
  {
    label: "Train",
    href: "/trains",
    icon: Train,
    className: "text-green-600",
  },
  // {
  //   label: "Cable Car",
  //   href: "/cable-car",
  //   icon: CableCar,
  //   className: "text-red-600",
  // },
  // { label: "Ferry", href: "/ferry", icon: Ferry, className: "text-blue-600" },
];

const SvgIcon = ({ icon }) => {
  const Icon = icon;
  return <Icon width={26} height={26} className="mb-1" />;
};

export default function Navigation({ current }) {
  return (
    <nav className="h-20 fixed bottom-0 left-0 w-full text-sm font-semibold bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 border-t">
      <div className="w-full max-w-xl m-auto flex flex-row">
        {sections.map((el, key) => (
          <div className="flex-1 grid place-items-center h-20" key={key}>
            <Link href={el.href}>
              <a
                className={`flex flex-col w-full items-center ${
                  current === el.label.replace(" ", "").toLowerCase()
                    ? "opacity-100 " + el.className
                    : "opacity-50"
                }`}
              >
                <SvgIcon icon={el.icon} width="26" height="26" />
                <div>{el.label}</div>
              </a>
            </Link>
          </div>
        ))}
      </div>
    </nav>
  );
}
