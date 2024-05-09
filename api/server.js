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
app.use(cors({ credentials: true, origin: process.env.CLIENT_URL }));

app.use(
  Fingerprint({
    parameters: [Fingerprint.useragent, Fingerprint.acceptHeaders],
  })
);

app.use("/auth", AuthRootRouter);

app.get("/resource/protected", TokenService.checkAccess, async (_, res) => {
  if (users_role == 2){
    const users = await UserRepository.getUsers();
    const count = await UserRepository.getUserCount();
    return res.status(200).json("Пользователь в базе данных: " + users[ (Math.floor(Math.random() * (count.count - 0)) + 0)].name);
  }
  return res.status(200).json("Добро пожаловать!");
});

app.listen(PORT, () => {
  console.log("Сервер успешно запущен");
});
