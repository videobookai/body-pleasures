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
    .get("/categories?populate=*", { meta: { public: true } } as any)
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

  const clearUserCart = async (userId: number, jwt: string) => {
  try {
    // First, get all cart items for the user
    const resp = await getUserCartItems(userId, jwt);
    
    // Delete each cart item
    const deletePromises = resp.map((item: any) => 
      deleteCartItem(item.documentId, jwt)
    );
    
    // Wait for all deletions to complete
    await Promise.all(deletePromises);
    
    return { success: true };
  } catch (error) {
    console.error("Error clearing cart:", error);
    throw error;
  }
};

const createContactForm = (data: any) =>
  axiosClient.post("/contact-forms", { data });

const createOrder = (data: any, jwt: string) =>
  axiosClient.post("/orders", data, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });

const getOrdersByUserId = (userId: number, jwt: string) =>
  axiosClient
    .get(
      `/orders?filters[userId][$eq]=${userId}&populate[order][populate][product][populate]=images`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    )
    .then((resp) => {
      return resp.data.data;
    });

    const forgotPassword = (email: string)=> axiosClient.post("/auth/forgot-password", {
      email
    })
    const resetPassword = (code: string, password: string, passwordConfirmation: string) => axiosClient.post("/auth/reset-password", {
      code,
      password,
      passwordConfirmation
    })
  

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
  resetPassword
};
