import type { WatchSessionPayload } from "../domain/watch-session";
import type { WatchSessionRepository } from "../ports/watch-session.repository";
import type { ApiResponse } from "@/infra/interface/response";

export class WatchSessionService {
  constructor(private readonly watchSessionRepository: WatchSessionRepository) {}

  async postWatchSession(payload: WatchSessionPayload): Promise<ApiResponse<void>> {
    return this.watchSessionRepository.postWatchSession(payload);
  }
}
