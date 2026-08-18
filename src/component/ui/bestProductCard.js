"use client";
import useAuthContext from "@/hook/useAuthContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {toast} from "react-hot-toast";

const BestProductCard = ({ product, id }) => {
  const {user}=useAuthContext();

  const { replace } = useRouter();
  const viewDetailsHandler=(id)=>{
    if (!user) {
      return toast.error("You need to login first");
    }
    replace(`/`)
  }
  return (
    <div
      onClick={()=>viewDetailsHandler(id)}
      className="group cursor-pointer rounded-xl border border-[var(--ks-border)] bg-white p-2 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
    >
      <div className="relative h-24 overflow-hidden rounded-lg bg-[var(--ks-cream)]">
        <Image
          height={140}
          width={180}
          className={`${!product?.image&&"max-h-48"} h-full w-full object-contain p-2 transition duration-300 group-hover:scale-105`}
          src={product?.image}
          alt="product image"
        />
      </div>
      <div className="mt-2 rounded-lg bg-[#f8e9cf] px-2 py-2 text-center">
        <h4 className="truncate text-xs font-semibold text-[var(--ks-ink)]">
          {product?.title}
        </h4>
      </div>
    </div>
  );
};

export default BestProductCard;
