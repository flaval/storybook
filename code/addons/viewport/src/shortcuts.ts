import { type API } from 'storybook/internal/manager-api';

import { ADDON_ID } from './constants';
import { initialGlobals as defaultGlobals } from './preview';

const getCurrentViewportIndex = <Viewport>(viewportsKeys: Viewport[], current: Viewport): number =>
  viewportsKeys.indexOf(current);

const getNextViewport = <Viewport>(viewportsKeys: Viewport[], current: Viewport): Viewport => {
  const currentViewportIndex = getCurrentViewportIndex(viewportsKeys, current);
  return currentViewportIndex === viewportsKeys.length - 1
    ? viewportsKeys[0]
    : viewportsKeys[currentViewportIndex + 1];
};

const getPreviousViewport = <Viewport>(viewportsKeys: Viewport[], current: Viewport): Viewport => {
  const currentViewportIndex = getCurrentViewportIndex(viewportsKeys, current);
  return currentViewportIndex < 1
    ? viewportsKeys[viewportsKeys.length - 1]
    : viewportsKeys[currentViewportIndex - 1];
};

export const registerShortcuts = async <Viewport>(
  api: API,
  viewport: Viewport,
  updateGlobals: <Globals extends Record<string, unknown>>(newGlobals: Globals) => void,
  viewportsKeys: Viewport[]
) => {
  await api.setAddonShortcut(ADDON_ID, {
    label: 'Previous viewport',
    defaultShortcut: ['alt', 'shift', 'V'],
    actionName: 'previous',
    action: () => {
      updateGlobals({
        viewport: getPreviousViewport(viewportsKeys, viewport),
      });
    },
  });

  await api.setAddonShortcut(ADDON_ID, {
    label: 'Next viewport',
    defaultShortcut: ['alt', 'V'],
    actionName: 'next',
    action: () => {
      updateGlobals({
        viewport: getNextViewport(viewportsKeys, viewport),
      });
    },
  });

  await api.setAddonShortcut(ADDON_ID, {
    label: 'Reset viewport',
    defaultShortcut: ['alt', 'control', 'V'],
    actionName: 'reset',
    action: () => {
      updateGlobals(defaultGlobals);
    },
  });
};
