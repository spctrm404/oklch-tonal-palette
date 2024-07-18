import { createContext, useCallback, useEffect, useState } from 'react';
import {
  LIGHTNESS_STEP,
  CHROMA_STEP,
  HUE_STEP,
  LIGHTNESS_OF_CHROMA_MAX,
  SECONDARY_CHROMA_RATIO,
  NEUTRAL_VARIANT_CHROMA_MAX,
  NEUTRAL_CHROMA_MAX,
} from '../utils/constants';
import {
  getMaxChromaOfLightness,
  getChromaOfLightness,
  getHueOfLightness,
} from '../utils/colourUtils';
import { setMultipleOfStep } from '../utils/numberUtils';
import { camelToKebab } from '../utils/stringUtils';

export const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [hue, setHue] = useState({ from: 0, to: 0 });

  const updateTheme = useCallback((bool) => {
    setTheme(bool ? 'light' : 'dark');
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => {
      return prevTheme === 'light' ? 'dark' : 'light';
    });
  }, []);

  const updateHue = useCallback((key, value) => {
    setHue((prevHue) => {
      return { ...prevHue, [key]: value };
    });
  }, []);

  const updateCssVariables = useCallback(
    (lightnessData, name, cMax, chromaRatio, dom) => {
      Object.entries(lightnessData).forEach(([tokenName, lightnessPairObj]) => {
        Object.entries(lightnessPairObj).forEach(([themeName, l]) => {
          let c =
            getChromaOfLightness(l, LIGHTNESS_OF_CHROMA_MAX, cMax) *
            chromaRatio;
          c = setMultipleOfStep(c, CHROMA_STEP);
          let h = getHueOfLightness(l, hue.from, hue.to);
          h = setMultipleOfStep(h, HUE_STEP);

          let variableName = camelToKebab(tokenName);
          variableName = variableName.replace('Name', name);
          variableName = variableName.replace('name', name.toLowerCase());
          variableName = `--${variableName}-${themeName}`;
          const primaryValue = `oklch(${setMultipleOfStep(
            l,
            LIGHTNESS_STEP
          )} ${c} ${h})`;
          dom.style.setProperty(variableName, primaryValue);
        });
      });
    },
    [hue]
  );

  useEffect(() => {
    const vivids = {
      name: {
        light: 0.4,
        dark: 0.8,
      },
      onName: {
        light: 1,
        dark: 0.2,
      },
      NameContainer: {
        light: 0.9,
        dark: 0.3,
      },
      onNameContainer: {
        light: 0.1,
        dark: 0.9,
      },
      NameFixed: {
        light: 0.9,
        dark: 0.9,
      },
      onNameFixed: {
        light: 0.1,
        dark: 0.1,
      },
      NameFixedDim: {
        light: 0.8,
        dark: 0.8,
      },
      onNameFixedDim: {
        light: 0.3,
        dark: 0.3,
      },
      inverseName: {
        light: 0.8,
        dark: 0.4,
      },
    };

    const neutralVariant = {
      surfaceVariant: {
        light: 0.9,
        dark: 0.3,
      },
      onSurfaceVariant: {
        light: 0.3,
        dark: 0.8,
      },
      outlineVariant: {
        light: 0.8,
        dark: 0.3,
      },
    };

    const neutral = {
      surface: {
        light: 0.98,
        dark: 0.06,
      },
      onSurface: {
        light: 0.1,
        dark: 0.9,
      },
      surfaceContainerHighest: {
        light: 0.9,
        dark: 0.22,
      },
      surfaceContainerHigh: {
        light: 0.92,
        dark: 0.17,
      },
      surfaceContainer: {
        light: 0.94,
        dark: 0.12,
      },
      surfaceContainerLow: {
        light: 0.96,
        dark: 0.1,
      },
      surfaceContainerLowest: {
        light: 1,
        dark: 0.04,
      },
      inverseSurface: {
        light: 0.2,
        dark: 0.9,
      },
      inverseOnSurface: {
        light: 0.95,
        dark: 0.2,
      },
      surfaceTint: {
        light: 0.4,
        dark: 0.8,
      },
      outline: {
        light: 0.5,
        dark: 0.6,
      },
      bg: {
        light: 0.98,
        dark: 0.06,
      },
      onBg: {
        light: 0.1,
        dark: 0.9,
      },
      surfaceBright: {
        light: 0.98,
        dark: 0.24,
      },
      surfaceDim: {
        light: 0.87,
        dark: 0.06,
      },
      scrim: {
        light: 0,
        dark: 0,
      },
      shadow: {
        light: 0,
        dark: 0,
      },
    };

    const root = document.documentElement;

    const cMax = getMaxChromaOfLightness(
      LIGHTNESS_OF_CHROMA_MAX,
      hue.from,
      hue.to
    );

    updateCssVariables(vivids, 'Primary', cMax, 1, root);
    updateCssVariables(vivids, 'Secondary', cMax, SECONDARY_CHROMA_RATIO, root);
    updateCssVariables(neutralVariant, '', NEUTRAL_VARIANT_CHROMA_MAX, 1, root);
    updateCssVariables(neutral, '', NEUTRAL_CHROMA_MAX, 1, root);

    const body = document.body;
    body.dataset.theme = theme;
  }, [theme, hue, updateCssVariables]);

  return (
    <ThemeContext.Provider
      value={{ theme, updateTheme, toggleTheme, hue, updateHue }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
