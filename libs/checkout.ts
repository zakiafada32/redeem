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

export const checkout = async (params: CheckoutParams): Promise<CheckoutResult> => {
  try {
    const response = await fetch('api/checkout/', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
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
