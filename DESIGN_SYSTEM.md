# CAISSA Design System

## Product thesis
CAISSA is a serious chess club and coaching studio: the board is the hero, analysis is precise, and the interface stays quiet until a player needs it. The signature is a restrained antique-gold move indicator and queen mark, used sparingly against an ink-and-graphite environment.

## Visual language
- Ink surfaces, graphite layers, warm ivory text, muted silver metadata, and antique gold for the primary action or selected chess state.
- Chessboard colors remain calm and distinct; piece silhouettes and legal-move markers must remain understandable without relying on color alone.
- Avoid gradients, neon accents, excessive glass, decorative stats, and generic dashboard cards.
- Use platform-native navigation and interaction patterns. Custom styling must not change familiar behavior.

## Semantic color tokens
| Role | Dark | Light |
|---|---|---|
| Background | #101318 | #F5F4F0 |
| Surface | #171C23 | #FFFFFF |
| Elevated surface | #202731 | #EAE9E4 |
| Primary text | #F4F1E9 | #171B20 |
| Secondary text | #AAB3BD | #59636E |
| Accent | #C5A46D | #765522 |
| Divider | #303945 | #D9D8D2 |
| Success | #72B58A | #287448 |
| Danger | #D97979 | #B33D3D |

Source of truth: `src/theme/tokens.ts`.

## Typography
- Platform system sans-serif for navigation, controls, body copy, and dense chess data.
- Restrained editorial serif only for occasional brand/editorial headings; never for clocks, ratings, coordinates, or move notation.
- Tabular numerals for clocks, ratings, scores, and evaluation values.
- Support system text scaling. Keep small labels comfortably readable.

## Layout and navigation
- Phone: Home, Play, Coaches, Review, Profile.
- Tablet: adapt navigation to a sidebar when width allows; preserve the same destinations.
- Desktop: collapsible sidebar, central work area, optional contextual inspector.
- Gameplay: board receives the largest visual priority; clocks, player identities, move list, and actions remain clearly grouped.
- Respect safe areas and responsive constraints. Adapt to width, orientation, and text scaling rather than fixed device dimensions.

## Interaction and accessibility
- Aim for touch targets of at least 44×44 pt on iOS.
- Provide pressed, focused, disabled, loading, and error states.
- Never communicate check, selection, advantage, or move legality through color alone.
- Respect system text scaling, reduced motion, increased contrast, VoiceOver/TalkBack labels, and desktop keyboard navigation.
- Use one prominent action per view wherever practical. Keep destructive actions distinct.
- Motion is short, purposeful, and nonessential to understanding.

## Signature moments
1. The chessboard and selected-square state are the defining visual surface.
2. Gold marks the current focus: selected move, primary action, or active coach — not every decorative element.
3. Post-game review uses a clear move timeline and readable evaluation changes instead of a wall of metrics.

## Platform boundaries
Apple HIG principles inform hierarchy, accessibility, and craft. iOS-specific components follow iOS conventions; Android and desktop retain their own expected navigation, back behavior, input affordances, and accessibility behavior.
