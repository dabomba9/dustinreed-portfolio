Drop images and GIFs here, then point at them from the page files.

In a case study page, find a <Figure /> and add a src:

  <Figure
    src="/media/curbnturf-onboarding.png"
    alt="The host onboarding flow, start to published listing"
    caption="Optional caption."
  />

For a homepage card image, edit src/content/projects.ts and set
`image: "/media/curbnturf-card.gif"` on the project.

Files already on your Desktop that belong here:
  cnt-clip-light.gif        -> CurbNTurf card thumbnail
  stickyflow-2x-light.gif   -> if you add StickyFlow imagery
  curbnturf-thumb.gif       -> the Vox-style motion graphic
