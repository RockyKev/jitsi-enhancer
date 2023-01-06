/**
 *
 * The Embedded Javascript
 * Console messages show up in the Page Devtools
 *
 */

const chatCallback = (mutations) => {
  //   if (SCRIPT_DEBUG) console.log(mutations);

  for (let mutation of mutations) {
    if (mutation.type === "childList" && mutation.addedNodes[0]) {
      // Get the new added node
      const childElement = mutation.addedNodes[0];
      const childText = childElement.querySelector(".usermessage");
      const childHTML = childText.innerHTML;
      const wholeText = childHTML.substring(childHTML.indexOf("</span>") + 7);

      if (!childElement || !childText) {
        // if (SCRIPT_DEBUG) console.warning("none was returned");
        return;
      }


      // TODO: Crazy Regex for Emoji checker?
      // https://stackoverflow.com/a/64007175/4096078

      // 1 - if text is valid
      let message = {};

      // 2 - build the thing
      // first row
      // TODO: would be nice to migrate this somewhere else

      // SLASH COMMANDS
      if (wholeText.trim() === "/tracey") {
        message = generateServiceWorkerMsg(false, "traceySlash", 2, false);
      }
      if (wholeText.trim() === "/audienceClap") {
        message = generateServiceWorkerMsg(false, "audienceClapSlash", 10, false);
      }
      if (wholeText.trim() === "/bgJazz") {
        message = generateServiceWorkerMsg(false, "bgJazzSlash", 77, false);
      }
      if (wholeText.trim() === "/yeah") {
        message = generateServiceWorkerMsg(false, "yeahSlash", 8, false);
      }

      if (wholeText.trim() === "/doh") {
        message = generateServiceWorkerMsg(false, "dohSlash", 1, false);
      }

      if (wholeText.trim() === "/leeroyJenkins") {
        message = generateServiceWorkerMsg(false, "leeroyJenkinsSlash", 5, false);
      }

      if (wholeText.trim() === "/enhance") {
        message = generateServiceWorkerMsg(false, "enhanceSlash", 1, false);
      }

      if (wholeText.trim() === "/woohoo") {
        message = generateServiceWorkerMsg(false, "woohooSlash", 1, false);
      }

      if (wholeText.trim() === "/ff" || wholeText.trim() === "/ffvictory") {
        message = generateServiceWorkerMsg(false, "ffvictorySlash", 5, false);
      }

      // EMOJI COMMANDS
      if (wholeText.includes("😃")) {
        message = generateServiceWorkerMsg("😃", "happyEmoji", 2, wholeText);
      }
      if (wholeText.includes("😦")) {
        message = generateServiceWorkerMsg("😦", "panicEmoji", 1, wholeText);
      }
      if (wholeText.includes("😄")) {
        message = generateServiceWorkerMsg("😄", "laughEmoji", 1, wholeText);
      }
      if (wholeText.includes("👍")) {
        message = generateServiceWorkerMsg("👍", "thumbsupEmoji", 1, wholeText);
      }
      if (wholeText.includes("😛")) {
        message = generateServiceWorkerMsg("😛", "tongueEmoji", 1, wholeText);
      }
      if (wholeText.includes("👋")) {
        message = generateServiceWorkerMsg("👋", "waveEmoji", 4, wholeText);
      }
      if (wholeText.includes("😊")) {
        message = generateServiceWorkerMsg("😊", "blushEmoji", 3, wholeText);
      }

      // second row
      if (wholeText.includes("🙂")) {
        message = generateServiceWorkerMsg("🙂", "smileEmoji", 1, wholeText);
      }
      if (wholeText.includes("😱")) {
        message = generateServiceWorkerMsg("😱", "screamEmoji", 1, wholeText);
      }

      if (wholeText.includes("😗")) {
        message = generateServiceWorkerMsg("😗", "woopsEmoji", 1, wholeText);
      }
      if (wholeText.includes("👎")) {
        message = generateServiceWorkerMsg("👎", "thumbsdownEmoji", 1, wholeText);
      }

      if (wholeText.includes("🔍")) {
        message = generateServiceWorkerMsg("🔍", "searchEmoji", 1, wholeText);
      }

      if (wholeText.includes("❤️")) {
        message = generateServiceWorkerMsg("❤️", "loveEmoji", 1, wholeText);
      }

      if (wholeText.includes("😇")) {
        message = generateServiceWorkerMsg("😇", "angelEmoji", 2, wholeText);
      }

      // third row
      if (wholeText.includes("😠")) {
        message = generateServiceWorkerMsg("😠", "annoyedEmoji", 1, wholeText);
      }
      if (wholeText.includes("👼")) {
        message = generateServiceWorkerMsg("👼", "angelbabyEmoji", 1, wholeText);
      }
      if (wholeText.includes("😭")) {
        message = generateServiceWorkerMsg("😭", "cryingEmoji", 1, wholeText);
      }
      if (wholeText.includes("👏")) {
        message = generateServiceWorkerMsg("👏", "clapEmoji", 4, wholeText);
      }
      if (wholeText.includes("😉")) {
        message = generateServiceWorkerMsg("😉", "winkEmoji", 1, wholeText);
      }
      if (wholeText.includes("🍺")) {
        message = generateServiceWorkerMsg("🍺", "beerEmoji", 1, wholeText);
      }

      // Send the Message to the Service Worker
      if (Object.keys(message) && Object.keys(message).length !== 0) {


        (async () => {
          const response = await chrome.runtime.sendMessage(message);
        })();
      }
    }
  }
};

