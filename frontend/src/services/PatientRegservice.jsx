import axios from "axios";

const API_URL = "http://localhost:8080/api/patients";
const getAll = () => axios.get(API_URL);
const create = (data) => axios.post(API_URL, data);
const update = (id, data) => axios.put(`${API_URL}/${id}`, data);
const remove = (id) => axios.delete(`${API_URL}/${id}`);
export default {
  getAll,create,update,remove,
};
