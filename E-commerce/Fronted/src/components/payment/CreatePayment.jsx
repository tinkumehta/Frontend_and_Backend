import React, { useState } from "react";
import axios from "axios";

const CheckoutPage = () => {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    try {
      setLoading(true);

      // ✅ Call backend to create order
      const { data } = await axios.post(
        "/api/payments/create-order", // Your backend order route
        {
          items: [
            {
              name: "T-shirt",
              quantity: 1,
              price: 250,
              product: "68d790ae545d4fa95b013a9e",
              image:
                "https://res.cloudinary.com/dkk3julf0/image/upload/v1758958261/products/um41x7tcoo4xtdcjf43v.jpg",
            },
          ],
          shippingAddress: {
            address: "01 AshokNagar",
            city: "Barkagaon",
            postalCode: "825311",
            country: "India",
          },
          itemsPrice: 250,
          taxPrice: 15,
          shippingPrice: 10,
          totalAmount: 275,
          currency: "INR",
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // ✅ Auth token if required
            "Content-Type": "application/json",
          },
        }
      );

      // ✅ Razorpay order data from backend
      const { razorpayOrder } = data;

      const options = {
        key: razorpayOrder.key, // ✅ from backend
        amount: razorpayOrder.amount, // in paise
        currency: razorpayOrder.currency,
        name: "My Shop",
        description: "Order Payment",
        image:
          "https://upload.wikimedia.org/wikipedia/commons/7/72/Razorpay_logo.svg",
        order_id: razorpayOrder.id,
        handler: function (response) {
          alert("Payment successful!");
          console.log("Payment Response:", response);
          // ✅ You can send response to backend for verification
        },
        prefill: {
          name: "Tinku Kumar",
          email: "tinku@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md p-6 rounded-lg text-center">
        <h1 className="text-2xl font-bold mb-4">Checkout</h1>
        <p className="mb-2">Product: <b>T-shirt</b></p>
        <p className="mb-2">Total Price: <b>₹275</b></p>
        <button
          onClick={handleCheckout}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Processing..." : "Pay with Razorpay"}
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;
