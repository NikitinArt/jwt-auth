import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Fingerprint from "express-fingerprint";
import AuthRootRouter from "./routers/Auth.js";
import TokenService from "./services/Token.js";
import cookieParser from "cookie-parser";
import UserRepository from "./repositories/User.js";
import AuthController from "./controllers/Auth.js";
import AuthService, { users_role } from "./services/Auth.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();

app.use(cookieParser());
app.use(express.json());

// const allowedDomains = ["http://localhost:5173", "http://77.37.239.19:5173"]

app.use((req,res, next)=>{
    res.setHeader("Access-Control-Allow-Origin", "http://77.37.239.19:5173");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Max-Age", "1800");
    res.setHeader("Access-Control-Allow-Headers", "Origin, Content-Type, Authorization, X-Api-Key, X-Requested-With, Accept");
    res.setHeader("Access-Control-Allow-Methods","PUT, POST, GET, DELETE, PATCH, OPTIONS");
    next();
});

app.use(
  Fingerprint({
    parameters: [Fingerprint.useragent, Fingerprint.acceptHeaders],
  })
);

app.use("/auth", AuthRootRouter);

app.get("/resource/protected", TokenService.checkAccess, async (_, res) => {
  if (users_role == 1){
    const users = await UserRepository.getUsers();
    const count = await UserRepository.getUserCount();
    let user1 = users[ (Math.floor(Math.random() * (count.count - 0)) + 0)].name;
    let user2 = users[ (Math.floor(Math.random() * (count.count - 0)) + 0)].name;
    let user3 = users[ (Math.floor(Math.random() * (count.count - 0)) + 0)].name;
    while ( user1 == user2){
      user2 = users[ (Math.floor(Math.random() * (count.count - 0)) + 0)].name;
    }
    while (user3 == user1 || user3 == user2){
      user3 = users[ (Math.floor(Math.random() * (count.count - 0)) + 0)].name;
    }
    return res.status(200).json("Список из имён 3 случайных пользователей: " + user1 + "  |||  " + user2 + "  |||  " + user3);
  }
  return res.status(200).json("Добро пожаловать!");
});

app.listen(PORT, () => {
  console.log("Сервер успешно запущен");
});
