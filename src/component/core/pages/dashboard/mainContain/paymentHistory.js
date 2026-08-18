"use client";

import useAuthContext from "@/hook/useAuthContext";
import { formatIsoDate } from "@/utils/formatDate";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const PaymentHistory = () => {
  const { user } = useAuthContext();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;

    setLoading(true);
    fetch(`/api/orders?email=${user.email}`)
      .then((res) => res.json())
      .then((data) => {
        setPayments(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        toast.error("Payment history not found");
      });
  }, [user]);

  if (loading) {
    return <div className="loader mt-6"></div>;
  }

  return (
    <table className="w-full border rounded bg-white text-[#516067]">
      <thead>
        <tr className="grid grid-cols-11 items-center border-b bg-slate-200">
          <th className="col-span-1 py-1 px-2">#</th>
          <th className="col-span-4 py-1 px-2">Name</th>
          <th className="col-span-2 py-1 px-2">quantity</th>
          <th className="col-span-2 py-1 px-2">৳</th>
          <th className="col-span-2 py-1 px-2">Date</th>
        </tr>
      </thead>
      {payments.length > 0 ? (
        payments.map((item, index) => (
          <tbody key={index}>
            <tr className="text-center border-b grid grid-cols-11 items-center">
              <td className="col-span-1 py-1 px-2 border-r">{index + 1}</td>
              <td className="col-span-4 py-1 px-2 border-r">
                {item?.items?.map((product) => product?.name).join(", ") || "Order"}
              </td>
              <td className="col-span-2 py-1 px-2 border-r">
                {item?.items?.length || 0}
              </td>
              <td className="text-right col-span-2 py-1 px-2 border-r">
                {item?.total}৳
              </td>
              <td className="text-right col-span-2 py-1 px-2 border-r">
                {formatIsoDate(item?.createdAt)}
              </td>
            </tr>
          </tbody>
        ))
      ) : (
        <tbody>
          <tr className="text-lg font-normal text-[#516067] text-center py-1">
            <td>No payment history available</td>
          </tr>
        </tbody>
      )}
    </table>
  );
};

export default PaymentHistory;
