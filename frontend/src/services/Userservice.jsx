import axios from 'axios';

const API = 'http://localhost:8080/api/users';

const createUser = (user) => axios.post(API, user);               
const validateUser = (user) => axios.post(`${API}/validate`,user);

export default { createUser, validateUser };
