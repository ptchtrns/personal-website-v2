import { useEffect, useRef } from "preact/hooks";
import type { JSX } from "preact";
import {
  faBackwardStep,
  faForwardStep,
  faPause,
  faPlay,
  faVolumeHigh,
  faVolumeXmark,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button.tsx";
import { Slider } from "@/components/ui/slider.tsx";
import { FaIcon } from "@/components/icon.tsx";
import {
  closePlayer,
  currentIndex,
  currentTime,
  currentTrack,
  duration,
  isPlaying,
  playNext,
  playPrevious,
  queue,
  togglePlay,
  volume,
} from "@/lib/player-store.ts";

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds)) return "00:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

/**
 * Rendered outside the layout's `Partial`, so it (and its `<audio>` element)
 * survives Fresh's client-side page navigation instead of remounting.
 */
export default function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const track = currentTrack.value;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !track) return;
    if (!audio.src.endsWith(track.audioSrc)) {
      audio.src = track.audioSrc;
      audio.currentTime = 0;
    }
  }, [track?.id]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !track) return;
    if (isPlaying.value) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [isPlaying.value, track?.id]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume.value;
  }, [volume.value]);

  useEffect(() => {
    const main = document.getElementById("page-main");
    if (main) main.style.paddingBottom = track ? "5rem" : "";
  }, [track]);

  const handleSeek = (value: number) => {
    currentTime.value = value;
    if (audioRef.current) audioRef.current.currentTime = value;
  };

  const handleTimeUpdate: JSX.GenericEventHandler<HTMLAudioElement> = (
    event,
  ) => {
    currentTime.value = event.currentTarget.currentTime;
  };

  const handleLoadedMetadata: JSX.GenericEventHandler<HTMLAudioElement> = (
    event,
  ) => {
    duration.value = event.currentTarget.duration;
  };

  return (
    <>
      <audio
        ref={audioRef}
        class="hidden"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={playNext}
        onPlay={() => isPlaying.value = true}
        onPause={() => isPlaying.value = false}
      />

      {track && (
        <div class="fixed inset-x-0 bottom-0 z-30 border-t border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md">
          <div class="mx-auto 2xl:max-w-[1600px] flex flex-wrap md:flex-nowrap items-center gap-x-3 gap-y-2 sm:gap-x-4 px-4 sm:px-6 py-2.5 md:py-3">
            {track.coverSrc && (
              <img
                src={track.coverSrc}
                alt=""
                class="size-11 rounded-md object-cover shrink-0"
              />
            )}

            <div class="min-w-0 w-28 sm:w-48 shrink-0">
              <p class="text-sm font-medium truncate">{track.title}</p>
              <p class="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                {track.releaseTitle}
              </p>
            </div>

            <div class="flex items-center gap-1 shrink-0">
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label="Previous track"
                disabled={currentIndex.value === 0}
                onClick={playPrevious}
              >
                <FaIcon icon={faBackwardStep} />
              </Button>
              <Button
                type="button"
                variant="default"
                size="icon"
                aria-label={isPlaying.value ? "Pause" : "Play"}
                onClick={togglePlay}
              >
                <FaIcon icon={isPlaying.value ? faPause : faPlay} />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label="Next track"
                disabled={currentIndex.value >= queue.value.length - 1}
                onClick={playNext}
              >
                <FaIcon icon={faForwardStep} />
              </Button>
            </div>

            <div class="order-1 w-full md:order-none md:w-auto md:flex-1 flex items-center gap-2 min-w-0">
              <span class="text-xs text-zinc-500 dark:text-zinc-400 tabular-nums w-10 text-right">
                {formatTime(currentTime.value)}
              </span>
              <Slider
                value={currentTime.value}
                max={duration.value || 0}
                step={0.1}
                onValueChange={handleSeek}
                aria-label="Seek"
              />
              <span class="text-xs text-zinc-500 dark:text-zinc-400 tabular-nums w-10">
                {formatTime(duration.value)}
              </span>
            </div>

            <div class="hidden md:flex items-center gap-2 w-24 shrink-0">
              <FaIcon
                icon={volume.value === 0 ? faVolumeXmark : faVolumeHigh}
                class="text-zinc-500 dark:text-zinc-400 text-sm shrink-0"
              />
              <Slider
                value={volume.value}
                max={1}
                step={0.01}
                onValueChange={(value) => volume.value = value}
                aria-label="Volume"
              />
            </div>

            <Button
              type="button"
              variant="ghost-muted"
              size="icon-sm"
              aria-label="Close player"
              onClick={closePlayer}
            >
              <FaIcon icon={faXmark} />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
