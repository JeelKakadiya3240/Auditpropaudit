import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface AuthUser {
  id: string;
  email: string;
  fullName: string | null;
  role: string;
  emailVerified: boolean;
  phoneVerified: boolean;
}

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  phoneNumber?: string;
}

interface ApiError {
  error: string;
  requiresVerification?: boolean;
}

async function authRequest<T>(url: string, data?: unknown): Promise<T> {
  
  const response = await fetch(url, {
    method: "POST",
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });
  
  const result = await response.json();
  
  if (!response.ok) {
    const error = new Error(result.error || "Request failed") as Error & { data?: ApiError };
    error.data = result;
    throw error;
  }
  
  return result;
}

export function useAuth() {
  const queryClient = useQueryClient();

  const { data: user, isLoading, error } = useQuery<AuthUser | null>({
    queryKey: ["/api/auth/user"],
    queryFn: async () => {
      try {
        const response = await fetch("/api/auth/user", {
          credentials: "include",
        });
        if (response.status === 401) {
          return null;
        }
        if (!response.ok) {
          throw new Error("Failed to fetch user");
        }
        return response.json();
      } catch {
        return null;
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginData) => {
      return authRequest<{ success: boolean; user: AuthUser }>(`${import.meta.env.VITE_API_URL}/auth/login`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterData) => {
      return authRequest<{ success: boolean; message: string; userId: string }>(`${import.meta.env.VITE_API_URL}/auth/register`, data);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      return authRequest<{ success: boolean }>("/api/auth/logout");
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/auth/user"], null);
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    },
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: async (email: string) => {
      return authRequest<{ success: boolean; message: string }>("/api/auth/forgot-password", { email });
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async (data: { token: string; password: string }) => {
      return authRequest<{ success: boolean; message: string }>("/api/auth/reset-password", data);
    },
  });

  const verifyEmailMutation = useMutation({
    mutationFn: async (token: string) => {
      return authRequest<{ success: boolean; message: string }>("/api/auth/verify-email", { token });
    },
  });

  const resendVerificationMutation = useMutation({
    mutationFn: async (email: string) => {
      return authRequest<{ success: boolean; message: string }>("/api/auth/resend-verification", { email });
    },
  });

  const requestOTPMutation = useMutation({
    mutationFn: async (phoneNumber: string) => {
      return authRequest<{ success: boolean; message: string }>("/api/auth/otp/request", { phoneNumber });
    },
  });

  const verifyOTPMutation = useMutation({
    mutationFn: async (data: { phoneNumber: string; code: string }) => {
      return authRequest<{ success: boolean; isNewUser: boolean; user?: AuthUser }>("/api/auth/otp/verify", data);
    },
    onSuccess: (data) => {
      if (data.user) {
        queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      }
    },
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    error,
    login: loginMutation.mutateAsync,
    loginPending: loginMutation.isPending,
    loginError: loginMutation.error,
    register: registerMutation.mutateAsync,
    registerPending: registerMutation.isPending,
    registerError: registerMutation.error,
    logout: logoutMutation.mutateAsync,
    logoutPending: logoutMutation.isPending,
    forgotPassword: forgotPasswordMutation.mutateAsync,
    forgotPasswordPending: forgotPasswordMutation.isPending,
    resetPassword: resetPasswordMutation.mutateAsync,
    resetPasswordPending: resetPasswordMutation.isPending,
    verifyEmail: verifyEmailMutation.mutateAsync,
    verifyEmailPending: verifyEmailMutation.isPending,
    resendVerification: resendVerificationMutation.mutateAsync,
    resendVerificationPending: resendVerificationMutation.isPending,
    requestOTP: requestOTPMutation.mutateAsync,
    requestOTPPending: requestOTPMutation.isPending,
    verifyOTP: verifyOTPMutation.mutateAsync,
    verifyOTPPending: verifyOTPMutation.isPending,
  };
}
