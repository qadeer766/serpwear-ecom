
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { IoLocationOutline } from "react-icons/io5";
import { MdOutlinePhone, MdOutlineMail } from "react-icons/md";
import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import { FaTiktok } from "react-icons/fa";
import { FiTwitter } from "react-icons/fi";
import logo from "@/public/assets/images/logo-black.png";
import { USER_DASHBOARD, WEBSITE_HOME, WEBSITE_LOGIN, WEBSITE_REGISTER, WEBSITE_SHOP } from "@/routes/WebsiteRoute";

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t mt-16">
      <div className="grid lg:grid-cols-5 md:grid-cols-2 grid-cols-1 gap-10 py-14 lg:px-32 px-6">

        {/* Logo + Description */}
        <div className="lg:col-span-1 md:col-span-2 col-span-1">
          <Image
            src={logo}
            width={383}
            height={146}
            alt="logo"
            className="w-36 mb-4"
          />
          <p className="text-gray-500 text-sm leading-relaxed">
            E-store is your trusted destination for quality and convenience.
            From fashion to essentials, we bring everything you need right to
            your doorstep. Shop smart, live better — only at E-store.
          </p>
        </div>

        {/* Categories */}
        <div>
          <h4 className="text-lg font-semibold uppercase mb-5">
            Categories
          </h4>
          <ul className="space-y-3 text-sm text-gray-500">
            <li><Link href={`${WEBSITE_SHOP}?category=t-shirts`} className="hover:text-primary transition">T-shirt</Link></li>
            <li><Link href={`${WEBSITE_SHOP}?category=hoodies`}  className="hover:text-primary transition">Hoodies</Link></li>
            <li><Link href={`${WEBSITE_SHOP}?category=oversized`}  className="hover:text-primary transition">Oversized</Link></li>
            <li><Link href={`${WEBSITE_SHOP}?category=full-sleeves`}  className="hover:text-primary transition">Full Sleeves</Link></li>
          <li>
  <Link href={`${WEBSITE_SHOP}?category=polo`} className="hover:text-primary transition">
    Polo
  </Link>
</li>
          </ul>
        </div>

        {/* Useful Links */}
        <div>
          <h4 className="text-lg font-semibold uppercase mb-5">
            Useful Links
          </h4>
          <ul className="space-y-3 text-sm text-gray-500">
            <li><Link href={WEBSITE_HOME} className="hover:text-primary transition">Home</Link></li>
            <li><Link href={WEBSITE_SHOP} className="hover:text-primary transition">Shop</Link></li>
            <li><Link href="/about-us" className="hover:text-primary transition">About</Link></li>
            <li><Link href={WEBSITE_REGISTER} className="hover:text-primary transition">Register</Link></li>
            <li><Link href={WEBSITE_LOGIN} className="hover:text-primary transition">Login</Link></li>
          </ul>
        </div>

        {/* Help Center */}
        <div>
          <h4 className="text-lg font-semibold uppercase mb-5">
            Help Center
          </h4>
          <ul className="space-y-3 text-sm text-gray-500">
            <li><Link href={WEBSITE_REGISTER} className="hover:text-primary transition">Register</Link></li>
            <li><Link href={WEBSITE_HOME} className="hover:text-primary transition">Login</Link></li>
            <li><Link href={USER_DASHBOARD} className="hover:text-primary transition">My Account</Link></li>
            <li><Link href="/privacy-policy" className="hover:text-primary transition">Privacy Policy</Link></li>
            <li><Link href="/terms-and-conditions" className="hover:text-primary transition">Terms & Conditions</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-lg font-semibold uppercase mb-5">
            Contact Us
          </h4>

          <ul className="space-y-4 text-sm text-gray-500">

            <li className="flex items-start gap-3">
              <IoLocationOutline size={20} className="text-primary mt-1" />
              <span>
                E-store market Abbottabad, Pakistan 32300
              </span>
            </li>

            <li className="flex items-center gap-3">
              <MdOutlinePhone size={20} className="text-primary" />
              <Link
                href="tel:+92-3284340607"
                className="hover:text-primary transition"
              >
                +92-3284340607
              </Link>
            </li>

            <li className="flex items-center gap-3">
              <MdOutlineMail size={20} className="text-primary" />
              <Link
                href="mailto:support@serpwear.com"
                className="hover:text-primary transition"
              >
                abdulqadeer1764@.com
              </Link>
            </li>

          </ul>

          {/* Social Icons */}
          <div className="flex gap-4 mt-6">
            <Link href="https://www.instagram.com/the.abdulqadeer?igsh=MWtraHpkMDc1eWc3" className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow hover:bg-primary hover:text-white transition">
              <FaInstagram size={18} />
            </Link>
            <Link href="https://wa.me/923259742766" className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow hover:bg-primary hover:text-white transition">
              <FaWhatsapp size={18} />
            </Link>
            <Link href="https://www.tiktok.com/@the.abdulqadeer" className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow hover:bg-primary hover:text-white transition">
              <FaTiktok size={20} />
            </Link>
            <Link href="https://x.com/TechCoding0" className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow hover:bg-primary hover:text-white transition">
              <FiTwitter size={18} />
            </Link>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="py-5 bg-gray-100 border-t">
        <p className="text-center text-sm text-gray-500">
          © 2026 <span className="font-semibold text-primary">SerpWear</span>. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;