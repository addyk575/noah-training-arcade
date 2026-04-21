/* ============ EXERCISE IMAGES ============
   Maps each exercise id to a folder in yuhonas/free-exercise-db.
   Images are hosted on GitHub raw, so they need no bundling.
   Each folder has /0.jpg (start) and /1.jpg (finish). We use image 0.
*/
const IMG_BASE = "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/";

const EX_IMAGES = {
  // Day A
  bench:     "Barbell_Bench_Press_-_Medium_Grip",
  pullup:    "Pullups",
  ohp:       "Seated_Dumbbell_Press",
  dbrow:     "One-Arm_Dumbbell_Row",
  ezcurl:    "EZ-Bar_Curl",
  plank:     "Plank",

  // Day B
  "5105":    "Sprinter_Sit-Up", // no 5-10-5 in DB; use sprint-related alt
  lshuffle:  "Jumping_Jacks",   // closest agility substitute
  goblet:    "Goblet_Squat",
  rdl:       "Romanian_Deadlift",
  wlunge:    "Dumbbell_Walking_Lunge",
  calf:      "Standing_Dumbbell_Calf_Raise",

  // Day C
  slam:      "Medicine_Ball_Chest_Pass",
  incline:   "Incline_Dumbbell_Press",
  trxrow:    "Body_Tightening_Exercise", // trx inverted row not in DB; approximate
  lraise:    "Side_Lateral_Raise",
  pushup:    "Pushups",
  farmer:    "Farmers_Walk",

  // Day D
  jumpsq:      "Jump_Squat",
  broadjump:   "Standing_Long_Jump",
  skater:      "Skating",
  frontsq:     "Clean_from_Blocks",  // front squat missing; closest front-loaded
  slrdl:       "Single_Leg_Push-off",
  bss:         "Dumbbell_Lunges",
  rowerg:      "Rowing_Stationary",
};

// Fallback images if a folder doesn't resolve — use a muscle-group generic.
const EX_IMG_FALLBACKS = {
  bench:     "Dumbbell_Bench_Press",
  pullup:    "Chin-Up",
  ohp:       "Dumbbell_Shoulder_Press",
  dbrow:     "Bent_Over_Two-Dumbbell_Row",
  ezcurl:    "Dumbbell_Bicep_Curl",
  plank:     "Plank_with_Feet_Elevated",
  goblet:    "Dumbbell_Squat",
  rdl:       "Stiff-Legged_Barbell_Deadlift",
  wlunge:    "Dumbbell_Lunges",
  calf:      "Standing_Barbell_Calf_Raise",
  slam:      "Medicine_Ball_Full_Twist",
  incline:   "Incline_Dumbbell_Bench_With_Palms_Facing_In",
  trxrow:    "Inverted_Row",
  lraise:    "Dumbbell_Raise",
  pushup:    "Pushups_-_Close_Triceps_Position",
  farmer:    "Dumbbell_Shrug",
  jumpsq:    "Jump_Squat",
  broadjump: "Double_Leg_Butt_Kick",
  skater:    "Lateral_Bound",
  frontsq:   "Dumbbell_Squat",
  slrdl:     "One-Legged_Cable_Kickback",
  bss:       "Bulgarian_Split_Squat",
  rowerg:    "Rowing_Machine",
  "5105":    "Sprinter_Sit-Up",
  lshuffle:  "Side_Lunge",
};

function exImgUrl(id) {
  const folder = EX_IMAGES[id];
  if (!folder) return null;
  return `${IMG_BASE}${folder}/0.jpg`;
}
function exImgUrlFallback(id) {
  const folder = EX_IMG_FALLBACKS[id];
  if (!folder) return null;
  return `${IMG_BASE}${folder}/0.jpg`;
}

// Renders an <img> with fallback + SVG icon as last resort.
function exImg(id, sizeClass = 'ex-img') {
  const primary = exImgUrl(id);
  const fallback = exImgUrlFallback(id);
  const iconSvg = typeof exIcon === 'function' ? exIcon(id) : '';
  if (!primary) {
    return `<div class="${sizeClass} ex-img-placeholder">${iconSvg}</div>`;
  }
  // data-fallback lets us swap on error
  return `<div class="${sizeClass}">
    <img src="${primary}"
         data-fb="${fallback || ''}"
         onerror="exImgError(this)"
         alt="" loading="lazy" decoding="async">
    <div class="ex-img-icon" aria-hidden="true" style="display:none">${iconSvg}</div>
  </div>`;
}

function exImgError(img) {
  const fb = img.dataset.fb;
  if (fb && img.src !== fb) {
    img.dataset.fb = ''; // no more retries
    img.src = fb;
    return;
  }
  // Final fallback: hide img, show icon
  img.style.display = 'none';
  const icon = img.parentElement.querySelector('.ex-img-icon');
  if (icon) icon.style.display = 'grid';
}
