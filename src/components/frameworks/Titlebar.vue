<script setup lang="ts">
import { useI18nStore } from "@/store/i18n";
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarShortcut,
} from "@/components/ui/menubar";
import { useRouter } from "vue-router";
import { useDialogStore, useThemeStore } from "@/store";
import TitlebarTitle from "./TitlebarTitle.vue";
import TitlebarOperations from "./TitlebarOperations.vue";
import { Sun, Moon } from "@lucide/vue";
import * as editorActions from "@/lib/editor.actions";
import { WindowUtils } from "@/lib/window.utils";

const i18n = useI18nStore();
const router = useRouter();
const dialogs = useDialogStore();
const theme = useThemeStore();

function toggleTheme() {
  theme.setThemeMode(theme.theme === "dark" ? "light" : "dark");
}
</script>

<template>
  <div
    class="titlebar fixed top-0 z-50 flex h-8 w-screen flex-row items-center justify-between border-b border-neutral-400 bg-white pl-2 shadow-sm dark:border-neutral-600 dark:bg-black"
    data-tauri-drag-region
  >
    <Menubar
      class="h-6 w-fit gap-1 rounded-none border-0 bg-transparent p-0 text-neutral-600 shadow-none transition-colors duration-100 ease-in-out dark:text-neutral-200"
    >
      <MenubarMenu>
        <MenubarTrigger class="h-full w-fit px-2 text-sm">
          {{ i18n.t("Titlebar.menu.turnto") }}
        </MenubarTrigger>
        <MenubarContent class="w-fit transition-all duration-100 ease-in-out">
          <MenubarItem @select="() => router.push('/')">
            {{ i18n.t("Titlebar.menu.turnto.home") }}
          </MenubarItem>
          <MenubarItem @select="() => dialogs.openSettings()">
            {{ i18n.t("Titlebar.menu.turnto.settings") }}
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem @select="toggleTheme">
            {{ i18n.t("Titlebar.menu.turnto.theme") }}
            <Sun v-if="theme.theme === 'dark'" class="titlebar-op-icon" />
            <Moon v-else class="titlebar-op-icon" />
          </MenubarItem>
          <MenubarItem @select="() => WindowUtils.windowsQuit()">
            {{ i18n.t("Titlebar.menu.turnto.exit") }}
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger class="h-full w-fit px-2 text-sm">
          {{ i18n.t("Titlebar.menu.edit") }}
        </MenubarTrigger>
        <MenubarContent class="w-fit transition-all duration-100 ease-in-out">
          <MenubarItem @select="editorActions.undo">
            {{ i18n.t("Titlebar.menu.edit.undo") }}
            <MenubarShortcut>Ctrl+Z</MenubarShortcut>
          </MenubarItem>
          <MenubarItem @select="editorActions.redo">
            {{ i18n.t("Titlebar.menu.edit.redo") }}
            <MenubarShortcut>Ctrl+Shift+Z</MenubarShortcut>
          </MenubarItem>

          <MenubarSeparator />

          <MenubarItem @select="editorActions.cut">
            {{ i18n.t("Titlebar.menu.edit.cut") }}
            <MenubarShortcut>Ctrl+X</MenubarShortcut>
          </MenubarItem>
          <MenubarItem @select="editorActions.copy">
            {{ i18n.t("Titlebar.menu.edit.copy") }}
            <MenubarShortcut>Ctrl+C</MenubarShortcut>
          </MenubarItem>
          <MenubarItem @select="() => editorActions.paste()">
            {{ i18n.t("Titlebar.menu.edit.paste") }}
            <MenubarShortcut>Ctrl+V</MenubarShortcut>
          </MenubarItem>

          <MenubarSeparator />

          <MenubarItem @select="editorActions.selectAll">
            {{ i18n.t("Titlebar.menu.edit.selectAll") }}
            <MenubarShortcut>Ctrl+A</MenubarShortcut>
          </MenubarItem>
          <MenubarItem @select="editorActions.find">
            {{ i18n.t("Titlebar.menu.edit.find") }}
            <MenubarShortcut>Ctrl+K</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger class="h-full w-fit px-2 text-sm">
          {{ i18n.t("Titlebar.menu.help") }}
        </MenubarTrigger>
        <MenubarContent class="w-fit transition-all duration-100 ease-in-out">
          <MenubarItem @select="() => router.push('/framework')">
            {{ i18n.t("Titlebar.menu.about.framework") }}
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem @select="() => dialogs.openAbout()">
            {{ i18n.t("Titlebar.menu.about") }}
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>

    <TitlebarTitle data-tauri-drag-region />

    <TitlebarOperations />
  </div>
</template>
