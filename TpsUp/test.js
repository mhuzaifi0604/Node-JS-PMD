const axios = require('axios');
for(let i=0; i<10000;i++){
let data = JSON.stringify({
  "username": "kawish",
  "password": "123"
});

let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: 'http://localhost:4444/Login',
  headers: { 
    'Content-Type': 'application/json'
  },
  data : data
};

 axios.request(config)
.then((response) => {
  console.log(JSON.stringify(response.data));
})
.catch((error) => {
  console.log(error);
});
}