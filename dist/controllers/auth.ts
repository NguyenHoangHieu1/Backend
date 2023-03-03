import User from "../models/user"
import UserInterface from "../interfaces/User"
import { RequestHandler } from "express"
import { hash, compare } from "bcryptjs"
import { validationResult } from "express-validator"
import jwt from "jsonwebtoken"
import nodemailer from "nodemailer"
import crypto from "crypto"
import Token from "../services/tokenDb"
import tokenInterface from "../interfaces/token"
import token from "../interfaces/token"
import UserDb from "../services/userDb"
import TokenDb from "../services/tokenDb"
import cartDb from "../services/cartDb"
import { Worker } from "worker_threads"

const userMail = "hoanghieufro@gmail.com"
const passMail = "faslrrtkbtxnjdtd"

const transport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: userMail,
    pass: passMail,
  },
})

export const postActivate: RequestHandler = async (req, res, next) => {
  const passCode = req.body.passCode
  const token = req.body.token
  try {
    const tokenList = (await TokenDb.findByToken(token)) as tokenInterface[]
    if (tokenList.length <= 0) {
      return res.status(404).json({ message: "No Token found" })
    }
    const aToken = tokenList[0]
    if (aToken.activateNumber.toString() === passCode.toString()) {
      await cartDb.create(aToken.userId)
      TokenDb.removeByToken(aToken.token)
      return res.status(200).json({ message: "Accept account successfully" })
    } else {
      return res.status(402).json({ message: "Wrong passcode" })
    }
  } catch (error: any) {
    if (!error.status) {
      error.status = 500
    }
    next(error)
  }
}

export const postChangePassword: RequestHandler = async (req, res, next) => {
  const password = req.body.password
  const token = req.body.token
  try {
    const tokenList = (await Token.findByToken(token)) as tokenInterface[]

    if (tokenList.length <= 0) {
      return res.status(404).json({ message: "Token not found" })
    }
    const tokenResult = tokenList[0]
    const userList = (await UserDb.findById(
      tokenResult.userId
    )) as UserInterface[]
    if (userList.length <= 0) {
      return res.status(404).json({ message: "Account not found" })
    }
    const userItem = userList[0]
    const aUser = new User(
      userItem.email,
      userItem.password,
      userItem.username,
      userItem.user_id
    )
    await Token.removeByToken(token)
    const newHashedPassword = await hash(password, 12)
    UserDb.saveOne(aUser.getUser_id, "password", newHashedPassword)
    return res.status(200).json({ message: "Change password successfully" })
  } catch (error: any) {
    if (error.status) error.status = 500
    next(error)
  }
}

export const postCheckAccount: RequestHandler = async (req, res, next) => {
  const token = req.body.token
  try {
    const tokenList = (await Token.findByToken(token)) as token[]
    if (tokenList.length <= 0) {
      return res.status(404).json({ message: "Token not found" })
    }
    const tokenObj = tokenList[0]
    return res
      .status(200)
      .json({ message: "Account found", userId: tokenObj.userId })
  } catch (error: any) {
    if (!error.status) error.status = 500
    next(error)
  }
}
export const postForgotPassword: RequestHandler = async (req, res, next) => {
  const email = req.body.email
  try {
    const userList = (await UserDb.findByEmail(email)) as UserInterface[]
    if (userList.length <= 0) {
      return res.status(404).json({ message: "Account not found" })
    }
    const userItem = userList[0]
    const aUser = new User(
      userItem.email,
      userItem.password,
      userItem.username,
      userItem.user_id
    )
    crypto.randomBytes(32, async (err, Buffer) => {
      if (err) {
        next(err)
      }
      const token = Buffer.toString("hex")
      await Token.create(token, aUser.getUser_id)
      transport.sendMail({
        from: userMail,
        to: aUser.getEmail,
        subject: "Forgot your password already ? ",
        html: `
        <h1>Click this <a href="http://localhost:3000/change-password/${token}">link</a> to reset the password </h1> 
        `,
      })
      return res.status(200).json({ message: "I Have Sent you an email" })
    })
  } catch (error: any) {
    if (error.status) error.status = 500
    next(error)
  }
}

export const postLogin: RequestHandler = async (req, res, next) => {
  const email = req.body.email
  const password = req.body.password
  try {
    const userList = (await UserDb.findByEmail(email)) as UserInterface[]
    if (userList.length <= 0) {
      return res.status(404).json({ message: "Account not found" })
    }
    const userItem = userList[0]

    const aUser = new User(
      userItem.email,
      userItem.password,
      userItem.username,
      userItem.user_id
    )

    const tokenList = (await Token.findByUserId(
      aUser.getUser_id
    )) as tokenInterface[]
    if (tokenList.length > 0) {
      return res
        .status(404)
        .json({ message: "You haven't activated the account" })
    }

    const doMatch = await compare(password, aUser.getPassword)
    if (!doMatch) {
      return res.status(404).json({ message: "Wrong password" })
    }
    const worker = new Worker("../Backend/src/workers/token.js", {
      workerData: {
        email: email,
        userId: aUser.getUser_id,
      },
    })
    worker.on("message", (data) => {
      return res.status(200).json({
        message: "Login succesfully",
        token: data,
        userId: aUser.getUser_id,
        userIsAdmin: userItem.isAdmin,
      })
    })
    worker.on("error", (error: any) => {
      throw new Error(error)
    })
  } catch (error: any) {
    if (!error.status) {
      error.status = 500
    }
    next(error)
  }
}
export const postSignup: RequestHandler = async (req, res, next) => {
  const email = req.body.email
  const username = req.body.username
  const password = req.body.password
  const validationCheck = validationResult(req)
  if (!validationCheck.isEmpty()) {
    return res.status(404).json({ message: validationCheck.array()[0].msg })
  }
  const hashedPassword = await hash(password, 12)

  try {
    const UserList = (await UserDb.findByEmail(email)) as UserInterface[]

    if (UserList.length > 0) {
      return res.status(404).json({ message: "Account has already exist" })
    }
    crypto.randomBytes(32, async (err, buffer) => {
      if (err) {
        next(err)
      }

      const token = buffer.toString("hex")
      await UserDb.create(email, username, hashedPassword)
      const userList = (await UserDb.findByEmail(email)) as Array<UserInterface>
      if (userList.length <= 0) {
        return res.status(404).json({ message: "The Server went down" })
      }
      const userItem = userList[0]
      const aUser = new User(
        userItem.email,
        userItem.password,
        userItem.username,
        userItem.user_id
      )
      let code = Math.round(Math.random() * 10000)
      if (code < 1000) {
        code += 1000
      }
      await Token.create(token, aUser.getUser_id, code)
      transport.sendMail({
        from: userMail,
        to: aUser.getEmail,
        subject: "Register successfully",
        html: `
        <h1>Thank you for using our services</h1> 
        <p>Your registration code is : ${code}</p>
        <a href='http://localhost:3000/activate-password/${token}'>Click this link to be able to accept</a>
      `,
      })
      return res
        .status(202)
        .json({ message: "Created an account successfully" })
    })
  } catch (error: any) {
    if (error.status) {
      error.status = 500
    }
    next(error)
  }
}
