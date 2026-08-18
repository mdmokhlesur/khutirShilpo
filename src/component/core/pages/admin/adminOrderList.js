"use client";

import useAuthContext from "@/hook/useAuthContext";
import { formatIsoDateTime } from "@/utils/formatDate";
import { Icon } from "@iconify/react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const statusOptions = [
  "pending",
  "processing",
  "shipped",
  "completed",
  "cancelled",
  "payment unsupported",
];

const AdminOrderList = () => {
  const { user } = useAuthContext();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadOrders = useCallback(() => {
    if (!user?.email) return;

    setLoading(true);
    fetch(`/api/orders?email=${user.email}`)
      .then((res) => {
        if (!res.ok) throw new Error("Orders not found");
        return res.json();
      })
      .then((data) => {
        setOrders(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        toast.error(error.message);
      });
  }, [user]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const updateStatus = (order, status) => {
    fetch(`/api/orders`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: order?._id,
        status,
        adminEmail: user?.email,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Order status update failed");
        return res.json();
      })
      .then((updatedOrder) => {
        toast.success("Order status updated");
        setSelectedOrder(updatedOrder);
        loadOrders();
      })
      .catch((error) => toast.error(error.message));
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-[#6f827e]">Orders</p>
        <h1 className="text-2xl font-bold">Order List</h1>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <section className="rounded bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold">Current Orders</h2>
            <span className="text-sm text-[#6f827e]">{orders.length} orders</span>
          </div>

          {loading ? (
            <div className="loader mt-10"></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px]">
                <thead>
                  <tr className="border-b text-left text-sm text-[#6f827e]">
                    <th className="p-3">Customer</th>
                    <th className="p-3">Items</th>
                    <th className="p-3 text-right">Total</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order?._id} className="border-b last:border-0">
                      <td className="p-3">
                        <p>{order?.customerName || "Customer"}</p>
                        <p className="text-xs text-[#6f827e]">{order?.email}</p>
                      </td>
                      <td className="p-3 text-sm">
                        {order?.items?.length || 0} item{order?.items?.length === 1 ? "" : "s"}
                      </td>
                      <td className="p-3 text-right">৳ {order?.total}</td>
                      <td className="p-3">
                        <select
                          className="rounded border border-[#d7e8e3] p-2 text-sm"
                          value={order?.status}
                          onChange={(event) => updateStatus(order, event.target.value)}
                        >
                          {statusOptions.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          className="rounded border px-3 py-2"
                          onClick={() => setSelectedOrder(order)}
                          title="View order"
                        >
                          <Icon icon="heroicons-outline:eye" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {!orders.length && (
                    <tr>
                      <td className="p-4 text-center text-sm text-[#6f827e]" colSpan={6}>
                        No orders available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <aside className="rounded bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold">Order View</h2>
            <Icon icon="heroicons-outline:document-text" />
          </div>
          {selectedOrder ? (
            <div className="space-y-4">
              <div>
                <p className="text-xs text-[#6f827e]">Order</p>
                <h3 className="text-xl font-bold">{selectedOrder?.customerName || "Customer order"}</h3>
              </div>
              <div className="rounded bg-[#f7fbfa] p-3 text-sm">
                <p>{selectedOrder?.customerName || "Customer"}</p>
                <p className="text-[#6f827e]">{selectedOrder?.email}</p>
              </div>
              <div className="space-y-2">
                {selectedOrder?.items?.map((item, index) => (
                  <div key={`${item?.id}-${index}`} className="flex justify-between rounded border border-[#d7e8e3] p-3 text-sm">
                    <span>{item?.name}</span>
                    <b>৳ {item?.price}</b>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4 text-sm">
                <p className="flex justify-between"><span>Payment</span><b>{selectedOrder?.paymentMethod || "N/A"}</b></p>
                <p className="mt-2 flex justify-between"><span>Status</span><b>{selectedOrder?.status}</b></p>
                <p className="mt-2 flex justify-between"><span>Refund</span><b>{selectedOrder?.refundRequested ? "Requested" : "No"}</b></p>
                <p className="mt-2 flex justify-between"><span>Date</span><b>{formatIsoDateTime(selectedOrder?.createdAt) || "N/A"}</b></p>
                <p className="mt-2 flex justify-between text-base"><span>Total</span><b>৳ {selectedOrder?.total}</b></p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-[#6f827e]">Select an order to view details.</p>
          )}
        </aside>
      </div>
    </div>
  );
};

export default AdminOrderList;
