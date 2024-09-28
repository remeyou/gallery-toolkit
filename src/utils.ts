export function checkDarkMode() {
  // Check if the browser supports prefers-color-scheme
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    console.log("Dark mode is supported and active.")
    return true
  } else {
    console.log("Dark mode is either not supported or not active.")
    return false
  }
}
