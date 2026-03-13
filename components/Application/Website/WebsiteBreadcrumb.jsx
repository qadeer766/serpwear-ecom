import React from "react";
import Link from "next/link";
import { WEBSITE_HOME } from "@/routes/WebsiteRoute";

const WebsiteBreadcrumb = ({ props }) => {
  return (
    <div className="py-10 flex justify-center items-center bg-[url('/assets/images/page-title.png')] bg-cover bg-center">
      <div>
        <h1 className="text-2xl font-semibold mb-2 text-center">
          {props.title}
        </h1>

        <ul className="flex gap-2 justify-center items-center">
          {/* Home */}
          <li>
            <Link href={WEBSITE_HOME} className="font-semibold">
              Home
            </Link>
          </li>

          {/* Dynamic Links */}
          {props.links.map((item, index) => (
            <li key={index} className="flex items-center gap-2">
              <span>/</span>
              {item.href ? (
                <Link href={item.href}>{item.label}</Link>
              ) : (
                <span>{item.label}</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default WebsiteBreadcrumb;