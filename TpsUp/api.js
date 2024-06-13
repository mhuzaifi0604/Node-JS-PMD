const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const { Worker, isMainThread, parentPort, workerData } = require("worker_threads")

const app = express()
app.use(cors)
app.use(bodyParser.json())

const username = "huzaifi0604"
const password = "Abc@0604"

const startWorkerThread = async(data) =>{
    return new Promise((resolve, reject) => {
        const worker = new Worker('fourWorker.js', {workerData: data})
        worker.on('message', resolve)
        worker.on('error', reject)
        worker.on('exit', (code) => {
            if (code !== 0) {
                reject(new Error(`Worker stopped with exit code ${code}`));
            }
        });
    })
}

// Login API endpoint
app.post("/Login", async(req, res) => {
    const data = req.body;
    console.log("====================================================")
    console.log("Username: ", data.username)
    console.log("Password:", data.password)
    console.log("====================================================")
    try {
        const result = await startWorkerThread(data);
        res.status(200).json({Result: result})
    } catch (error) {
        console.log("Error Processing Login Request: ", error)
        res.status(500).json({Error: error})
    }
})

const PORT = 4444
app.listen(PORT, ()=>{
    console.log("Sever Listening on Port: ", PORT);
})

if(!isMainThread){
    const {workerData, parentPort} = require("worker_threads")
    const result = handleLogin(workerData)
    parentPort.postMessage(result)
}