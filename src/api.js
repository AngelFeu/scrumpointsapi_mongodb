import axios from 'axios';

export default axios.create({
    //baseURL: `https://4519f263185f.ngrok.io/api/`
    baseURL: `http://localhost:4000/api/`
});