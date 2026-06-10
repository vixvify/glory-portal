import { ApiResponse } from "@/core/ports/response";
import { LoginUser, User } from "../domain/user";

export interface AuthRepository {
  register(user: FormData): Promise<ApiResponse<User>>;
  login(user: LoginUser): Promise<ApiResponse<User>>;
  logout(): Promise<ApiResponse<void>>;
  getCurrentUser(): Promise<ApiResponse<User>>;
}
