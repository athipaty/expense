import axios from 'axios';

const BASE = import.meta.env.VITE_API_URL + '/api/expenses';

export const getExpenses = (month, year) =>
  axios.get(BASE, { params: { month, year } });

export const createExpense = (data) => axios.post(BASE, data);
export const updateExpense = (id, data) => axios.put(`${BASE}/${id}`, data);
export const deleteExpense = (id) => axios.delete(`${BASE}/${id}`);