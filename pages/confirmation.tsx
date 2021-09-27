import { styled, Box } from "../stitches.config";
import { useCartStore } from "../lib/cart";
import Layout from "../components/Layout";
import useSWR from "swr";
import { useRouter } from "next/router";
import { fetchGetJSON } from "../lib/fetcher";
import { useEffect } from "react";

const Confirmation = () => {
  const { clearCart } = useCartStore();
  const router = useRouter();

  const { data, error } = useSWR(
    router.query.session_id
      ? `/api/checkout_sessions/${router.query.session_id}`
      : null,
    fetchGetJSON
  );

  useEffect(() => {
    // If checkout is completed, the cart should be cleared.
    clearCart();
  }, [clearCart]);

  /**
   * Data for buyer
   * data.payment_intent.charges.data[0].billing_details.email
   * data.payment_intent.charges.data[0].billing_details.name
   *
   */

  /**
   * Data for seller
   * data.payment_intent
   */

  // console.log(data.payment_intent);

  return (
    <div>
      <div>Confirmation:</div>
      {error && <div>Your payment could not be verified.</div>}
      {data && (
        <div>
          Success!<div>This is your reference: {data.payment_intent.id}</div>
        </div>
      )}
      {/* <div>{JSON.stringify(data)}</div>
      <div>{JSON.stringify(error)}</div> */}
    </div>
  );
};

// @ts-ignore
Confirmation.layout = Layout;

export default Confirmation;
