import express from "express";
import fs from 'fs'
import path from "path";
import jwt from "jsonwebtoken";

const app = express()

app.use(express.json())

app.get('/', (_, res) => {
    res.send('Working')
})

app.post("/login", (req, res) => {
    const { name, password } = req.body;
  
    const fundUser = JSON.parse(fs.readFileSync(path.normalize(`${process.cwd()}/model/clients.json`))).find((e) => e.name === name && e.password === password);
  
    if (!fundUser) {
      return res.status(401).json({
        message: "user not found",
      });
    }
    res.status(200).json({
      message: "Successfully login",
      access_token: jwt.sign({ id: fundUser?.id }, "454870Sa"),
    });
});

app.post('/signUp', (req, res) => {
    const { name, password } = req.body;

    const allClients = JSON.parse(fs.readFileSync(path.normalize(`${process.cwd()}/model/clients.json`)))
    allClients.push({ id: allClients.at(-1)?.id + 1 || 1, name, password})
    fs.writeFileSync(path.normalize(`${process.cwd()}/model/clients.json`), JSON.stringify(allClients, null, 4))
    
    res.status(201).json({
        message: "User has been created",
        access_token: jwt.sign({ id: fundUser?.id }, "454870Sa"),
    })
})

app.listen(8080, console.log(8080))