// TODO: Move to utils
/**
 * Session Storage -
 * @constructor
 * @param {string} dataLabel - the label of the data being passed
 * @param {number|boolean} dataValue - the data itself
 * @param {string} action - update, add, subtract
 * @param {string} storageName - the session data
 */

const saveSessionData = (dataLabel, dataValue, action = "update", storageName = "jitsi-enhancer-emojis") => {
  let sessionData = {};

  if (!sessionStorage.getItem(storageName)) {
    // create the item
    sessionStorage.setItem(storageName, JSON.stringify(sessionData));
  }

  // 1 - get the item & unstringify
  sessionData = JSON.parse(sessionStorage.getItem(storageName));

  // 2 - see if the item exists
  if (sessionData[dataLabel]) {
    switch (action) {
      case "update":
        sessionData[dataLabel] = dataValue;
        break;
      case "add":
        sessionData[dataLabel] += dataValue;
        break;
      case "subtract":
        sessionData[dataLabel] -= dataValue;
        break;
    }
  } else {
    sessionData[dataLabel] = dataValue;
  }

  // 3 - count how many times this has occured if it's emojis/commands
  if (storageName === "jitsi-enhancer-emojis") {
    // zero out the total the count
    sessionData["emojiCount"] = 0;

    // Add to the total
    // TODO: too heavy? Maybe just use a regular ++?
    sessionData["emojiCount"] = Object.values(sessionData).reduce((a, b) => a + b, 0);
  }

  // 4 - rebuild the item
  sessionStorage.setItem(storageName, JSON.stringify(sessionData));
};

// TODO: Move to utils.js
// yoink: https://dev.to/soorajsnblaze333/generic-snippets-dom-element-creation-3go9
const createElement = ({ type, styles, attributes, props, eventHandlers, appendTo }) => {
  let elementType = type || "div";
  let elementStyles = styles || {};
  let elementAttributes = attributes || {};
  let elementProps = props || {};
  let elementEventHandlers = eventHandlers || {};
  let elementAppendTo = appendTo || "body";

  let element = document.createElement(elementType);
  for (let key in elementStyles) {
    element.style[key] = elementStyles[key];
  }
  for (let key in elementAttributes) {
    element.setAttribute(key, elementAttributes[key]);
  }
  for (let key in elementProps) {
    element[key] = elementProps[key];
  }
  for (let key in elementEventHandlers) {
    element.addEventListener(key, elementEventHandlers[key]);
  }
  document.querySelector(elementAppendTo).append(element);
  return element;
};

