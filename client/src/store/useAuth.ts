import { useAuthStore } from "./authStore";
function useAuth() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const user = useAuthStore((state) => state.user);
  const clearUser = useAuthStore((state) => state.clearUser);
  const setIsAuthenticated = useAuthStore((state) => state.setIsAuthenticated);
  const setIsLoading = useAuthStore((state) => state.setIsLoading);
  const setUser = useAuthStore((state) => state.setUser);

  return {
    isAuthenticated,
    isLoading,
    setIsAuthenticated,
    setIsLoading,
    user,
    setUser,
    clearUser,
  };
}

export default useAuth;
