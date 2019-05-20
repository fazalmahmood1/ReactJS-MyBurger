import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://react-my-burger-958df.firebaseio.com/'
});


export default instance;
