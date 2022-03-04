const OMNI_URL = process.env.NEXT_PUBLIC_OMNI_URL;
export interface InquiryResult {
  code: number;
  result: {
    status: boolean;
    message: string;
    data: {
      status: {
        code: string;
        message: string;
      };
      product: {
        code: string;
        label: string;
        price: number;
      };
      data?: {
        admin_charge: number;
        amount: number;
        transaction_state: string;
        expiry_time: string;
        phone: string;
        commercial_name: string;
        description: string;
        description_detail: string;
        terms: string;
        allowance_description: string;
        product_length: string;
      };
      reference_no: string;
      account_no: string;
    };
  };
}

export const inquiry = async (token: string, paymentCode: string): Promise<InquiryResult> => {
  try {
    const response = await fetch(OMNI_URL + '/api/v1/payment/inquiry/', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: 'Token ' + token,
      },
      body: JSON.stringify({
        payment_code: paymentCode,
      }),
    });

    if (response.status !== 200) {
      throw new Error('inquiry failed');
    }

    const data = (await response.json()) as InquiryResult;
    if (data.code !== 200) {
      throw new Error('inquiry failed');
    }
    return data;
  } catch (error) {
    return {
      code: 400,
      result: {
        status: false,
        message: 'inquiry failed',
        data: {
          status: {
            code: 'RC99',
            message: 'inquiry failed',
          },
          product: {
            code: '',
            label: '',
            price: 0,
          },
          reference_no: '',
          account_no: paymentCode,
        },
      },
    };
  }
};
