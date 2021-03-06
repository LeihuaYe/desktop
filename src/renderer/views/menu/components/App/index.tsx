import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { ThemeProvider } from 'styled-components';
import { hot } from 'react-hot-loader/root';

import { StyledApp } from './style';
import { QuickMenu } from '../QuickMenu';
import store from '../../store';
import { UIStyle } from '~/renderer/mixins/default-styles';

export const App = hot(
  observer(() => {
    return (
      <ThemeProvider
        theme={{ ...store.theme, dark: store.theme['dialog.lightForeground'] }}
      >
        <StyledApp visible={store.visible}>
          <UIStyle />
          <QuickMenu />
        </StyledApp>
      </ThemeProvider>
    );
  }),
);
