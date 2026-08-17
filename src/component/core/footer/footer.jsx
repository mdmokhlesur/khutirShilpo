"use client";
import Button from "@/component/ui/button";
import { Icon } from "@iconify/react";
import Link from "next/link";

const Footer = () => {
  return (
    <div className="bg-slate-50 md:mt-12">
      <div className="container mt-10">
        {/* footer top part */}
        <div className="grid md:grid-cols-2 gap-4 border-b py-8">
          {/* logo */}
          <div className="h-full flex flex-col">
            <Link href="/">
              <h4 className="text-[#516067] text-xl md:text-3xl font-semibold">
                Kutir Shilpo
              </h4>
            </Link>
            <h4 className="mt-auto text-lg text-[#516067]">Follow Us:</h4>
            <ul className="flex gap-3 mt-3">
              <li className="h-8 w-8 flex justify-center items-center bg-[#8298a2] text-white rounded">
                <Link href="/">
                  <Icon className="text-sm" icon="fa-brands:facebook-f" />
                </Link>
              </li>
              <li className="h-8 w-8 flex justify-center items-center bg-[#8298a2] text-white rounded">
                <Link href="/">
                  <Icon className="text-sm" icon="fa-brands:twitter" />
                </Link>
              </li>
              <li className="h-8 w-8 flex justify-center items-center bg-[#8298a2] text-white rounded">
                <Link href="/">
                  <Icon className="text-sm" icon="fa-brands:linkedin-in" />
                </Link>
              </li>
              <li className="h-8 w-8 flex justify-center items-center bg-[#8298a2] text-white rounded">
                <Link href="/">
                  <Icon className="text-sm" icon="fa-brands:youtube" />
                </Link>
              </li>
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {/* footer menu */}
            <div>
              <h4 className="font-semibold text-[#516067] mb-2">
                <span className="border-b-2 border-[#516067]">Menu</span>
              </h4>
              <ul className="flex flex-col gap-1">
                <li className="text-sm font-medium text-[#516067]">
                  <Link href="/">Home</Link>
                </li>
                <li className="text-sm font-medium text-[#516067]">
                  <Link href="/products">Products</Link>
                </li>
                <li className="text-sm font-medium text-[#516067]">
                  <Link href="/">Google Login</Link>
                </li>
                <li className="text-sm font-medium text-[#516067]">
                  <Link href="/">FAQs</Link>
                </li>
                <li className="text-sm font-medium text-[#516067]">
                  <Link href="/">Contract</Link>
                </li>
                <li className="text-sm font-medium text-[#516067]">
                  <Link href="/">Community</Link>
                </li>
              </ul>
            </div>
            {/* feedback submit */}
            <div>
              <h4 className="font-semibold text-[#516067] mb-2">
                <span className="border-b-2 border-[#516067]">Feedback</span>
              </h4>
              <p className="text-sm text-[#516067]">
                Give Your Valuable Review, We allows appreciate your positive
                review.
              </p>
              <form>
                <input
                  className="border w-full py-2 px-3 rounded my-3"
                  type="text"
                  placeholder="Enter Your Email"
                />
                <Button className="w-full">Subscribe</Button>
              </form>
            </div>
          </div>
        </div>
        {/* footer bottom part */}
        <div className="flex justify-between py-5 text-sm">
          <p>Copyright © 2023 KutirShilpo.com | All rights reserved.</p>
          <div className="flex gap-2">
            <Link href="/">privacy</Link> |
            <Link href="/">Trams & Condition</Link>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Footer;
