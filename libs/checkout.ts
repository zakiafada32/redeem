const OMNI_URL = process.env.NEXT_PUBLIC_OMNI_URL;

export interface CheckoutResult {
  code: number;
  result?: {
    status: boolean;
    message: string;
    payment_link: string;
  };
}

export interface CheckoutParams {
  payment_code: string;
  reference_no: string;
  sender_name: string;
  amount: number;
  email: string;
  phone_number: string;
  expiration: string;
}

export const checkout = async (token: string, params: CheckoutParams): Promise<CheckoutResult> => {
  try {
    const response = await fetch(OMNI_URL + '/api/v1/payment/checkout/', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: 'Token ' + token,
      },
      body: JSON.stringify(params),
    });

    if (response.status !== 200) {
      throw new Error('checkout failed');
    }

    const result = (await response.json()) as CheckoutResult;
    if (result.code !== 200) {
      throw new Error('checkout failed');
    }

    return result;
  } catch (error) {
    return { code: 400 };
  }
};
