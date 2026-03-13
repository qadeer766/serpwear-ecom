"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";

import loadingSvg from "@/public/assets/images/loading.svg";
import { showToast } from "@/lib/showToast";

import { useSelector } from "react-redux";

const OrderSuccessPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const sessionId = searchParams.get("session_id");

  const cart = useSelector((store) => store.cartStore);
  const auth = useSelector((store) => store.authStore);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) {
      router.push("/checkout");
      return;
    }

    const processOrder = async () => {
  try {

    /* ---------------- VERIFY PAYMENT ---------------- */

    const { data: verifyRes } = await axios.post(
      "/api/payment/verify-session",
      { _id: sessionId }
    );

    if (!verifyRes.success) {
      throw new Error(verifyRes.message);
    }

    /* ---------------- GET SHIPPING DATA ---------------- */

    const shippingData = JSON.parse(
      localStorage.getItem("shippingData")
    );

    if (!shippingData) {
      throw new Error("Shipping data missing.");
    }

    /* ---------------- SAVE ORDER ---------------- */

    const products = JSON.parse(
  localStorage.getItem("cartProducts")
);
    const { data: saveRes } = await axios.post(
      "/api/payment/save-order",
      {
        sessionId,
        userId: auth?.user?._id,
        products,
        amount: verifyRes.data.amountTotal / 100,
        ...shippingData
      }
    );

    if (!saveRes.success) {
      throw new Error(saveRes.message);
    }

    const orderId = saveRes.data.orderId;

    /* ---------------- CLEANUP ---------------- */

    localStorage.removeItem("shippingData");

    /* ---------------- REDIRECT ---------------- */

    router.replace(`/order-details/${orderId}`);

  } catch (error) {
    showToast("error", error.message);
    router.push("/checkout");
  } finally {
    setLoading(false);
  }
};

processOrder();
  }, [sessionId]);

  return (
    <div className="w-screen h-[500px] flex justify-center items-center">

      {loading && (
        <div className="text-center">

          <Image
            src={loadingSvg}
            alt="processing payment"
            width={80}
            height={80}
            className="mx-auto mb-5"
          />

          <h2 className="text-xl font-semibold">
            Processing your payment...
          </h2>

          <p className="text-gray-500">
            Please wait while we confirm your order.
          </p>

        </div>
      )}

    </div>
  );
};

export default OrderSuccessPage;