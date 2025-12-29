import axios from "axios";
import { sign } from "crypto";
import { initialize } from "next/dist/server/lib/render-server";

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337/api",
});

// Register interceptors only when running in the browser (avoid server-side localStorage)
if (typeof window !== "undefined") {
  // Add request interceptor
  axiosClient.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("authToken");
      if (token) {
        // preserve existing headers and add Authorization
        config.headers = {
          ...(config.headers as any),
          Authorization: `Bearer ${token}`,
        };
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Add response interceptor
  axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem("authToken");
      }
      return Promise.reject(error);
    }
  );
}

const getCategory = () => axiosClient.get("/categories");

const getSliders = () =>
  axiosClient
    .get("/sliders?populate=*")
    .then((resp) => {
      return resp.data.data;
    })
    .catch((err) => {
      console.error(
        "[GlobalApi] getSliders error:",
        err.message,
        err.response?.status,
        err.response?.data
      );
      throw err;
    });

const getCategoryList = () =>
  axiosClient
    .get("/categories?populate=*")
    .then((resp) => {
      return resp.data.data;
    })
    .catch((err) => {
      console.error(
        "[GlobalApi] getCategoryList error:",
        err.message,
        err.response?.status,
        err.response?.data
      );
      throw err;
    });

const getAllProducts = () =>
  axiosClient.get("/products?populate=*").then((resp) => {
    return resp.data.data;
  });

const getProductByCategory = (category: string) =>
  axiosClient
    .get("/products?filters[categories][name][$in]=" + category + "&populate=*")
    .then((resp) => {
      return resp.data.data;
    });

const registerUser = (username: string, email: string, password: string) =>
  axiosClient.post("/auth/local/register", {
    username: username,
    email: email,
    password: password,
  });

const signIn = (email: string, password: string) =>
  axiosClient.post("/auth/local", {
    identifier: email,
    password: password,
  });
const addToCart = (data: any, jwt: string) =>
  axiosClient.post("/user-carts", data, {
    headers: {
      Authorization: "Bearer " + jwt,
    },
  });

const getUserCartItems = (userId: number, jwt: string) =>
  axiosClient
    .get(
      `/user-carts?filters[userId][$eq]=${userId}&populate[products][populate]=*`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    )
    .then((resp) => {
      const data = resp.data.data;
      console.log("getUserCartItems response data:", data);
      const cartItemList = data.map((item: any) => {
        // Defensive check to ensure there's a product and it has an image
        if (
          !item.products ||
          item.products.length === 0 ||
          !item.products[0].images ||
          item.products[0].images.length === 0
        ) {
          return null;
        }

        const product = item.products[0];

        return {
          id: item.id,
          documentId: item.documentId,
          name: product.name,
          amount: item.amount,
          initialPrice: product.mrp,
          price: product.sellingPrice,
          quantity: item.quantity,
          image: product.images[0].url,
          product: product.id,
        };
      });

      // Filter out any cart items that might be missing data
      return cartItemList.filter((item: null) => item !== null);
    });

// Also add methods for cart management
const deleteCartItem = (documentId: string, jwt: string) =>
  axiosClient.delete(`/user-carts/${documentId}`, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });

const createContactForm = (data: any) =>
  axiosClient.post("/contact-forms", { data });

const createOrder = (data: any, jwt: string) =>
  axiosClient.post("/orders", data, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });

export default {
  getCategory,
  getSliders,
  getCategoryList,
  getAllProducts,
  getProductByCategory,
  registerUser,
  signIn,
  addToCart,
  getUserCartItems,
  deleteCartItem,
  createContactForm,
  createOrder,
};
