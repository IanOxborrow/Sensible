import { createTheming } from '../../react-theme-provider-master-src/';
import DefaultTheme from '../styles/DefaultTheme';

export const { ThemeProvider, withTheme, useTheme } = createTheming<
  ReactNativePaper.Theme
>(DefaultTheme as ReactNativePaper.Theme);
