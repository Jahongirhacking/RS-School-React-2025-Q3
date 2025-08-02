import { describe, expect, it, vi } from 'vitest';
import { renderApp } from '../main';
import * as AppRoot from '../utils/appRoot';

describe('main.tsx', () => {
  it('calls createAppRoot and renders MainApp', () => {
    const renderMock = vi.fn();
    const createAppRootMock = vi
      .spyOn(AppRoot, 'createAppRoot')
      .mockReturnValue({ render: renderMock } as never);

    const rootEl = document.createElement('div');
    rootEl.id = 'root';
    document.body.appendChild(rootEl);

    renderApp();

    expect(createAppRootMock).toHaveBeenCalledWith(rootEl);
    expect(renderMock).toHaveBeenCalled();
  });
});
