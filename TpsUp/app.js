const fetch = require('node-fetch')
const prompt = require("prompt-sync")({ sigint: true });
const { performance } = require("perf_hooks");
const axios = require('axios');
const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")

const app = express()
app.use(bodyParser.json())

function make_batch_requests() {
  const base_URL = 'http://localhost:4444/Login'
  const Data = [
    { username: 'ali', password: 'ali01' },
    { username: 'ahmad', password: 'ahmad01' },
    { username: 'hamza', password: 'hamza01' },
    { username: 'abdullah', password: 'abdullah01' },
    { username: 'mahad', password: 'mahad01' },
    { username: 'kavish', password: 'kavish01' },
    { username: 'huzaifi0604', password: 'Abc@0604' },
    { username: 'ans', password: 'ans01' },
    { username: 'malik', password: 'malik01' },
    { username: 'musab', password: 'musab01' }
  ]

  const make_request = async (creds) => {
    try {
      const response = await fetch(base_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(creds)
      });
      const data = await response.json();
      return { message: data.message, token: data.token };
    } catch (error) {
      console.error("Error Sending Request: ", error)
    }
  };
  let i = 10;
  let arrayofPromises = [];
  for (let j = 0; j < 10; j++) {
    arrayofPromises.push(...Data.map((creds) => make_request(creds)));
  }

  console.log("Promises Array Length: ", arrayofPromises.length);

  return Promise.all(arrayofPromises)
}
// make_batch_requests();

const Sequential_Chunking_Requests = async () => {
  console.log("================================= SEQUENTIAL Calling =================================")
  for (let i = 0; i < 100; i++) {
    console.log(`\n[+] - Chunk # ${i}\n`);
    try {
      const replies = await make_batch_requests()
      replies.forEach(reply => {
        console.log("Message:", reply.message);
        console.log("Token:", reply.token);
        console.log("-------------------");
      });
    } catch (error) {
      console.error("Something Went Wrong!!", error)
    }
  }
  console.log("================================= ================== =================================")
}

const Chunk_Batching = async () => {
  console.log("================================= Batch Calling =================================");
  const Batched_Requests = [];
  for (let i = 0; i < 100; i++) {
    Batched_Requests.push(make_batch_requests());
  }
  try {
    const batchResults = await Promise.all(Batched_Requests);
    for (const batchResult of batchResults) {
      try {
        const result = await Promise.all(batchResult);
        result.forEach(item => {
          console.log("Message: ", item.message);
          console.log("Token: ", item.token);
        })
      } catch (error) {
        console.error("Something Went Wrong in 2nd layer promises: ", error);
      }
    }
  } catch (error) {
    console.error("Something went wrong in 1st layer promises: ", error);
  }
}

const one_to_one = async () => {
  for (let i = 0; i < 10000; i++) {
    console.log(`\n[+] - Request # ${i}\n`);

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'http://localhost:4444/Login',
      headers: {
        'Content-Type': 'application/json'
      },
      data: JSON.stringify({
        "username": "dingavinga01",
        "password": "123456"
      })
    };

    const response = await axios.request(config);
    console.log(response.data)
    if (response.data) {
      console.log("response returned", response.data)
    } else {
      console.log("no reponse");
    }
  }
}


const allTogether = async () => {
  const avg_iteration_time = []
  let start, end, counter = 0
  for (let i = 0; i < 10000; i++) {
    start = performance.now()
    // console.log(`\n[+] - Request # ${i}\n`);

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'http://localhost:4444/Login',
      headers: {
        'Content-Type': 'application/json'
      },
      data: JSON.stringify({
        "username": "dingavinga01",
        "password": "123456"
      })
    };

    const response = axios.request(config)
      .then((response) => {
        // console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        // console.log(error.response);
      });
    counter += 1;
    end = performance.now()
    avg_iteration_time.push(end - start);
  }
  console.log("Counter: ", counter)
  console.log("Times Array: ", avg_iteration_time)
  let assumed_iteration_time
  let sum = 0;
  for (let i = 0; i < avg_iteration_time.length; i++) {
    sum += avg_iteration_time[i]
  }
  assumed_iteration_time = sum / avg_iteration_time.length
  const counter_execution_time = counter * assumed_iteration_time
  console.log("Counter Execution Time: ", counter_execution_time)
}



async function Single_Batch_Requesting() {
  let totalRequests = 1000;
  const single_batch_size = 100;

  const makeRequest = async (creds) => {
    try {
      const response = await fetch("http://localhost:4444/Login", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(creds)
      });
      const data = await response.json();
      console.log("Message: ", data.message)
      console.log("Token: ", data.token);
      console.log("============================================")
    } catch (error) {
      console.error("Error making request:", error);
    }
  };

  while (totalRequests > 0) {
    const batchSize = Math.min(totalRequests, single_batch_size);
    const creds = Array.from({ length: batchSize }, () => {
      return { username: "huzaifi0604", password: 'Abc@0604' };
    });
    await Promise.all(creds.map(makeRequest));

    totalRequests -= batchSize;
  }
}

// Login API endpoint
app.post("/Login", async(req, res) => {
  const data = req.body;

  console.log("Data:" , data)
  try {
      // const result = await startWorkerThread(data);
      if(data.username === 'kawish' && data.password === '123')
      setTimeout(() => {
        res.status(200).send({message: 'OK'})
      }, 3000);
      else{
        setTimeout(() => {
          res.status(200).send({message: "No Such User Found!!"})
        })
      }
  } catch (error) {
      console.log("Error Processing Login Request: ", error)
      res.status(404).send({message: "Error"})
  }
})

const PORT = 4444
app.listen(PORT, ()=>{
  console.log("Sever Listening on Port: ", PORT);
})


// let selection = prompt("Enter Request Method:- ");
// switch (selection) {
//   case '1':
//     const start1 = performance.now()
//     Sequential_Chunking_Requests().then(() => {
//       const end1 = performance.now()
//       console.log("Sequential Time: ", end1 - start1);
//     })
//     break;
//   case '2':
//     const start2 = performance.now()
//     Chunk_Batching().then(() => {
//       const end2 = performance.now()
//       console.log("Batch Time: ", end2 - start2);
//     })
//     break;
//   case '3':
//     const start3 = performance.now()
//     one_to_one().then(() => {
//       const end3 = performance.now()
//       console.log("One by One Requesting Time: ", end3 - start3);
//     })
//     break;
//   case '4':
//     const start4 = performance.now()
//     Single_Batch_Requesting().then(() => {
//       const end4 = performance.now()
//       console.log("One by One Requesting Time: ", end4 - start4);
//     })
//     break;
//   case '5':
//     const start5 = performance.now()
//     allTogether().then(() => {
//       const end5 = performance.now();
//       console.log("Total Normal EXecution Time: ", end5 - start5);
//     })
//     break;

//   default:
//     console.log("No Such Method Exists. Try Again!!")
// }