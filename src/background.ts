import { Origins } from '~constants'
import { getLocation, includes } from '~lib/utils'

chrome.tabs.onUpdated.addListener(async (tabId, info, tab) => {
  // Enables the side panel
  if (includes(Object.values(Origins), getLocation(tab).origin)) {
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
