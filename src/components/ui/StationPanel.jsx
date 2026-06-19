// Station ref registrar: invisible full-viewport div (for scroll-undocking logic)
// plus the visual nav bar is rendered externally by ZoomExperience.
export default function StationPanel({ index, registerRef }) {
  return (
    <div
      ref={(el) => registerRef(index, el)}
      style={{
        display: 'none',
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        willChange: 'transform, opacity',
      }}
    />
  )
}
