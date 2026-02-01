import { useAuth } from "@clerk/clerk-react";
import { useEffect } from "react";
import api from "../lib/axios";

function useAuthReq() {
  const { isSignedIn, getToken, isLoaded } = useAuth();

  // include the token to the request headers
  // 在每一個請求裡，希望在標頭附上 token
  // api 才能檢查 token，並判斷這個請求是否被驗證
  useEffect(() => {
    const interceptor = api.interceptors.request.use(async (config) => {
      if (isSignedIn) {
        const token = await getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }

      return config;
    });

    // remove
    return () => api.interceptors.request.eject(interceptor);
  }, [isSignedIn, getToken]);

  return { isSignedIn, isClerkLoaded: isLoaded };
}

export default useAuthReq;
