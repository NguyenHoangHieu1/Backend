"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class User {
    constructor(email, password, username, user_id) {
        this.email = email;
        this.password = password;
        this.username = username;
        this.user_id = user_id;
    }
    get getEmail() {
        return this.email;
    }
    get getPassword() {
        return this.password;
    }
    get getUsername() {
        return this.username;
    }
    get getUser_id() {
        return this.user_id;
    }
}
exports.default = User;
