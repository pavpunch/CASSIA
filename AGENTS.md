# CAISSA — Agent Instructions

## Product
CAISSA is a cross-platform chess app. Keep the chessboard central, the interface restrained, and coaching useful without interrupting fair ranked play.

## Design authority
- Follow `DESIGN_SYSTEM.md` and tokens in `src/theme/tokens.ts`.
- Use the Apple Design Skill as a review framework: https://github.com/dickwu/apple-design-skill
- Before design reviews or substantial UI changes, read relevant pages from that skill's `SKILL.md` index and cite the actual guideline file and heading in review notes. Do not copy Apple's guideline text wholesale into this repository.
- Preserve familiar platform behavior. Apple HIG informs craft and accessibility; it does not mean imitating iOS UI on Android or desktop.

## Quality bar
- Responsive layouts, safe areas, and system text scaling.
- Touch targets of at least 44×44 pt on iOS where practical.
- Semantic labels, screen-reader support, visible keyboard focus, and reduced-motion support.
- No color-only state communication.
- One clear primary action per screen; avoid decorative cards, gratuitous gradients, and unnecessary glass effects.
- Use tabular numerals for chess clocks, ratings, and evaluations.
- No paid AI dependencies. Coach personalities are app logic; engine analysis and opponents use a chess engine.

## Engineering
- Prefer small, typed, reusable components.
- Keep design tokens centralized; do not scatter raw color values through screens.
- Do not claim a feature is implemented unless it is present and tested.
- Run available checks before committing changes and report checks that could not be run.
