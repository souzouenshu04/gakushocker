import PAYPAY from "@paypayopa/paypayopa-sdk-node";
import { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const MERCHANT_ID = process.env.MERCHANT_ID;
if (!CLIENT_ID || !CLIENT_SECRET || !MERCHANT_ID) {
  throw Error("missing environment variable")
}

PAYPAY.Configure({
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  merchantId: MERCHANT_ID,
  productionMode: false,
});

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ body: "Method not allowed" });
  }

  console.log(req.body);
  const { amount } = req.body;
  const merchantPaymentId = uuidv4();

  let payload = {
    merchantPaymentId: merchantPaymentId,
    amount: {
      amount: parseInt(amount),
      currency: "JPY"
    },
    codeType: "ORDER_QR",
    orderDescription: "gakushocker payment request",
    isAuthorization: false,
    redirectUrl: "http://localhost:3000",
    redirectType: "WEB_LINK"
  };
  PAYPAY.QRCodeCreate(payload, (response) => {
    if ("BODY" in response && response.BODY) {
      return res.status(200).json({body: response.BODY});
    }
  });
};

export default handler;
