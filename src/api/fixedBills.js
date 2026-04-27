import axios from 'axios';

const BASE = import.meta.env.VITE_API_URL + '/api/fixed-bills';

export const getFixedBills = (month, year) =>
  axios.get(BASE, { params: { month, year } });

export const createFixedBill = (data) => axios.post(BASE, data);
export const updateFixedBill = (id, data) => axios.put(`${BASE}/${id}`, data);
export const deleteFixedBill = (id) => axios.delete(`${BASE}/${id}`);