import axios, { AxiosInstance } from "axios";

export default class HttpClient {
  private static instance: HttpClient;
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.REACT_APP_API_BASE_URL,
    });

    this.client.interceptors.response.use(
      (response) => {
        return response;
      },
      (error: Error) => {}
    );
  }

  static getInstance(): HttpClient {
    if (!HttpClient.instance) {
      HttpClient.instance = new HttpClient();
    }

    return HttpClient.instance;
  }

  getClient(): AxiosInstance {
    return this.client;
  }
}