// TODO: Move this to actions
const isPartyMode = (sessionValue, threshold = 11) => {
  if (!sessionStorage.getItem("jitsi-enhancer-emojis")) return;

  // 1 - find the item
  const session = JSON.parse(sessionStorage.getItem("jitsi-enhancer-emojis"));
  // const threshold = 11;

  // console.log("session[sessionValue]", session[sessionValue])
  // 2 - if there's 11, 22... etc... PARTY MODE
  return session[sessionValue] % threshold === 0;
};

const createFireworks = (length = 1) => {
  const videoWindow = document.querySelector("#jitsi-enhance-animation-container");

  if (!videoWindow) return;

  // Make this shape
  // <div class="pyro">
  //   <div class="before"></div>
  //   <div class="after"></div>
  // </div>

  // make parent
  const fireworksParentID = `firework-id-${Date.now()}`;
  const fireworksParent = createElement({
    type: "div",
    attributes: {
      class: "pyro",
      id: fireworksParentID,
    },
    appendTo: `#${videoWindow.id}`,
  });

  // make children
  const fireworksBefore = createElement({
    type: "div",
    attributes: {
      class: "before",
    },
    appendTo: `#${fireworksParentID}`,
  });
  const fireworksAfter = createElement({
    type: "div",
    attributes: {
      class: "after",
    },
    appendTo: `#${fireworksParentID}`,
  });

  // destroy the element after X seconds
  setTimeout(() => {
    fireworksParent.remove();
  }, length * 1000);
};

const createFloatingEmoji = (animationEmoji, length = 4) => {
  const videoWindow = document.querySelector("#jitsi-enhance-animation-container");

  if (!videoWindow) return;

  // create a visual UI element
  // TODO: refactor using the createElement function
  const emojiElement = document.createElement("div");
  const emojiElementID = `emoji-id-${Math.random()}`; // TODO: Poor Man's ID generator

  emojiElement.setAttribute("id", emojiElementID);
  emojiElement.classList.add("jitsi-enhance-animation-emoji");
  emojiElement.innerText = animationEmoji;

  videoWindow.append(emojiElement);

  // randomize the element
  const element = document.getElementById(emojiElementID);
  const numbers = [-75, -60, -45, -30, -15, 15, 30, 45, 60, 75];
  const number = numbers[Math.floor(Math.random() * numbers.length)];
  element.style.setProperty("--emoji-rotation", `${number}deg`);

  // TODO: would be nice to destroy it after animation is over
  // destroy the element after 4 seconds
  setTimeout(() => {
    element.remove();
  }, length * 1000);
};

const createSuperText = (content, length = 5) => {
  const videoWindow = document.querySelector("#jitsi-enhance-animation-container");

  if (!videoWindow) return;

  const Text = createElement({
    type: "p",
    attributes: {
      class: "super-text",
    },
    props: {
      innerText: content,
    },
    appendTo: `#${videoWindow.id}`,
  });

  setTimeout(() => {
    Text.remove();
  }, length * 1000);
};

// TODO: This is too 'coupled'? Or maybe the name doesn't make sense
// Actions -> get content, create emoji effects, save sessions, create serviceWorker message.
const generateServiceWorkerMsg = (theEmoji, sfxName, sfxLength = 4, content = null) => {
  // console.log(`contains ${sfxName}`);

  // Count how many there are
  const regex = new RegExp(theEmoji, "g");
  const count = content ? (content.match(regex) || []).length : 1;

  // 1 - If it's an emoji - Show the emoji floating from the bottom
  if (theEmoji && content) {
    // isPartyMode
    if (isPartyMode("emojiCount", 11)) {
      console.log("It's PARTY MODE");
      createSuperText("OH YEAAAAAAH!!!", 4);
      createFireworks(4); // TODO: Do something better with this
    }

    for (let i = 0; i < count; i++) {
      console.log("Count: ", i);
      // setTimeout(createFloatingEmoji(theEmoji), i * 500); // TODO: Performance goof?
      createFloatingEmoji(theEmoji); // TODO: Performance goof?
    }
  }

  // 2 - sessionStorage of the event
  saveSessionData(sfxName, count, "add");

  // 3 - return the Object
  return {
    sfx: sfxName,
    sfxLength: sfxLength,
    sfxVolume: document.querySelector('#volume-slider').value / 100
  };
};




