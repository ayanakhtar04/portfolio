import React, { useEffect, useRef } from 'react';
import { initWorkspaces } from '../motion/workspaces';

// One fixed stage, one scene per section (motion/workspaces.js). Scrolling
// plays a scene's beats in place, then the next scene surfaces where it was.
// With reduced motion the wrappers are plain blocks and the page scrolls
// as a normal document.
export const Workspaces = ({ scenes }) => {
  const rootRef = useRef(null);
  useEffect(() => initWorkspaces(rootRef.current), []);

  return (
    <div ref={rootRef} className="ws-root">
      {scenes.map((scene) => (
        <div key={scene.id} className="ws-scene" data-scene={scene.id} data-beats={scene.beats || 1}>
          <div className="ws-window">
            <div className="ws-body">
              <div className="ws-content">{scene.node}</div>
            </div>
          </div>
        </div>
      ))}
      <div className="ws-spacer" aria-hidden="true" />

      {/* Where you are: one mark per scene. */}
      <nav className="ws-pager" aria-label="Sections">
        {scenes.map((scene, i) => (
          <button key={scene.id} type="button" data-ws-dot={scene.id} className="ws-dot" aria-label={`Section ${i + 1}: ${scene.label}`}>
            <span className="ws-dot-label font-mono-code" aria-hidden="true">{String(i + 1).padStart(2, '0')} {scene.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};
