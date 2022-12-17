// function getTitle() {
//   console.log("get Title", document.title)
//   return document.title;
// }

function init() {
  console.log("initializing")
  const chatContainer = document.querySelector("#chat-conversation-container")

  console.log(chatContainer);
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({
    text: "OFF",
  });

  console.log("We're going!");
});

// const extensions = 'https://developer.chrome.com/docs/extensions'
// const webstore = 'https://developer.chrome.com/docs/webstore'
const meetings = 'https://meet.jit.si/';

chrome.action.onClicked.addListener(async (tab) => {

  console.log("event listener started")

  if (tab.url.startsWith(meetings)) {

    console.log("I am in the proper URL")

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

      // 1 - target the chat window
      // const chatContainer = document.querySelector("#chat-conversation-container")

      // 2 - output it
      // console.log(chatContainer);

      chrome.scripting.executeScript(
        {
          target: {tabId: tab.id},
          func: init,
        },
        () => { 
          // ... 
        });


    }

    } else if (nextState === "OFF") {
      console.log("We are off now")
      // Remove the CSS file when the user turns the extension off
      // await chrome.scripting.removeCSS({
      //   files: ["styles/main.css"],
      //   target: { tabId: tab.id },
      // });

   
  } 

});