// TODO: Move the Init and Release functions to it's own file
const init = () => {
  console.log("initializing");
  console.clear(); // TODO: Figure out a better way to do this

  /* Save Sessions */
  // TODO: Have it count all the previous messages and automatically track that.

  // if (!sessionStorage.getItem("jitsi-enhancer")) {
  //   sessionStorage.setItem("jitsi-enhancer", "ready");
  // }

  /* Inject CSS */
  const videoWindow = document.querySelector("#videospace");

  if (videoWindow) {
    // create a wrapper

    const getAnimationContainer = document.querySelector("#jitsi-enhance-animation-container");
    if (!getAnimationContainer) {
      // TODO: Rebuild using the util function
      const animationContainer = document.createElement("div");
      animationContainer.setAttribute("id", "jitsi-enhance-animation-container");

      // create a fieldset and legend for text
      const animationContainerFieldset = document.createElement("fieldset");
      const animationContainerFieldsetLegend = document.createElement("legend");
      animationContainerFieldsetLegend.innerText = "JITSI ENHANCED";
      animationContainerFieldset.append(animationContainerFieldsetLegend);
      animationContainer.append(animationContainerFieldset);

      // create a volume slider
      const volumeSlider = document.createElement('input');
      volumeSlider.setAttribute('type', 'range');
      volumeSlider.setAttribute('id', 'volume-slider');
      animationContainerFieldset.append(volumeSlider);

      // attach everything together
      videoWindow.prepend(animationContainer);
    }
  } else {
    console.error("Chrome Extension: Can't find the videoContainer");
    return; // early exit
  }

  /* Find the chat */
  let chatWindow = document.querySelector("#chatconversation");

  if (!chatWindow) {
    console.info("Chrome Extension: Can't find the chatWindow");

    // find the chat button
    const chatButton = document.querySelector(".toolbar-button-with-badge").firstChild;
    chatButton.click();

    // If that doesn't work: https://stackoverflow.com/a/70695934/4096078
    // chatButton.dispatchEvent( new MouseEvent( 'mousedown' ) );
    // chatButton.dispatchEvent( new MouseEvent( 'click' ) );
    // chatButton.dispatchEvent( new MouseEvent( 'mouseup' ) );
    chatWindow = document.querySelector("#chatconversation");
    chatWindow
      ? console.info("Chrome Extension: found it now!")
      : console.info("Chrome Extension: still can't find it?");
  }

  /* Engage the Observer */
  const options = {
    attributes: true,
    childList: true,
    subtree: true,
    characterDataOldValue: true,
  };
  OBSERVER.observe(chatWindow, options);
};

// TODO: This is hacky and should be integrated into the init script?
const release = () => {
  
  console.log("releasing elements")
  // 1 - get rid of added stuff
  const getAnimationContainer = document.querySelector("#jitsi-enhance-animation-container");
  if (getAnimationContainer) {
    getAnimationContainer.remove();
  }

  // 2 - get rid of sound injection thing
  OBSERVER.disconnect();
}


// Initiate the Observer
// TODO: Move this higher? Or somewhere else?
const OBSERVER = new MutationObserver(chatCallback);



/* 
 * SERVICE WORKER LISTENER
 * Recieve messages from the Service Worker
 * https://developer.chrome.com/docs/extensions/mv3/messaging/
 */
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  // console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");

  if (request.enableExtension === "enable") {
    console.log("RECIEVED: I have been told to enable the extension!");
    // run the initalization
    init();

    // sendResponse({ farewell: "goodbye" });
  } else if (request.enableExtension === "disable") {
    console.log("RECIEVED: I have been told to disable the extension!");
    // Clean up!
    release();
  }
});
