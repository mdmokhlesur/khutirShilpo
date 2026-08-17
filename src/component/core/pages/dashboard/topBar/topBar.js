"use client";
import useAuthContext from "@/hook/useAuthContext";
import { Icon } from "@iconify/react";

const userDashboardItems =[
  {
    _id:1,
    title:"profile settings",
    icon:<Icon icon="fa-solid:user-cog" />
  },
  {
    _id:2,
    title:"cart items",
    icon:<Icon icon="fa-solid:shopping-cart" />
  },
  {
    _id:3,
    title:"payment history",
    icon:<Icon className="text-lg relative" icon="heroicons-outline:currency-bangladeshi" />
  }
]

const adminDashboardItems = [
  {
    _id: 1,
    title: "dashboard",
    icon: <Icon icon="heroicons-outline:chart-bar" />,
  },
];

const TopBar = () => {
    const {dashboardTitle,setDashboardTitle,userRole} = useAuthContext();
    const dashboardItems = userRole === "admin" ? adminDashboardItems : userDashboardItems;

  return (
    <div className=" h-full flex justify-end text-[#516067] rounded">
      <ul className="flex border border-t-0 gap-3">
        {dashboardItems?.map(item=><li 
        key={item?._id}
        onClick={()=>setDashboardTitle(item?.title)} 
        className={`${dashboardTitle===item?.title&&"bg-slate-50 font-normal text-[#8298a2]"} flex cursor-pointer gap-1 py-2 px-6 items-center`}>
          {item?.icon} {item?.title}</li>)}
      </ul>
    </div>
  );
};

export default TopBar;
