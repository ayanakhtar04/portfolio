import React, { useEffect, useState } from 'react';
import { WS_ENABLED, onSceneProgress } from '../motion/workspaces';
import { scrollToElement } from '../motion/smoothScroll';

// A deck of cards played in place by scroll: the stage's --beat moves through
// the cards, the front one lifts away and the next rises to take its place
// (all in CSS, from --beat). An index beside it shows where you are and jumps
// to any card. Without the stage (reduced motion) it is a plain list.
//
// items: [{ key, label, meta, node }]
export const Deck = ({ sceneId, items, indexLabel, renderIndex }) => {
  const [active, setActive] = useState(0);
  useEffect(() => {
    if (!WS_ENABLED) return undefined;
    return onSceneProgress(sceneId, (p, beat) => setActive(Math.round(beat)));
  }, [sceneId]);

  const n = items.length;
  return (
    <div className="deck" style={{ '--n': n }}>
      <div className="deck-side">
        <div className="deck-counter font-mono-code" aria-hidden="true">
          <span className="accent-text">{String(active + 1).padStart(2, '0')}</span>
          <span> / {String(n).padStart(2, '0')}</span>
          <span className="deck-counter-label">{indexLabel}</span>
        </div>
        <ol className="deck-index" aria-label={indexLabel}>
          {items.map((item, i) => (
            <li key={item.key}>
              <button
                type="button"
                className="deck-index-item"
                data-beat-index={i}
                aria-current={i === active ? 'true' : undefined}
                onClick={(e) => scrollToElement(e.currentTarget)}
              >
                {renderIndex ? renderIndex(item, i, i === active) : (
                  <>
                    <span className="deck-index-num font-mono-code">{String(i + 1).padStart(2, '0')}</span>
                    <span className="deck-index-text">{item.label}</span>
                  </>
                )}
              </button>
            </li>
          ))}
        </ol>
        <div className="deck-track" aria-hidden="true"><span className="deck-track-fill" /></div>
      </div>

      <div className="deck-stage">
        {items.map((item, i) => (
          <div
            key={item.key}
            className={`deck-card ${i === active ? 'is-front' : ''}`}
            style={{ '--i': i }}
            data-beat-index={i}
            // Cards behind the front one can't be focused; the index reaches them.
            inert={WS_ENABLED && i !== active ? '' : undefined}
          >
            {item.node}
            <span className="deck-dim" aria-hidden="true" />
          </div>
        ))}
      </div>
    </div>
  );
};
