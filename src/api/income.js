import axios from 'axios';

const BASE = import.meta.env.VITE_API_URL + '/api/income';

export const getIncome = (month, year) =>
  axios.get(BASE, { params: { month, year } });

export const createIncome = (data) => axios.post(BASE, data);
export const updateIncome = (id, data) => axios.put(`${BASE}/${id}`, data);
export const deleteIncome = (id) => axios.delete(`${BASE}/${id}`);