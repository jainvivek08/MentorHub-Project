import React, { useEffect, useState } from "react";
import { Table, Spin } from "antd";
import Dashboard from "./dashboard";
import { MdOutlineCurrencyRupee } from "react-icons/md";
import moment from "moment";
import booking from "../../apiManger/booking";

// A couple of sample rows shown alongside real data (for demo purposes)
const sampleRows = [
  {
    key: "sample-1",
    no: 1,
    studentName: "Jane Doe",
    transactionId: "TXN12345",
    date: "2024-10-15",
    amount: "₹50",
    status: "Completed",
  },
  {
    key: "sample-2",
    no: 2,
    studentName: "Mark Smith",
    transactionId: "TXN67890",
    date: "2024-10-10",
    amount: "₹75",
    status: "Completed",
  },
];

const Payment = () => {
  const [paymentHistory, setPaymentHistory] = useState(sampleRows);
  const [loading, setLoading] = useState(true);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await booking.getMentorBookings();
      const bookings = res?.data?.bookings || [];

      const realRows = bookings
        .filter((b) => b.status !== "cancelled")
        .map((b, index) => ({
          key: b._id,
          no: sampleRows.length + index + 1,
          studentName: b.user?.name || "Unknown Student",
          transactionId: b._id,
          date: moment(b.dateAndTime).format("YYYY-MM-DD"),
          amount: "₹" + b.price,
          status: b.status === "confirmed" ? "Completed" : "Pending",
        }));

      setPaymentHistory([...sampleRows, ...realRows]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const columns = [
    {
      title: "No.",
      dataIndex: "no",
      key: "no",
    },
    {
      title: "Student Name",
      dataIndex: "studentName",
      key: "studentName",
    },
    {
      title: "Transaction ID",
      dataIndex: "transactionId",
      key: "transactionId",
      ellipsis: true,
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <span
          className={`status ${
            status === "Completed" ? "text-green-500" : "text-orange-500"
          }`}
        >
          {status}
        </span>
      ),
    },
  ];

  return (
    <Dashboard>
      <div className="p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
        <div className="flex items-center mb-4">
          <MdOutlineCurrencyRupee className="mr-2 text-3xl text-blue-600" />
          <h2 className="text-2xl font-bold dark:text-white">
            Payment History
          </h2>
        </div>
        {loading ? (
          <div className="flex justify-center py-10">
            <Spin size="large" />
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={paymentHistory}
            pagination={{
              pageSize: 5,
              showSizeChanger: false,
            }}
            className="w-full"
          />
        )}
      </div>
    </Dashboard>
  );
};

export default Payment;
