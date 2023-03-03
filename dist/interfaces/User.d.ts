import mongoose from "mongoose"
import { Query } from "mysql2"
import User from "../models/user"
type saveSetting = "email" | "username" | "password"

export default interface UserInterface extends User {
  email: string
  password: string
  username: string
  user_id: number
  isAdmin: number
}
// static findById: (userId: string) => Promise;
// static findByEmail: (email: string) => Promise;
// static login: (email: string, password: string) => Promise;
