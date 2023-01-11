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
function playSound(src = "audio/ffvictorySlash.wav", length = 4, volume = 0.5) {
  let url = chrome.runtime.getURL("background-window/audio.html");

  // set this string dynamically in your code, this is just an example
  // this will play success.wav at half the volume and close the popup after a second
  url += `?volume=${volume}&src=${src}&length=${length * 1000 + 1000}`;

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

  if (tab.url.startsWith(meetingUrl1) || tab.url.startsWith(meetingUrl2)) {
    console.log("I am in the proper URL");

    // Retrieve the action badge to check if the extension is 'ON' or 'OFF'
    const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
    // Next state will always be the opposite
    const nextState = prevState === "ON" ? "OFF" : "ON";

    console.log("We are moving to the nextstate: ", nextState);

    // Set the action badge to the next state
    await chrome.action.setBadgeText({
      tabId: tab.id,
      text: nextState,
    });

    if (nextState === "ON") {
      console.log("Execute Script!");

      await chrome.scripting.insertCSS({
        files: ["./service-worker/main.css"],
        target: { tabId: tab.id },
      });


      // TODO: Figure out how to properly load content scripts
      chrome.scripting.executeScript(
        {
          target: { tabId: tab.id },
          files: ["./service-worker/jitsi-enhancer.js"],
        },
        () => {
          // send a message that we're LIVE!
          (async () => {
            const message = { enableExtension: "enable" };

            const response = await chrome.tabs.sendMessage(tab.id, message);
            // // do something with response here, not outside the function
            console.log(response);
          })();
        }
      );
    } else if (nextState === "OFF") {
      console.log("We are off now");

      // TODO: this doesn't do anything yet?
      await chrome.scripting.removeCSS({
        target: { tabId: tab.id },
        files: ["./service-worker/main.css"],
      });

      (async () => {
        const message = { enableExtension: "disable" };
        const response = await chrome.tabs.sendMessage(tab.id, message);
        // // do something with response here, not outside the function
        console.log(response);
      })();


    }
  }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.groupCollapsed();
  console.log("I have recieved a request");
  console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");

  console.log(request);

  // Based on the request

  switch (request.sfx) {
    // first
    case "happyEmoji":
    case "panicEmoji":
    case "laughEmoji":
    case "thumbsupEmoji":
    case "tongueEmoji":
    case "waveEmoji":
    case "blushEmoji":
      playSound(`audio/${request.sfx}.wav`, request.sfxLength);
      break;

    // second row
    case "smileEmoji":
    case "screamEmoji":
    case "woopsEmoji":
    case "thumbsdownEmoji":
    case "searchEmoji":
    case "loveEmoji":
    case "angelEmoji":
      playSound(`audio/${request.sfx}.wav`, request.sfxLength);
      break;

    // third row
    case "annoyedEmoji":
    case "angelbabyEmoji":
    case "cryingEmoji":
    case "clapEmoji":
    case "winkEmoji":
    case "beerEmoji":
      playSound(`audio/${request.sfx}.wav`, request.sfxLength);
      break;

    // slash commands
    case "yeahSlash":
    case "audienceClapSlash":
    case "bgJazzSlash":
    case "traceySlash":
    case "lunaSlash":
    case "ryannSlash":
    case "graysonSlash":
    case "bridgettSlash":
    case "dohSlash":
    case "enhanceSlash":
    case "leeroyJenkinsSlash":
    case "woohooSlash":
    case "cricketsSlash":  
    case "ffvictorySlash":
    case "lateSlash":
    case "swpowerSlash":
    case "swscreamSlash":
      playSound(`audio/${request.sfx}.wav`, request.sfxLength);
      break;

    default:
      console.error(`${request.sfx} doesn't have anything`);
  }

  console.groupEnd();
});
