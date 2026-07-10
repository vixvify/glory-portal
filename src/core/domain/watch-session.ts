export type CompletionType = "completed" | "abandoned" | "paused";

export interface SeekEvent {
  from: number;
  to: number;
}

export interface WatchSessionPayload {
  movieId: string;
  userId: string;
  source: "main_movie" | "trailer" | "bts";

  startSecond: number;
  endSecond: number;
  watchedSeconds: number;
  duration: number;
  percentWatched: number;
  completionType: CompletionType;

  pauseCount: number;
  replayCount: number;
  seekEvents: SeekEvent[];
}
