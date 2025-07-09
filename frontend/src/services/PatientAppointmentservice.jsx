import axios from 'axios';

const API_URL = 'http://localhost:8080/api/appointments';

const getAll = (date) => {
  if (date) {
    return axios.get(`${API_URL}?date=${date}`);
  }
  return axios.get(API_URL);
};
const getById = (id) => axios.get(`${API_URL}/${id}`);
const create = (data) => axios.post(API_URL, data);
const update = (id, data) => axios.put(`${API_URL}/${id}`, data);
const remove = (id) => axios.delete(`${API_URL}/${id}`);
const removeAll = () => axios.delete(API_URL);

export default {
  getAll,getById,create,update,remove,removeAll,
};
