# Logseq Plugin: *Sticky Popup* 📍

- Show selected text in a movable pop-up and positioning calendar.
- Displays user messages by day of the week, with the added functionality of reminding about overdue tasks. When the Journal template is loaded, they are displayed. 

<div align="right">

[![latest release version](https://img.shields.io/github/v/release/YU000jp/logseq-plugin-sticky-popup)](https://github.com/YU000jp/logseq-plugin-sticky-popup/releases)
[![License](https://img.shields.io/github/license/YU000jp/logseq-plugin-sticky-popup?color=blue)](https://github.com/YU000jp/logseq-plugin-sticky-popup/LICENSE)
[![Downloads](https://img.shields.io/github/downloads/YU000jp/logseq-plugin-sticky-popup/total.svg)](https://github.com/YU000jp/logseq-plugin-sticky-popup/releases) Published 2023/04/18 <a href="https://www.buymeacoffee.com/yu000japan"><img src="https://img.buymeacoffee.com/button-api/?text=Buy me a pizza&emoji=🍕&slug=yu000japan&button_colour=FFDD00&font_colour=000000&font_family=Poppins&outline_colour=000000&coffee_colour=ffffff" /></a>
</div>

## Features

- Pop-ups possible to be moved around and resized.

  > ![demo image](https://user-images.githubusercontent.com/111847207/232673738-4e21395a-b04b-4baf-82cc-c5ff2748bbce.gif)

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

### Overdue tasks board

- Display overdue tasks from yesterday. (If found)

### Daily message board

- Display user message each day. Supports HTML instead of markdown.

#### As showcase

- Display user favorite image by HTML each day. `<img src="FilePath"/>`
> ⚠️Use direct file paths instead of indirect

---

## Getting Started

### Install from Logseq Marketplace

- Press [`---`] on the top right toolbar to open [`Plugins`]
- Select `Marketplace`
- Type `popup` in the search field, select it from the search results and install

![image](https://user-images.githubusercontent.com/111847207/232879519-8376669d-3f20-4b28-b0cc-6993c25140b7.png)

### Usage

- Open the plugin settings screen and do the necessary changes. By default, Sticky Calendar is set to "off" in the initial configuration.

### Toolbar Icon

- To reopen popups, press on `📌`button in the toolbar
  - For Daily message board: `💬`
  - For Overdue tasks board: `⏳`

### Plugin Settings

#### Sticky Text

- (Sticky Text) Visible or not: select
  - `Journal`
  - `Not-Journal`
  - `All` default
  - `None`
- (Sticky Text) Showing over sidebar or not: toggle
  - `true` default
  - `false`

#### Sticky Calendar

- (Sticky Calendar) Visible or not: select
  - `Journal` default
  - `Not-Journal`
  - `All`
  - `None`
- (Sticky Calendar) Showing over sidebar or not: toggle
  - `true` default
  - `false`

#### Overdue task board

> Enabled when toggles are on. Can be called from the toolbar button.
- Show the board when journal template is loaded: toggle
  `true`
  `false` default
- Show the board when Logseq is loaded: toggle
  `true`
  `false` default

#### Daily message board

> Enabled when toggles are on. Can be called from the toolbar button.
- Show the board when today journal is created: toggle
  `true` default
  `false`
- Show the board when Logseq loaded: toggle
  `true` default
  `false`
- Enable close the board timeout: toggle
  `true` default
  `false`
- Close the board timeout [ms]: select
  - [`8000`, `9000`, `10000` default, `12000`, `14000`, `16000`, `18000`, `20000`]
- Background color (from theme): select
  - `var(--ls-primary-background-color)` default
  - `var(--ls-secondary-background-color)`
  - `var(--ls-tertiary-background-color)`
  - `var(--ls-quaternary-background-color)`
  - `var(--ls-table-tr-even-background-color)`
  - `var(--ls-block-properties-background-color)`
  - `var(--ls-page-properties-background-color)`
- Font Color (from theme): select
  - `var(--ls-primary-text-color)` default
  - `var(--ls-secondary-text-color)`
  - `var(--ls-title-text-color)`
  - `var(--ls-link-text-color)`
- The board title, select localize (your language) or English: select
  - `default` default
  - `en`: English
- Show Monday message board: toggle
  - `true`
  - `false` default
- Message for Monday (Supports HTML instead of markdown)
  - (textarea)
- alias Tuesday...Sunday

---

## Showcase / Questions / Ideas / Help

> Go to the [Discussions](https://github.com/YU000jp/logseq-plugin-sticky-popup/discussions) tab to ask and find this kind of things.

## Prior art & Credit

- Library > [@logseq/libs](https://logseq.github.io/plugins/)
- Library > [@xyhp915/ moveable plugin UI container](https://github.com/logseq/logseq/pull/3045)
- Icon > [icooon-mono.com](https://icooon-mono.com/)
- Author >[@YU000jp](https://github.com/YU000jp)
