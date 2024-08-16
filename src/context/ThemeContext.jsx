import { createContext, useCallback, useLayoutEffect, useState } from 'react';
import {
  LIGHTNESS_STEP,
  CHROMA_STEP,
  HUE_STEP,
  P3_MAX_CHROMA_OFFSET,
  LIGHTNESS_OF_PEAK_CHROMA,
  SECONDARY_CHROMA_RATIO,
  NEUTRAL_VARIANT_PEAK_CHROMA,
  NEUTRAL_PEAK_CHROMA,
  UTILITY_PEAK_CHROMA,
  WARNING_HUE,
  ERROR_HUE,
} from '../utils/constants';
import {
  maxChromaOfLightness,
  chromaOfLightness,
  hueOfLightness,
} from '../utils/colourUtils';
import { closestQuantized } from '../utils/numberUtils';
import { camelToKebab, replaceCamelCaseWord } from '../utils/stringUtils';

export const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [hues, setHues] = useState({ from: 0, to: 0 });

  const updateTheme = useCallback((newBoolean) => {
    setTheme(newBoolean ? 'light' : 'dark');
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => {
      return prevTheme === 'light' ? 'dark' : 'light';
    });
  }, []);

  const updateHues = useCallback((newHues) => {
    setHues((prevHues) => {
      return { ...prevHues, ...newHues };
    });
  }, []);

  const syncHues = useCallback(() => {
    setHues((prevHues) => {
      return { ...prevHues, ['to']: prevHues.from };
    });
  }, []);

  const applyStaticHueCssProperties = useCallback(
    (lightnessTable, name, peakChroma, hue, targetDom) => {
      Object.entries(lightnessTable).forEach(
        ([roleName, lightnessOfThemes]) => {
          Object.entries(lightnessOfThemes).forEach(
            ([themeName, lightness]) => {
              let chroma = chromaOfLightness(
                lightness,
                LIGHTNESS_OF_PEAK_CHROMA,
                peakChroma
              );
              chroma = closestQuantized(chroma, CHROMA_STEP);

              let propertyName = replaceCamelCaseWord(roleName, 'name', name);
              propertyName = camelToKebab(propertyName);
              propertyName = `--${propertyName}-${themeName}`;
              const propertyValue = `oklch(${closestQuantized(
                lightness,
                LIGHTNESS_STEP
              )} ${chroma} ${closestQuantized(hue, HUE_STEP)}deg)`;
              targetDom.style.setProperty(propertyName, propertyValue);
            }
          );
        }
      );
    },
    []
  );
  const applyDynamicHueCssProperties = useCallback(
    (lightnessTable, name, peakChroma, chromaMultiplier, targetDom) => {
      Object.entries(lightnessTable).forEach(
        ([roleName, lightnessOfThemes]) => {
          Object.entries(lightnessOfThemes).forEach(
            ([themeName, lightness]) => {
              let chroma =
                chromaOfLightness(
                  lightness,
                  LIGHTNESS_OF_PEAK_CHROMA,
                  peakChroma
                ) * chromaMultiplier;
              chroma = closestQuantized(chroma, CHROMA_STEP);

              let hue = hueOfLightness(lightness, hues.from, hues.to);
              hue = closestQuantized(hue, HUE_STEP);

              let propertyName = replaceCamelCaseWord(roleName, 'name', name);
              propertyName = camelToKebab(propertyName);
              propertyName = `--${propertyName}-${themeName}`;
              const propertyValue = `oklch(${closestQuantized(
                lightness,
                LIGHTNESS_STEP
              )} ${chroma} ${hue}deg)`;
              targetDom.style.setProperty(propertyName, propertyValue);
            }
          );
        }
      );
    },
    [hues]
  );

  useLayoutEffect(() => {
    const body = document.body;
    body.dataset.theme = theme;
  }, [theme]);
  useLayoutEffect(() => {
    const vivids = {
      name: {
        light: 0.4,
        dark: 0.8,
      },
      onName: {
        light: 1,
        dark: 0.2,
      },
      nameContainer: {
        light: 0.9,
        dark: 0.3,
      },
      onNameContainer: {
        light: 0.1,
        dark: 0.9,
      },
      nameFixed: {
        light: 0.9,
        dark: 0.9,
      },
      onNameFixed: {
        light: 0.1,
        dark: 0.1,
      },
      nameFixedDim: {
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

    const peakChroma =
      maxChromaOfLightness(LIGHTNESS_OF_PEAK_CHROMA, hues.from, hues.to) -
      P3_MAX_CHROMA_OFFSET;

    applyDynamicHueCssProperties(vivids, 'primary', peakChroma, 1, root);
    applyDynamicHueCssProperties(
      vivids,
      'secondary',
      peakChroma,
      SECONDARY_CHROMA_RATIO,
      root
    );
    applyStaticHueCssProperties(
      vivids,
      'warning',
      UTILITY_PEAK_CHROMA,
      WARNING_HUE,
      root
    );
    applyStaticHueCssProperties(
      vivids,
      'error',
      UTILITY_PEAK_CHROMA,
      ERROR_HUE,
      root
    );
    applyDynamicHueCssProperties(
      neutralVariant,
      '',
      NEUTRAL_VARIANT_PEAK_CHROMA,
      1,
      root
    );
    applyDynamicHueCssProperties(neutral, '', NEUTRAL_PEAK_CHROMA, 1, root);

    root.style.setProperty(
      '--shadow-0',
      '0 0 0 0 rgba(0, 0, 0, 0), 0 0 0 0 rgba(0, 0, 0, 0)'
    );
    root.style.setProperty(
      '--shadow-1-light',
      '0rem .0625rem .125rem 0rem rgba(0, 0, 0, 0.30), 0rem .0625rem .1875rem .0625rem rgba(0, 0, 0, 0.15)'
    );
    root.style.setProperty(
      '--shadow-2-light',
      '0rem .0625rem .125rem 0rem rgba(0, 0, 0, 0.30), 0rem .125rem .375rem .125rem rgba(0, 0, 0, 0.15)'
    );
    root.style.setProperty(
      '--shadow-3-light',
      '0rem .0625rem .125rem 0rem rgba(0, 0, 0, 0.30), 0rem .0625rem .1875rem .0625rem rgba(0, 0, 0, 0.15)'
    );
    root.style.setProperty(
      '--shadow-4-light',
      '0rem .125rem .1875rem 0rem rgba(0, 0, 0, 0.30), 0rem .375rem .625rem .25rem rgba(0, 0, 0, 0.15)'
    );
    root.style.setProperty(
      '--shadow-5-light',
      '0rem .25rem .25rem 0rem rgba(0, 0, 0, 0.30), 0rem .5rem .75rem .375rem rgba(0, 0, 0, 0.15)'
    );
    root.style.setProperty(
      '--shadow-1-dark',
      '0rem .0625rem .1875rem .0625rem rgba(0, 0, 0, 0.15), 0rem .0625rem .125rem 0rem rgba(0, 0, 0, 0.30)'
    );
    root.style.setProperty(
      '--shadow-2-dark',
      '0rem .125rem .375rem .125rem rgba(0, 0, 0, 0.15), 0rem .0625rem .125rem 0rem rgba(0, 0, 0, 0.30)'
    );
    root.style.setProperty(
      '--shadow-3-dark',
      '0rem .25rem .5rem .1875rem rgba(0, 0, 0, 0.15), 0rem .0625rem .1875rem 0rem rgba(0, 0, 0, 0.30)'
    );
    root.style.setProperty(
      '--shadow-4-dark',
      '0rem .375rem .625rem .25rem rgba(0, 0, 0, 0.15), 0rem .125rem .1875rem 0rem rgba(0, 0, 0, 0.30)'
    );
    root.style.setProperty(
      '--shadow-5-dark',
      '0rem .5rem .75rem .375rem rgba(0, 0, 0, 0.15), 0rem .25rem .25rem 0rem rgba(0, 0, 0, 0.30)'
    );
  }, [hues]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        updateTheme,
        toggleTheme,
        hues,
        setHues,
        updateHues,
        syncHues,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
