import axios from "axios";

const axiosClient = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ,
});

const strapiApiToken = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
const apiBase =  process.env.NEXT_PUBLIC_API_URL!;
const assetBase = apiBase.replace(/\/api\/?$/, "");

const toAbsoluteUrl = (url?: string) =>
  url ? (url.startsWith("http") ? url : `${assetBase}${url}`) : undefined;

const normalizeProduct = (item: any) => {
  const product = item?.attributes ?? item;

  const rawImages = product?.images?.data ?? product?.images ?? [];
  const images = rawImages.map((img: any) => {
    const attrs = img?.attributes ?? img;
    return { ...attrs, id: img?.id ?? attrs?.id, url: toAbsoluteUrl(attrs?.url) };
  });

  const rawCategories = product?.categories?.data ?? product?.categories ?? [];
  const categories = rawCategories.map((cat: any) => {
    const attrs = cat?.attributes ?? cat;
    return { ...attrs, id: cat?.id ?? attrs?.id };
  });

  return {
    ...product,
    id: item?.id ?? product?.id,
    images,
    categories,
  };
};

const apiFetch = async (path: string, options: RequestInit = {}) => {
  const resp = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });

  const data = await resp.json().catch(() => ({}));

  if (!resp.ok) {
    const errorPayload = data?.error ?? resp.statusText ?? "Request failed.";
    const errorMessage =
      typeof errorPayload === "string"
        ? errorPayload
        : errorPayload && typeof errorPayload === "object"
        ? JSON.stringify(errorPayload)
        : String(errorPayload);

    throw new Error(errorMessage);
  }

  return data;
};


// Add request interceptor
axiosClient.interceptors.request.use(
  (config) => {
    const isPublicRequest = (config as any)?.meta?.public === true;
    const authToken = isPublicRequest ? undefined : strapiApiToken;

    if (authToken) {
      config.headers = {
        ...(config.headers as any),
        Authorization: `Bearer ${authToken}`,
      };
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

const getCategory = () => axiosClient.get("/categories", { meta: { public: true } } as any);

const getSliders = () =>
  axiosClient.get("/sliders?populate=*").then((resp) => resp.data.data);

const getCategoryList = () =>
  axiosClient
    .get("/categories?populate=*", { meta: { public: true } } as any)
    .then((resp) => resp.data.data);

const getCategoryListByNames = (names: string[]) => {
  if (!Array.isArray(names) || names.length === 0) {
    return Promise.resolve([]);
  }

  const params = new URLSearchParams();
  names.forEach((name, index) => {
    params.append(`filters[name][$in][${index}]`, name);
  });
  params.append("populate", "*");

  return axiosClient
    .get(`/categories?${params.toString()}`, { meta: { public: true } } as any)
    .then((resp) => {
      return resp.data.data;
    })
    .catch((err) => {
      console.error(
        "[GlobalApi] getCategoryListByNames error:",
        err.message,
        err.response?.status,
        err.response?.data
      );
      throw err;
    });
};

const getAllProducts = () =>
  axiosClient
    .get("/products?populate=*")
    .then((resp) => {
      return resp.data.data.map(normalizeProduct);
    })
    .catch((err) => {
      console.error(
        "[GlobalApi] getAllProducts error:",
        err.message,
        err.response?.status,
        err.response?.data,
        err.config?.url
      );
      throw err;
    });

const getProductByCategory = (category: string) =>
  axiosClient
    .get(
      "/products?filters[categories][name][$in]=" +
        encodeURIComponent(category) +
        "&populate=*",
      { meta: { public: true } } as any
    )
    .then((resp) => {
      return resp.data.data.map(normalizeProduct);
    })
    .catch((err) => {
      console.error(
        "[GlobalApi] getProductByCategory error:",
        err.message,
        err.response?.status,
        err.cause,
        err.response?.data,
        err.config?.url
      );
      throw err;
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

const checkUserExistsByEmail = async (email: string) => {
  const resp = await axiosClient.get(
    `/users?filters[email][$eq]=${encodeURIComponent(email)}&pagination[limit]=1`
  );

  // Strapi /users typically returns an array.
  return Array.isArray(resp.data) && resp.data.length > 0;
};

const addToCart = (data: any) =>
  apiFetch("/api/cart", {
    method: "POST",
    body: JSON.stringify({ data }),
  });

const getUserCartItems = () =>
  apiFetch("/api/cart").then((resp) => {
    const payload = resp?.data ?? resp;
    

    const resolveArray = (value: any) => {
      if (Array.isArray(value)) {
        return value;
      }
      if (value?.data && Array.isArray(value.data)) {
        return value.data;
      }
      return [];
    };

    const rawItems = resolveArray(payload?.data ?? payload);

    const cartItemList = rawItems
      .map((item: any) => {
        const cartAttributes = item?.attributes ?? item;
        const products = resolveArray(item?.products ?? cartAttributes?.products);
        const productEntry = products[0];
        const productAttributes = productEntry?.attributes ?? productEntry;
        if (!productAttributes) {
          return null;
        }

        const images = resolveArray(productAttributes?.images);
        const firstImage = images[0];
        const imageAttributes = firstImage?.attributes ?? firstImage;
        const imageUrl = toAbsoluteUrl(imageAttributes?.url);

        if (!imageUrl) {
          return null;
        }

        return {
          id: item?.id ?? cartAttributes?.id,
          documentId: cartAttributes?.documentId ?? item?.id,
          name: productAttributes?.name,
          amount: cartAttributes?.amount,
          initialPrice: productAttributes?.mrp,
          price: productAttributes?.sellingPrice,
          quantity: cartAttributes?.quantity,
          image: imageUrl,
          product: productEntry?.id ?? productAttributes?.id,
        };
      })
      .filter(Boolean);

    return cartItemList;
  });

// Also add methods for cart management
const deleteCartItem = (documentId: string) =>
  apiFetch(`/api/cart/item/${documentId}`, {
    method: "DELETE",
  });

const clearUserCart = () => apiFetch("/api/cart/clear", { method: "POST" });

const createContactForm = (data: any) =>
  axiosClient.post("/contact-forms", { data });

const createOrder = (data: any) =>
  apiFetch("/api/orders", {
    method: "POST",
    body: JSON.stringify(data),
  });

const getOrdersByUserId = () =>
  apiFetch("/api/orders").then((resp) => resp?.data ?? resp ?? []);

const forgotPassword = (email: string) =>
  axiosClient.post("/auth/forgot-password", {
    email,
  });
  
const resetPassword = (
  code: string,
  password: string,
  passwordConfirmation: string
) =>
  axiosClient.post("/auth/reset-password", {
    code,
    password,
    passwordConfirmation,
  });

export default {
  getCategory,
  getSliders,
  getCategoryList,
  getCategoryListByNames,
  getAllProducts,
  getProductByCategory,
  registerUser,
  signIn,
  checkUserExistsByEmail,
  addToCart,
  getUserCartItems,
  deleteCartItem,
  createContactForm,
  createOrder,
  clearUserCart,
  getOrdersByUserId,
  forgotPassword,
  resetPassword,
};
