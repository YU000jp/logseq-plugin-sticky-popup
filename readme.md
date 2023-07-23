# Logseq Plugin: *Sticky Popup* 📍

- Show selected text in a movable pop-up and positioning calendar.

[![latest release version](https://img.shields.io/github/v/release/YU000jp/logseq-plugin-sticky-popup)](https://github.com/YU000jp/logseq-plugin-sticky-popup/releases)
[![License](https://img.shields.io/github/license/YU000jp/logseq-plugin-sticky-popup?color=blue)](https://github.com/YU000jp/logseq-plugin-sticky-popup/LICENSE)
[![Downloads](https://img.shields.io/github/downloads/YU000jp/logseq-plugin-sticky-popup/total.svg)](https://github.com/YU000jp/logseq-plugin-sticky-popup/releases) Published 2023/04/18

## Features

- Pop-ups possible to be moved around and resized.

![demo image](https://user-images.githubusercontent.com/111847207/232673738-4e21395a-b04b-4baf-82cc-c5ff2748bbce.gif)

### Sticky Text (Pop-up)

- Select text and click the same block. Registered in pop-up and automatically locked.

> Markdown is not reflected.

![image](https://user-images.githubusercontent.com/111847207/233500354-a9302519-a0ee-4d0c-b9b9-0b7ffe4bd24e.png)

   > "Unlock" is a button that overwrites the next selected text, and "pin" is a button that saves the position of the popup.

### Sticky Calendar (Pop-up)

<details><summary>Sample</summary>
  
![image](https://user-images.githubusercontent.com/111847207/233500548-4c46d364-5b48-4f23-bf72-1cc6be96e0d2.png)

</details>

- require install [Block Calendar Plugin](https://github.com/vipzhicheng/logseq-plugin-block-calendar) for rendering

- Set `custom`(Widget Location) and `#StickyCalendar`(Provide CSS selector) on the plugin settings

  <details><ummary></summary>
  
  <img src="https://user-images.githubusercontent.com/111847207/232676143-c895a94d-c78e-4c85-8ba1-2cf863813957.png"/>
  
  >Settings of Block Calendar plugin
  
</details>

## Getting Started

### Install from Logseq Marketplace

- Press [`---`] on the top right toolbar to open [`Plugins`]
- Select `Marketplace`
- Type `popup` in the search field, select it from the search results and install

![image](https://user-images.githubusercontent.com/111847207/232879519-8376669d-3f20-4b28-b0cc-6993c25140b7.png)

### Usage

- Open the plugin settings screen and do the necessary changes. By default, Sticky Calendar is set to "off" in the initial configuration.

### Plugin Settings

- (Sticky Text) Visible or not: select
   - `Journal`
   - `Not-Journal`
   - `All` default
   - `None`
- (Sticky Text) Showing over sidebar or not: boolean
   - `true` default
   - `false`
- (Sticky Calendar) Visible or not: select
   - `Journal` default
   - `Not-Journal`
   - `All`
   - `None`
- (Sticky Calendar) Showing over sidebar or not: boolean
   - `true` default
   - `false`

## Question

- To reopen popups, press on `📌`button in the toolbar

## Showcase / Questions / Ideas / Help

> Go to the [discussion](https://github.com/YU000jp/logseq-plugin-sticky-popup/discussions) tab to ask and find this kind of things.

## Author

- GitHub: [YU000jp](https://github.com/YU000jp)

## Prior art & Credit

### Library

- [@logseq/libs](https://logseq.github.io/plugins/)
- [xyhp915/ moveable plugin UI container](https://github.com/logseq/logseq/pull/3045)

### Icon

- [icooon-mono.com](https://icooon-mono.com/)

---

<a href="https://www.buymeacoffee.com/yu000japan" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-violet.png" alt="🍌Buy Me A Coffee" style="height: 42px;width: 152px" ></a>
