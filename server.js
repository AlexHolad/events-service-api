// getting-started.js
import "dotenv/config";
import mongoose from "mongoose";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import bcrypt from "bcrypt";

// AUTHENTICATION
import { verifyJWT } from "./middleware/verifyJWT.js";

// WELCOME HANDLER
import { welcome } from "./controllers/welcome.controller.js";

// USER HANDLERS
import { handleRegister } from "./controllers/register.controller.js";
import { handleSignIn } from "./controllers/signin.controller.js";
import { handleSignOut } from "./controllers/signout.controller.js";
import { refreshToken } from "./controllers/Auth/auth.controller.js";

// SOCIAL GROUPS POSTING HANDLERS
import { telegramPost } from "./controllers/telegram.controller.js";

// EVENTS HANDLERS
import {
  getEvents,
  getUserEvents,
  getEvent,
  addEvent,
  updateEvent,
  deleteEvent,
} from "./controllers/events.controller.js";

//  DATABSE INITIALIZATION
main()
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log("Something wrong with database connection", err));

async function main() {
  await mongoose.connect(process.env.DB_CONNECTION);
}

//  SERVER INITIALIZATION
const app = express();
const PORT = process.env.PORT || 5000;

// MIDDLEWARE
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.CLIENT_URL
        : "http://localhost:5173",
  })
);

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.get("/", welcome());

// EVENT ROUTES
app.get("/events", getEvents());
app.get("/event", getEvent());

// REGISTERED USERS
app.get("/user/events", verifyJWT, getUserEvents());
app.post("/events", verifyJWT, addEvent());
app.put("/events", verifyJWT, updateEvent());
app.delete("/events", verifyJWT, deleteEvent());

// USER ROUTES
app.post("/register", handleRegister(bcrypt));
app.post("/signin", handleSignIn(bcrypt));
app.get("/refresh", refreshToken());
app.post("/signout", handleSignOut());

// TELEGRAM
app.post("/post/telegram", verifyJWT, telegramPost());

app.listen(PORT, () => {
  console.log(`app is listening on port ${PORT}`);
});
