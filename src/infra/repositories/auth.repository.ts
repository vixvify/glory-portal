import { ApiResponse } from "../interface/response";
import httpClient from "@/lib/http";
import { AuthRepository } from "@/core/ports/auth.repository";
import { User, LoginUser } from "@/core/domain/user";

export class AuthRepositoryImpl implements AuthRepository {
  async register(user: FormData): Promise<ApiResponse<User>> {
    const response = await httpClient.post<User>("/auth/register", user, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  }
  async login(user: LoginUser): Promise<ApiResponse<User>> {
    const response = await httpClient.post<User>("/auth/login", user);
    return response;
  }
  async logout(): Promise<ApiResponse<void>> {
    const response = await httpClient.post<void>("/auth/logout");
    return response;
  }
  async getCurrentUser(): Promise<ApiResponse<User>> {
    const response = await httpClient.get<User>("/auth/me");
    return response;
  }
  async updateProfile(data: FormData): Promise<ApiResponse<User>> {
    const response = await httpClient.patch<User>("/auth/profile", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  }
}
