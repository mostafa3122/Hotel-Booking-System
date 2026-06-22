import axiosClient from "../axiosClient";

export interface CreateBookingData {
  room: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
}

export interface BookingResponse {
  success: boolean;
  message: string;
  data: {
    booking?: {
      _id: string;
      [key: string]: any;
    };
    _id?: string;
    [key: string]: any;
  };
}

export const createBooking = async (data: CreateBookingData): Promise<BookingResponse> => {
  const response = await axiosClient.post<BookingResponse>("/portal/booking", data);
  return response.data;
};

export const payBooking = async (bookingId: string, token: string): Promise<any> => {
  const response = await axiosClient.post(`/portal/booking/${bookingId}/pay`, { token });
  return response.data;
};
