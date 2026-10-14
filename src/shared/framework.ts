import type { Ref } from "vue";

export interface I18nTranslateOptions {
  lang?: string;
  key?: string;
}

export type ThemeType = "light" | "dark";
export type UseThemeFnReturn = [Ref<ThemeType>, (theme: ThemeType) => void];
export type UseThemeFn = (options: {
  localStorageKey?: string;
}) => UseThemeFnReturn;

export type TitlebarOperationType =
  | "minimize"
  | "close"
  | "theme"
  | "always-on-top";
