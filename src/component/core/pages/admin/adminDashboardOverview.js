"use client";

import useAuthContext from "@/hook/useAuthContext";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const AdminDashboardOverview = () => {
  const { user } = useAuthContext();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;

    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_api}api/admin/stats?email=${user.email}`)
      .then((res) => {
        if (!res.ok) throw new Error("Admin dashboard data not found");
        return res.json();
      })
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        toast.error(error.message);
      });
  }, [user]);

  if (loading) return <div className="loader mt-10"></div>;

  const cards = [
    {
      label: "Total Revenue",
      value: `৳ ${Number(stats?.totalSales || 0).toFixed(2)}`,
      icon: "heroicons-outline:cash",
      delta: "+11%",
    },
    {
      label: "Total Order",
      value: stats?.totalOrders || 0,
      icon: "heroicons-outline:shopping-bag",
      delta: "+15%",
    },
    {
      label: "Total Customer",
      value: stats?.totalUsers || 0,
      icon: "heroicons-outline:user-group",
      delta: "+7%",
    },
    {
      label: "Total Product",
      value: stats?.totalProducts || 0,
      icon: "heroicons-outline:cube",
      delta: "+4%",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-[#6f827e]">Overview</p>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        </div>
        <div className="flex w-full max-w-md items-center gap-2 rounded bg-white px-3 py-2">
          <Icon className="text-[#7f9690]" icon="heroicons-outline:search" />
          <input className="w-full bg-transparent text-sm" placeholder="Search dashboard" />
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="rounded bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-[#7f9690]">{card.label}</p>
                <h2 className="mt-3 text-2xl font-bold">{card.value}</h2>
              </div>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#d9f8ef] text-[#28b895]">
                <Icon icon={card.icon} />
              </span>
            </div>
            <p className="mt-4 text-right text-xs font-semibold text-[#28b895]">{card.delta}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-5 lg:grid-cols-[1fr_310px]">
        <div className="rounded bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-bold">Sales Analytic</h2>
            <span className="rounded border px-3 py-1 text-xs text-[#6f827e]">Jul 2026</span>
          </div>
          <div className="grid gap-4 text-sm md:grid-cols-3">
            <div>
              <p className="text-[#7f9690]">Income</p>
              <h3 className="font-bold">৳ {Number(stats?.totalSales || 0).toFixed(2)}</h3>
            </div>
            <div>
              <p className="text-[#7f9690]">Expenses</p>
              <h3 className="font-bold">৳ 0.00</h3>
            </div>
            <div>
              <p className="text-[#7f9690]">Balance</p>
              <h3 className="font-bold">৳ {Number(stats?.totalSales || 0).toFixed(2)}</h3>
            </div>
          </div>
          <div className="mt-6 h-48 rounded bg-[#f3fbf8] p-4">
            <div className="flex h-full items-end gap-2">
              {[28, 64, 42, 78, 55, 88, 46, 70, 82, 50, 74, 92].map((height, index) => (
                <div key={index} className="flex flex-1 items-end">
                  <div
                    className="w-full rounded-t bg-[#9ee9d8]"
                    style={{ height: `${height}%` }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold">Sales Target</h2>
          <div className="mx-auto mt-6 flex h-40 w-40 items-center justify-center rounded-full border-[16px] border-[#dff6ef] border-t-[#62d5bd]">
            <div className="text-center">
              <p className="text-xs text-[#7f9690]">Monthly</p>
              <h3 className="text-xl font-bold">৳ {Number(stats?.totalSales || 0).toFixed(0)}</h3>
            </div>
          </div>
          <div className="mt-6 space-y-3 text-sm">
            <p className="flex justify-between"><span>Daily Target</span><b>৳ 650</b></p>
            <p className="flex justify-between"><span>Monthly Target</span><b>৳ 145,00</b></p>
          </div>
        </div>
      </section>

      <section className="rounded bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">Top Selling Products</h2>
          <Icon icon="heroicons-outline:arrow-right" />
        </div>
        <div className="grid gap-4 md:grid-cols-5">
          {stats?.bestProducts?.length ? (
            stats.bestProducts.map((product) => (
              <div key={product?._id} className="rounded bg-[#f7fbfa] p-3">
                <div className="aspect-square overflow-hidden rounded bg-white">
                  {product?.image && (
                    <Image
                      src={product.image}
                      alt={product.title}
                      width={200}
                      height={200}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <h3 className="mt-3 text-sm font-bold">{product?.title}</h3>
                <p className="text-xs text-[#7f9690]">{product?.sells || 0} sells</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-[#7f9690]">No product performance yet.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default AdminDashboardOverview;
