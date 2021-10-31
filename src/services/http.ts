import axios from "axios";
import { notification } from "antd";
const CancelToken = axios.CancelToken;

// const baseURI =
//   process.env.NODE_ENV === "production"
//     ? "http://localhost:9090"
//     : "http://localhost:9090";

class HttpService {
  public static getHeader(): any {
    return {
      "x-token": window.localStorage.getItem("token"),
      // "Content-Type": "application/x-www-form-urlencoded",
      "Access-Control-Allow-Origin": "*",
    };
  }

  /**
   * name
   */
  // public static getURL(): string {
  //   return baseURI;
  // }

  public static get(
    url: any,
    query: any = "",
    params: any = {},
    source: any = undefined
  ) {
    const xhr = axios({
      method: "GET",
      url: `/api/${url}?${query}`,
      params: params,
      headers: HttpService.getHeader(),
      cancelToken: source?.token || undefined,
    }).then((res) => res.data);

    return xhr;
  }
  public static getRequest(
    url: any,
    query: any = "",
    params: any = {},
    cancelable: boolean = false
  ) {
    const source = CancelToken.source();

    return HttpService.get(url, query, params, cancelable ? source : undefined);
  }

  public static post(url: any, obj: object) {
    return axios({
      url: `/api/${url}`,
      method: "post",
      data: obj,
      headers: HttpService.getHeader(),
    })
      .then((res) => res.data)
      .catch((err) => {
        if (
          err?.response?.data?.type === "Validation Error" &&
          err?.response?.data?.message?.details
        ) {
          err.response.data.message.details.forEach((item: any) => {
            notification.error({
              placement: "bottomLeft",
              message: "Validation Error",
              description: item.message,
            });
          });
        }
        return Promise.reject(err);
      });
  }
}

export default HttpService;
