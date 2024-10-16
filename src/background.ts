import { ORIGINS } from '~constants'
import { includes } from '~utils'

chrome.tabs.onUpdated.addListener(async (tabId, info, tab) => {
  const url = new URL(tab.url ?? ORIGINS.Localhost)
  // Enables the side panel
  if (includes(Object.values(ORIGINS), url.origin)) {
    await chrome.sidePanel.setOptions({
      tabId,
      path: 'sidepanel.html',
      enabled: true,
    })
  } else {
    // Disables the side panel on all other sites
    await chrome.sidePanel.setOptions({
      tabId,
      enabled: false,
    })
  }
})

// Allows users to open the side panel by clicking on the action toolbar icon
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error))
