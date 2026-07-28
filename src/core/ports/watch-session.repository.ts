import type { WatchSessionPayload } from "../domain/watch-session";
import type { ApiResponse } from "@/infra/interface/response";

export interface WatchSessionRepository {
  postWatchSession(payload: WatchSessionPayload): Promise<ApiResponse<void>>;
}
