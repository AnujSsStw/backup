import axios from "axios";
// import crypto from "crypto";
import { AuthProvider } from "react-admin";
import HttpClient from "./http";
const httpClient = HttpClient.getInstance().getClient();

interface Login {
  email: string;
  password: string;
}

export const authProvider: AuthProvider = {
  // authentication
  login: async ({ username, password }) => {
    console.log("login", username, password);
    // const hashedPassword = crypto
    //   .createHash("md5")
    //   .update(password)
    //   .digest("hex");

    const response = await httpClient.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/auth/login`,
      {
        auth: {
          username: username.toLowerCase(),
          password: password,
        },
      }
    );
    console.log(response);

    if (response) {
      HttpClient.getInstance().getClient().defaults.headers.common[
        "Authorization"
      ] = `Bearer ${response.data.token}`;
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${response.data.token}`;

      return response.data;
    } else {
      throw new Error("Invalid credentials");
    }
  },
  checkError: (error) => {
    const status = error.status;
    if (status === 401 || status === 403) {
      localStorage.removeItem("auth");
      return Promise.reject();
    }
    // other error code (404, 500, etc): no need to log out
    return Promise.resolve();
  },
  checkAuth: () =>
    localStorage.getItem("auth")
      ? Promise.resolve()
      : Promise.reject({ message: "login required" }),
  logout: () => {
    localStorage.removeItem("auth");
    return Promise.resolve();
  },
  // getIdentity: () => {
  //   try {
  //     const { id } = JSON.parse(localStorage.getItem("auth"));
  //     return Promise.resolve({ id });
  //   } catch (error) {
  //     return Promise.reject(error);
  //   }
  // },
  getPermissions: (params) => Promise.resolve(),
};
