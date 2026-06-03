import { User, RegisterUser, LoginUser } from "../domain/user";
import { AuthRepository } from "../ports/auth.repository";
import { parseSchema } from "@/lib/validation";
import { registerUserSchema, loginUserSchema } from "../schema/auth";
import { toFormData } from "@/utils/form-data";

export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}
  async register(user: RegisterUser): Promise<User> {
    try {
      const validated = parseSchema(registerUserSchema, user);
      const formData = toFormData(validated);

      const response = await this.authRepository.register(formData);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    } catch (error) {
      console.error("Error in register:", error);
      throw error;
    }
  }
  async login(user: LoginUser): Promise<User> {
    try {
      const validated = parseSchema(loginUserSchema, user);
      const response = await this.authRepository.login(validated);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    } catch (error) {
      console.error("Error in login:", error);
      throw error;
    }
  }
  async logout(): Promise<void> {
    try {
      const response = await this.authRepository.logout();
      if (response.error) {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error("Error in logout:", error);
      throw error;
    }
  }
  async getCurrentUser(): Promise<User> {
    try {
      const response = await this.authRepository.getCurrentUser();
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    } catch (error) {
      console.error("Error in getCurrentUser:", error);
      throw error;
    }
  }
}
