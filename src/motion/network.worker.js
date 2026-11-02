// Runs the network background on an OffscreenCanvas, off the main thread,
// so scrolling and the page's own animations never wait on canvas drawing.
import { createNetwork } from './networkEngine';

let net = null;

self.onmessage = ({ data }) => {
  switch (data.type) {
    case 'init':
      net = createNetwork(data.canvas, { reduced: data.reduced });
      net.setColors(data.colors);
      net.resize(data.width, data.height, data.dpr);
      net.start();
      break;
    case 'resize': net?.resize(data.width, data.height, data.dpr); break;
    case 'burst': net?.burst(data.x, data.y); break;
    case 'pointer': net?.setPointer(data.x, data.y, data.active); break;
    case 'colors': net?.setColors(data.colors); break;
    case 'visible': if (data.visible) net?.start(); else net?.stop(); break;
    default: break;
  }
};
