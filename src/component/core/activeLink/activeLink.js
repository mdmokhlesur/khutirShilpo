"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";

const ActiveLink = ({href,className,children}) => {
    const currentPage=usePathname();
    return (
        <Link href={href} className={`${currentPage===href&&"bg-white/15 font-semibold text-white"} ${className}`}>
            {children}
        </Link>
    );
};

export default ActiveLink;
