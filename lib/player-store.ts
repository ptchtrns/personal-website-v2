import { computed, signal } from "@preact/signals";

export interface PlayerTrack {
  id: number;
  title: string;
  audioSrc: string;
  releaseTitle: string;
  coverSrc: string | null;
}

/** Tracks of the release currently loaded into the player, in order. */
export const queue = signal<PlayerTrack[]>([]);
export const currentIndex = signal(0);
export const isPlaying = signal(false);
export const currentTime = signal(0);
export const duration = signal(0);
export const volume = signal(1);

export const currentTrack = computed<PlayerTrack | null>(
  () => queue.value[currentIndex.value] ?? null,
);

/** Loads a release's tracks and plays the given index, or toggles play/pause if it's already loaded. */
export function playTrack(tracks: PlayerTrack[], index: number) {
  const track = tracks[index];
  if (!track) return;

  if (currentTrack.value?.id === track.id) {
    isPlaying.value = !isPlaying.value;
    return;
  }

  queue.value = tracks;
  currentIndex.value = index;
  currentTime.value = 0;
  isPlaying.value = true;
}

export function togglePlay() {
  if (currentTrack.value) isPlaying.value = !isPlaying.value;
}

export function playNext() {
  if (currentIndex.value < queue.value.length - 1) {
    currentIndex.value += 1;
    currentTime.value = 0;
    isPlaying.value = true;
  } else {
    isPlaying.value = false;
  }
}

export function playPrevious() {
  if (currentIndex.value > 0) {
    currentIndex.value -= 1;
    currentTime.value = 0;
    isPlaying.value = true;
  }
}

export function closePlayer() {
  isPlaying.value = false;
  queue.value = [];
  currentIndex.value = 0;
}
