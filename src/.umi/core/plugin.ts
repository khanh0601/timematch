// @ts-nocheck
import { Plugin } from '/home/miichi/Desktop/PROJECTS/Smoothly/smoothly/node_modules/@umijs/preset-built-in/node_modules/@umijs/runtime';

const plugin = new Plugin({
  validKeys: ['modifyClientRenderOpts','patchRoutes','rootContainer','render','onRouteChange','dva','getInitialState','initialStateConfig','locale','request',],
});

export { plugin };
