import db from "../database/database";
import UserInterface from "../interfaces/User";
import executeSqlDb from "../util/query";

export default class User {
  constructor(
    private email: string,
    private password: string,
    private username: string,
    private user_id: number
  ) {}
  public get getEmail(): string {
    return this.email;
  }
  public get getPassword(): string {
    return this.password;
  }
  public get getUsername(): string {
    return this.username;
  }
  public get getUser_id(): number {
    return this.user_id;
  }
}
