<template>
  <div class="space-y-2">
    <div class="aspect-video w-full overflow-hidden rounded-xl bg-black/90">
      <video
        ref="videoEl"
        class="h-full w-full"
        controls
        playsinline
      />
    </div>

    <div class="text-xs opacity-60 break-all">
      Source: {{ src }}
    </div>
  </div>
</template>

<script setup lang="ts">
import Hls from 'hls.js'

const props = defineProps<{
  src: string
}>()

const videoEl = ref<HTMLVideoElement | null>(null)
let hls: Hls | null = null

function isHls(url: string) {
  return url.toLowerCase().includes('.m3u8')
}

onMounted(() => {
  const el = videoEl.value
  if (!el) return

  // Native playback (mp4 or Safari HLS)
  if (!isHls(props.src) || el.canPlayType('application/vnd.apple.mpegurl')) {
    el.src = props.src
    return
  }

  // HLS.js for most browsers
  if (Hls.isSupported()) {
    hls = new Hls()
    hls.loadSource(props.src)
    hls.attachMedia(el)
  } else {
    // fallback
    el.src = props.src
  }
})

onBeforeUnmount(() => {
  hls?.destroy()
  hls = null
})
</script>
