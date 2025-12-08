<template>
  <div class="grid lg:grid-cols-2 gap-8 items-center">
    <div class="space-y-4">
      <div
        class="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs
               bg-primary-500/10 text-primary-600 dark:text-primary-300"
      >
        <UIcon name="i-heroicons-sparkles" />
        Your learning space
      </div>

      <h1 class="text-3xl sm:text-4xl font-semibold tracking-tight">
        eUčilnica+
      </h1>

      <p class="text-sm sm:text-base opacity-80">
        A simple place for lecture videos, notes, and collaboration.
        Everything you need for a smoother study flow.
      </p>

      <p class="text-sm opacity-70">
        Open <span class="font-medium">Courses</span> from the menu to get started.
      </p>
    </div>

    <UCard class="relative overflow-hidden">
      <div class="space-y-3">
        <div class="flex items-center gap-2">
          <div class="h-8 w-8 rounded-lg bg-primary-500/10 flex items-center justify-center">
            <UIcon name="i-heroicons-academic-cap" class="text-primary-500" />
          </div>
          <div class="font-semibold">What you can do</div>
        </div>

        <ul class="text-sm space-y-2 opacity-80">
          <li class="flex gap-2">
            <UIcon name="i-heroicons-check-circle" />
            Watch lecture recordings in one place.
          </li>
          <li class="flex gap-2">
            <UIcon name="i-heroicons-check-circle" />
            Create personal notes while you study.
          </li>
          <li class="flex gap-2">
            <UIcon name="i-heroicons-check-circle" />
            Search content across lectures and notes.
          </li>
          <li class="flex gap-2">
            <UIcon name="i-heroicons-check-circle" />
            Ask questions and discuss topics with others.
          </li>
          <li class="flex gap-2">
            <UIcon name="i-heroicons-check-circle" />
            Get AI-powered study help and summaries.
          </li>
        </ul>
      </div>
    </UCard>
  </div>
</template>
