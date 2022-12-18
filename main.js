//

function init() {
  const SCRIPT_DEBUG = true;

  console.log("initializing");
  if (SCRIPT_DEBUG) console.clear();
  const chatWindow = document.querySelector("#chatconversation");

  // TODO: Import in here would be nice.
  function chatCallback(mutations) {
    console.log(mutations);

    // TODO: Import in here would be nice.
    async function sendServiceWorkerMessage(msg) {
      const response = await chrome.runtime.sendMessage(msg);
    }

    for (let mutation of mutations) {
      if (mutation.type === "childList" && mutation.addedNodes[0]) {
        // console.log("A child node has been added");

        // Get the new added node
        const childElement = mutation.addedNodes[0];
        const childText = childElement.querySelector(".usermessage");
        const wholeText = childText.innerText;

        if (!childElement || !childText) {
          console.warning("none was returned");
          return;
        }

        // (SCRIPT_DEBUG && childElement) ? console.log(childElement) : console.log("no childElement was returned");
        // (SCRIPT_DEBUG && childText) ? console.dir(childText) : console.log("no childText was returned");
        // (SCRIPT_DEBUG && wholeText) ? console.dir(wholeText) : console.log("no wholeText was returned");

        // TODO: Crazy Regex for Emoji checker?
        // https://stackoverflow.com/a/64007175/4096078

        // 1 - if text is valid

        let message = {};
        let thing = "";

        // 2 - build the thing
        // first row
        if (wholeText.includes("😃")) {
          thing = "happyEmoji";
          message = { sfx: thing };
          console.log(`contains ${thing}`);
        }
        if (wholeText.includes("😦")) {
          thing = "panicEmoji";
          message = { sfx: thing };
          console.log(`contains ${thing}`);
        }
        if (wholeText.includes("😄")) {
          thing = "laughEmoji";
          message = { sfx: thing };
          console.log(`contains ${thing}`);
        }
        if (wholeText.includes("👍")) {
          thing = "thumbsupEmoji";
          message = { sfx: thing };
          console.log(`contains ${thing}`);
        }
        if (wholeText.includes("😛")) {
          thing = "tongueEmoji";
          message = { sfx: thing };
          console.log(`contains ${thing}`);
        }
        if (wholeText.includes("👋")) {
          thing = "waveEmoji";
          message = { sfx: thing };
          console.log(`contains ${thing}`);
        }
        if (wholeText.includes("😊")) {
          thing = "blushEmoji";
          message = { sfx: thing };
          console.log(`contains ${thing}`);
        }

        // second row
        if (wholeText.includes("🙂")) {
          thing = "smileEmoji";
          message = { sfx: thing };
          console.log(`contains ${thing}`);
        }
        if (wholeText.includes("😱")) {
          thing = "screamEmoji";
          message = { sfx: thing };
          console.log(`contains ${thing}`);
        }

        if (wholeText.includes("😗")) {
          thing = "woopsEmoji";
          message = { sfx: thing };
          console.log(`contains ${thing}`);
        }
        if (wholeText.includes("👎")) {
          thing = "thumbsdownEmoji";
          message = { sfx: thing };
          console.log(`contains ${thing}`);
        }

        if (wholeText.includes("🔍")) {
          thing = "searchEmoji";
          message = { sfx: thing };
          console.log(`contains ${thing}`);
        }

        if (wholeText.includes("❤️")) {
          thing = "loveEmoji";
          message = { sfx: thing };
          console.log(`contains ${thing}`);
        }

        if (wholeText.includes("😇")) {
          thing = "angelEmoji";
          message = { sfx: thing };
          console.log(`contains ${thing}`);
        }

        // third row
        if (wholeText.includes("😠")) {
          thing = "annoyedEmoji";
          message = { sfx: thing };
          console.log(`contains ${thing}`);
        }
        if (wholeText.includes("👼")) {
          thing = "angelbabyEmoji";
          message = { sfx: thing };
          console.log(`contains ${thing}`);
        }
        if (wholeText.includes("😭")) {
          thing = "cryingEmoji";
          message = { sfx: thing };
          console.log(`contains ${thing}`);
        }
        if (wholeText.includes("👏")) {
          thing = "clapEmoji";
          message = { sfx: thing };
          console.log(`contains ${thing}`);
        }
        if (wholeText.includes("😉")) {
          thing = "winkEmoji";
          message = { sfx: thing };
          console.log(`contains ${thing}`);
        }
        if (wholeText.includes("🍺")) {
          thing = "beerEmoji";
          message = { sfx: thing };
          console.log(`contains ${thing}`);
        }

        // 3 - send the thing
        console.log("The Message?")
        console.log(message)
        console.log(Object.keys(message).length !== 0)

        if (Object.keys(message).length !== 0) {
          // (async () => {
          //   const response = await chrome.runtime.sendMessage({
          //     greeting: "hello",
          //   });
          // })();
          console.log("Sending Message:");

          (async () => {
            const response = await chrome.runtime.sendMessage(message);
          })();
        }
      }
    }
  }

  const observer = new MutationObserver(chatCallback);
  const options = {
    attributes: true,
    childList: true,
    subtree: true,
    characterDataOldValue: true,
  };

  observer.observe(chatWindow, options);

  console.log(chatWindow);
}

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

const meetings = "https://meet.jit.si/";
const EXTENSION_DEBUG = true;

// Chrome Extension Init
chrome.action.onClicked.addListener(async (tab) => {
  console.log("event listener started");

  if (EXTENSION_DEBUG) console.clear();

  if (tab.url.startsWith(meetings)) {
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
      break;

    case "screamEmoji":
      break;
    case "woopsEmoji":
      break;
    case "thumbsdownEmoji":
      break;

    case "searchEmoji":
      break;
    case "loveEmoji":
      break;
    case "angelEmoji":
      break;

    // third row
    case "annoyedEmoji":
      break;
    case "angelbabyEmoji":
      break;
    case "cryingEmoji":
      break;
    case "clapEmoji":
      break;
    case "winkEmoji":
      break;
    case "beerEmoji":
      break;

    default:
      console.error(`${request.sfx} doesn't have anything`);
  }

  console.groupEnd();
});
