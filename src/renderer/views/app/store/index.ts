import { observable, computed } from 'mobx';
import * as React from 'react';

import { TabsStore } from './tabs';
import { TabGroupsStore } from './tab-groups';
import { AddTabStore } from './add-tab';
import { ipcRenderer, remote } from 'electron';
import { HistoryStore } from './history';
import { FaviconsStore } from './favicons';
import { ExtensionsStore } from './extensions';
import { extname } from 'path';
import { BookmarksStore } from './bookmarks';
import { DownloadsStore } from './downloads';
import { lightTheme } from '~/renderer/constants/themes';
import { SettingsStore } from './settings';
import { extensionsRenderer } from 'electron-extensions';
import { FormFillStore } from './form-fill';
import { getCurrentWindow } from '../utils';

export class Store {
  public history = new HistoryStore();
  public bookmarks = new BookmarksStore();
  public settings = new SettingsStore(this);
  public favicons = new FaviconsStore();
  public addTab = new AddTabStore();
  public tabGroups = new TabGroupsStore();
  public tabs = new TabsStore();
  public extensions = new ExtensionsStore();
  public downloads = new DownloadsStore();
  public formFill = new FormFillStore();

  @observable
  public theme = lightTheme;

  @observable
  public isAlwaysOnTop = false;

  @observable
  public isFullscreen = false;

  @observable
  public isHTMLFullscreen = false;

  @observable
  public updateInfo = {
    available: false,
    version: '',
  };

  @observable
  public navigationState = {
    canGoBack: false,
    canGoForward: false,
  };

  @observable
  public inputText = '';

  @observable
  public inputFocused = false;

  public inputRef = React.createRef<HTMLInputElement>();

  @computed
  public get searchEngine() {
    return this.settings.object.searchEngines[
      this.settings.object.searchEngine
    ];
  }

  public canToggleMenu = false;

  public mouse = {
    x: 0,
    y: 0,
  };

  public windowId = getCurrentWindow().id;

  @observable
  public isIncognito = ipcRenderer.sendSync(`is-incognito-${this.windowId}`);

  public constructor() {
    ipcRenderer.on('update-navigation-state', (e, data) => {
      this.navigationState = data;
    });

    ipcRenderer.on('fullscreen', (e, fullscreen: boolean) => {
      this.isFullscreen = fullscreen;
    });

    ipcRenderer.on('html-fullscreen', (e, fullscreen: boolean) => {
      this.isHTMLFullscreen = fullscreen;
    });

    ipcRenderer.on('update-available', (e, version: string) => {
      this.updateInfo.version = version;
      this.updateInfo.available = true;
    });

    extensionsRenderer.on(
      'set-badge-text',
      (extensionId: string, details: chrome.browserAction.BadgeTextDetails) => {
        if (details.tabId) {
          const browserAction = this.extensions.queryBrowserAction({
            extensionId,
            tabId: details.tabId,
          })[0];

          if (browserAction) {
            browserAction.badgeText = details.text;
          }
        } else {
          this.extensions
            .queryBrowserAction({
              extensionId,
            })
            .forEach(item => {
              item.badgeText = details.text;
            });
        }
      },
    );

    ipcRenderer.on('find', () => {
      const tab = this.tabs.selectedTab;
      if (tab) {
        ipcRenderer.send(`find-show-${this.windowId}`, tab.id, tab.findInfo);
      }
    });

    ipcRenderer.send('update-check');

    requestAnimationFrame(() => {
      if (remote.process.argv.length > 1 && remote.process.env.ENV !== 'dev') {
        const path = remote.process.argv[1];
        const ext = extname(path);

        if (ext === '.html') {
          this.tabs.addTab({ url: `file:///${path}`, active: true });
        }
      }
    });
  }
}

export default new Store();
