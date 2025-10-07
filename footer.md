<footer class="text-primary flex w-full max-w-4xl flex-col items-center justify-between gap-1 px-4 pt-8 pb-24 font-mono font-medium sm:pb-8 md:px-12 xl:px-8">
  <div class="flex flex-wrap items-center gap-4">
    <div class="flex items-center gap-4">
      <a class="hover:text-accent hover:underline" target="_blank" href="{{ site.author.figma }}">
        Figma
      </a>
    </div>
    <div class="flex items-center gap-4">
      <span class="text-neutral-400">·</span>
      <a class="hover:text-accent hover:underline" target="_blank" href="{{ site.author.github }}">
        Github
      </a>
    </div>
    <div class="flex items-center gap-4">
      <span class="text-neutral-400">·</span>
      <a class="hover:text-accent hover:underline" target="_blank" href="{{ site.author.linkedin }}">
        LinkedIn
      </a>
    </div>
    <div class="flex items-center gap-4">
      <span class="text-neutral-400">·</span>
      <a class="hover:text-accent hover:underline" target="_blank" href="mailto:{{ site.author.email }}">
        Email
      </a>
    </div>
  </div>
  <p class="text-secondary text-sm">Copyright © {% year %} {{ site.author.name }}</p>
</footer>
