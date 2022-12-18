/**
 * 
 * The Embedded Javascript
 * Console messages show up in the Page Devtools
 * 
 */

function init() {
  const SCRIPT_DEBUG = true;

  console.log("initializing");
  if (SCRIPT_DEBUG) console.clear();

  /* Inject CSS */
  const videoWindow = document.querySelector("#videospace");

  if (videoWindow) {
    // videoWindow.classList.add("jitsi-extend-animation-container");

    const animationContainer = document.createElement('div');
    animationContainer.setAttribute("id", "jitsi-extend-animation-container");

    videoWindow.prepend(animationContainer);

  } else {
    console.error("Chrome Extension: Can't find the videoContainer")
  }


  /* Find the chat */
  const chatWindow = document.querySelector("#chatconversation");

  // function that generates things
  // TODO: Rename this
  const generateSuccessful = (emoji, emojiType) => {
    if (SCRIPT_DEBUG) console.log(`contains ${emojiType}`);
    
    // 1 - Show the emoji floating from the bottom
    const videoWindow = document.querySelector("#jitsi-extend-animation-container");

    if (videoWindow) {
      // create a visual UI element
      const emojiElement = document.createElement('div');
      const emojiElementID = `emoji-id-${Date.now()}`;  // TODO: Poor Man's ID generator

      emojiElement.setAttribute("id", emojiElementID);
      emojiElement.classList.add("jitsi-extend-animation-emoji");
      emojiElement.innerText = emoji;

      videoWindow.append(emojiElement);


      // TODO: would be nice to destroy it after animation is over
      // destroy the element after 4 seconds
      setTimeout(() => {
        const element = document.getElementById(emojiElementID);
        element.remove();
        if (SCRIPT_DEBUG) console.log(`Element destroyed`);
      }, 4000)


    }

    // return the Object
    return { sfx: emojiType };
  }


  // TODO: Import in here would be nice.
  function chatCallback(mutations) {
    if (SCRIPT_DEBUG) console.log(mutations);

    // TODO: Import in here would be nice.
    async function sendServiceWorkerMessage(msg) {
      const response = await chrome.runtime.sendMessage(msg);
    }

    for (let mutation of mutations) {
      if (mutation.type === "childList" && mutation.addedNodes[0]) {

        // Get the new added node
        const childElement = mutation.addedNodes[0];
        const childText = childElement.querySelector(".usermessage");
        const wholeText = childText.innerText;

        if (!childElement || !childText) {
          if (SCRIPT_DEBUG) console.warning("none was returned");
          return;
        }

        (SCRIPT_DEBUG && childElement) ? console.log(childElement) : console.log("no childElement was returned");
        (SCRIPT_DEBUG && childText) ? console.dir(childText) : console.log("no childText was returned");
        (SCRIPT_DEBUG && wholeText) ? console.dir(wholeText) : console.log("no wholeText was returned");

        // TODO: Crazy Regex for Emoji checker?
        // https://stackoverflow.com/a/64007175/4096078

        // 1 - if text is valid
        let message = {};
        let thing = "";

        // 2 - build the thing
        // first row
        // TODO: would be nice to migrate this somewhere else
        if (wholeText.includes("😃")) {
          message = generateSuccessful('😃', 'happyEmoji');        
        }
        if (wholeText.includes("😦")) {
          message = generateSuccessful('😦', 'panicEmoji');        
        }
        if (wholeText.includes("😄")) {
          message = generateSuccessful('😄', 'laughEmoji');        
        }
        if (wholeText.includes("👍")) {
          message = generateSuccessful('👍', 'thumbsupEmoji');        
        }
        if (wholeText.includes("😛")) {
          message = generateSuccessful('😛', 'tongueEmoji');        
        }
        if (wholeText.includes("👋")) {
          message = generateSuccessful('👋', 'waveEmoji');        
        }
        if (wholeText.includes("😊")) {
          message = generateSuccessful('😊', 'blushEmoji');        
        }

        // second row
        if (wholeText.includes("🙂")) {
          message = generateSuccessful('🙂', 'smileEmoji');        
        }
        if (wholeText.includes("😱")) {
          message = generateSuccessful('😱', 'screamEmoji');        
        }

        if (wholeText.includes("😗")) {
          message = generateSuccessful('😗', 'woopsEmoji');        
        }
        if (wholeText.includes("👎")) {
          message = generateSuccessful('👎', 'thumbsdownEmoji');        
        }

        if (wholeText.includes("🔍")) {
          message = generateSuccessful('🔍', 'searchEmoji');        
        }

        if (wholeText.includes("❤️")) {
          message = generateSuccessful('❤️', 'loveEmoji');        
        }

        if (wholeText.includes("😇")) {
          message = generateSuccessful('😇', 'angelEmoji');        
        }

        // third row
        if (wholeText.includes("😠")) {
          message = generateSuccessful('😠', 'annoyedEmoji');        
        }
        if (wholeText.includes("👼")) {
          message = generateSuccessful('👼', 'angelbabyEmoji');        
        }
        if (wholeText.includes("😭")) {
          message = generateSuccessful('😭', 'cryingEmoji');        
        }
        if (wholeText.includes("👏")) {
          message = generateSuccessful('👏', 'clapEmoji');        
        }
        if (wholeText.includes("😉")) {
          message = generateSuccessful('😉', 'winkEmoji');        
        }
        if (wholeText.includes("🍺")) {
          message = generateSuccessful('🍺', 'beerEmoji');        
        }

        // 3 - send the thing
        if (SCRIPT_DEBUG) {
          console.log("The Message?");
          console.log(message);
          console.log(Object.keys(message).length !== 0);
        }
        if (Object.keys(message).length !== 0) {
          if (SCRIPT_DEBUG) console.log("Sending Message:");

          (async () => {
            const response = await chrome.runtime.sendMessage(message);
          })();
        }



      }
    }
  }




  /* Create the Observer */  
  const observer = new MutationObserver(chatCallback);
  const options = {
    attributes: true,
    childList: true,
    subtree: true,
    characterDataOldValue: true,
  };
  observer.observe(chatWindow, options);

}


