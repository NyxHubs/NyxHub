declare global {
  interface Window {
    nyxWindow?: { minimize: () => void; maximize: () => void; close: () => void }
  }
}

export default function WindowControls() {
  return (
    <div className="window-controls">
      <button type="button" onClick={() => window.nyxWindow?.minimize()}>—</button>
      <button type="button" onClick={() => window.nyxWindow?.maximize()}>□</button>
      <button type="button" onClick={() => window.nyxWindow?.close()}>×</button>
    </div>
  )
}
