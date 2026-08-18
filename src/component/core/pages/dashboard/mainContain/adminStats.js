"use client";

import useAuthContext from "@/hook/useAuthContext";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const AdminStats = () => {
  const { user } = useAuthContext();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;

    setLoading(true);
    fetch(`/api/admin/stats?email=${user.email}`)
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        toast.error("Admin dashboard data not found");
      });
  }, [user]);

  if (loading) return <div className="loader mt-8"></div>;

  return (
    <div className="grid gap-3 text-[#516067] md:grid-cols-3">
      <div className="border rounded p-4">
        <p className="text-sm">All sales</p>
        <h3 className="text-2xl font-semibold">৳ {Number(stats?.totalSales || 0).toFixed(2)}</h3>
      </div>
      <div className="border rounded p-4">
        <p className="text-sm">All products</p>
        <h3 className="text-2xl font-semibold">{stats?.totalProducts || 0}</h3>
      </div>
      <div className="border rounded p-4">
        <p className="text-sm">All users</p>
        <h3 className="text-2xl font-semibold">{stats?.totalUsers || 0}</h3>
      </div>
    </div>
  );
};

export default AdminStats;