/**
 * 
 * The Service Worker
 * Debug messages show up in chrome://extensions/
 * Visit the Extension -> Inspect Views: "Service Worker"
 * 
 */
const meetingUrl1 = "https://meet.jit.si/";
const meetingUrl2 = "https://meet.";
const EXTENSION_DEBUG = true;

// Play Sound
function playSound(src = "audio/ff-victory.wav", length = 4, volume = 0.5) {
  let url = chrome.runtime.getURL("audio.html");

  // set this string dynamically in your code, this is just an example
  // this will play success.wav at half the volume and close the popup after a second
  url += `?volume=${volume}&src=${src}&length=${length * 1000}`;

  console.log("building the query string");
  console.log(url);

  chrome.windows.create({
    type: "popup",
    focused: true,
    top: 1,
    left: 1,
    height: 1,
    width: 1,
    url,
  });
}

// Badge Init
chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({
    text: "OFF",
  });
});


// Chrome Extension Init
chrome.action.onClicked.addListener(async (tab) => {
  console.log("event listener started");

  if (EXTENSION_DEBUG) console.clear();

  if (tab.url.startsWith(meetingUrl1) || tab.url.startsWith(meetingUrl1)) {
    console.log("I am in the proper URL");

    // Retrieve the action badge to check if the extension is 'ON' or 'OFF'
    const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
    // Next state will always be the opposite
    const nextState = prevState === "ON" ? "OFF" : "ON";

    // Set the action badge to the next state
    await chrome.action.setBadgeText({
      tabId: tab.id,
      text: nextState,
    });

    if (nextState === "ON") {
      console.log("Execute Script!");

      await chrome.scripting.insertCSS({
        files: ["styles/main.css"],
        target: { tabId: tab.id },
      });
  

      chrome.scripting.executeScript(
        {
          target: { tabId: tab.id },
          func: init,
        },
        () => {
          // ...
        }
      );
    }
  } else if (nextState === "OFF") {
    console.log("We are off now");
  }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.groupCollapsed();
  console.log("I have recieved a request");
  console.log(
    sender.tab
      ? "from a content script:" + sender.tab.url
      : "from the extension"
  );

  console.log(request);

  // Based on the request

  // if (request.sfx === "hello") {
  //   playSound(1);
  //   console.log("sound played");
  // }

  // TODO: have it automatically slot in there
  switch (request.sfx) {
    // first
    case "happyEmoji":
    case "panicEmoji":
    case "laughEmoji":
    case "thumbsupEmoji":
    case "tongueEmoji":
    case "waveEmoji":
    case "blushEmoji":
      playSound(`audio/${request.sfx}.wav`, 4);
      break;

    // second row
    case "smileEmoji":
    case "screamEmoji":
    case "woopsEmoji":
    case "thumbsdownEmoji":
    case "searchEmoji":
    case "loveEmoji":
    case "angelEmoji":
      playSound(`audio/${request.sfx}.wav`, 4);
      break;

    // third row
    case "annoyedEmoji":
    case "angelbabyEmoji":
    case "cryingEmoji":
    case "clapEmoji":
    case "winkEmoji":
    case "beerEmoji":
      playSound(`audio/${request.sfx}.wav`, 4);
      break;

    default:
      console.error(`${request.sfx} doesn't have anything`);
  }

  console.groupEnd();
});
