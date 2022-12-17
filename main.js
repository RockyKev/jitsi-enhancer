chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({
    text: "OFF",
  });
});

// const extensions = 'https://developer.chrome.com/docs/extensions'
// const webstore = 'https://developer.chrome.com/docs/webstore'
const meetings = 'https://meet.jit.si/';

chrome.action.onClicked.addListener(async (tab) => {

  if (tab.url.startsWith(meetings)) {

    // Retrieve the action badge to check if the extension is 'ON' or 'OFF'
    const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
    // Next state will always be the opposite
    const nextState = prevState === 'ON' ? 'OFF' : 'ON'

    // Set the action badge to the next state
    await chrome.action.setBadgeText({
      tabId: tab.id,
      text: nextState,
    });



    if (nextState === "ON") {
      // Insert the CSS file when the user turns the extension on
      console.log("We are on now!")
      // await chrome.scripting.insertCSS({
      //   files: ["styles/main.css"],
      //   target: { tabId: tab.id },
      // });


      // 1 - target the chat window

      // 2 - output it







    } else if (nextState === "OFF") {
      console.log("We are off now")
      // Remove the CSS file when the user turns the extension off
      // await chrome.scripting.removeCSS({
      //   files: ["styles/main.css"],
      //   target: { tabId: tab.id },
      // });
    }
  } 

});

