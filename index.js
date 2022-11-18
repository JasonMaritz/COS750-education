const express = require('express')
const parser = require('body-parser')
const server = express()
const fs = require('fs')

//server.use(express.json)

var jsonParser = parser.json()
var scores = {}

function readScores(){
    try{
        let raw = fs.readFileSync('scores.json')
        scores = JSON.parse(raw)
    }catch(err){
        console.log(err)
        scores = {}
    }
}

function writeScores(){
    let newData = JSON.stringify(scores)
    fs.writeFileSync('scores.json', newData)
}

server.post('/', jsonParser, (req, res)=>{
    readScores()
    console.log(req.body)
    scores[req.body.user] = req.body
    writeScores()
    res.send("200: Ok")
})

server.get("/", (req, res)=>{
  res.send("hello world")   
})

server.get("/score", (req, res)=>{
    readScores()
    res.send(scores)
})

server.get("/score/:user", (req, res)=>{
    intermediaryScore = 0
    readScores()

    for(level in scores[req.params.user]["level"]){
        intermediaryScore += scores[req.params.user]["level"][level]["score"]
    }

    res.send({"score": intermediaryScore})
})

server.get("/user", (req, res)=>{
    res.send(Object.keys(scores))
})

server.listen(8080, ()=>{
    console.log("running on port 8080")
})