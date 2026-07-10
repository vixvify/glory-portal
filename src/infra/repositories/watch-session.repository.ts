import { httpClient } from "@/lib/http";
import type { WatchSessionPayload } from "@/core/domain/watch-session";
import type { WatchSessionRepository } from "@/core/ports/watch-session.repository";
import type { ApiResponse } from "@/infra/interface/response";

export class WatchSessionRepositoryImpl implements WatchSessionRepository {
  async postWatchSession(payload: WatchSessionPayload): Promise<ApiResponse<void>> {
    const response = await httpClient.post<void>("/watch-sessions", payload);
    return response;
  }
}
