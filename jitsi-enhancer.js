/**
 *
 * The Embedded Javascript
 * Console messages show up in the Page Devtools
 *
 */
const SCRIPT_DEBUG = true;

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

      //   SCRIPT_DEBUG && childElement
      //     ? console.log(childElement)
      //     : console.log("no childElement was returned");
      //   SCRIPT_DEBUG && childText
      //     ? console.dir(childText)
      //     : console.log("no childText was returned");
      //   SCRIPT_DEBUG && wholeText
      //     ? console.dir(wholeText)
      //     : console.log("no wholeText was returned");

      // TODO: Crazy Regex for Emoji checker?
      // https://stackoverflow.com/a/64007175/4096078

      // 1 - if text is valid
      let message = {};

      // 2 - build the thing
      // first row
      // TODO: would be nice to migrate this somewhere else

      // SLASH COMMANDS
      if (wholeText.trim() === "/tracey") {
        console.log("I see a tracey!");
        message = generateServiceWorkerMsg(false, "traceySlash", 2);
      }
      if (wholeText.trim() === "/audienceClap") {
        console.log("I see a audienceClap!");
        // 10 seconds
        message = generateServiceWorkerMsg(false, "audienceClapSlash", 10);
      }
      if (wholeText.trim() === "/bgJazz") {
        console.log("I see a bgJazz!");
        // 1:17 seconds
        message = generateServiceWorkerMsg(false, "bgJazzSlash", 77);
      }
      if (wholeText.trim() === "/yeah") {
        console.log("I see a yeah!");
        // 8 seconds
        message = generateServiceWorkerMsg(false, "yeahSlash", 8);
      }

      // EMOJI COMMANDS
      if (wholeText.includes("😃")) {
        message = generateServiceWorkerMsg("😃", "happyEmoji", 1);
      }
      if (wholeText.includes("😦")) {
        message = generateServiceWorkerMsg("😦", "panicEmoji", 1);
      }
      if (wholeText.includes("😄")) {
        message = generateServiceWorkerMsg("😄", "laughEmoji", 1);
      }
      if (wholeText.includes("👍")) {
        message = generateServiceWorkerMsg("👍", "thumbsupEmoji", 1);
      }
      if (wholeText.includes("😛")) {
        message = generateServiceWorkerMsg("😛", "tongueEmoji", 1);
      }
      if (wholeText.includes("👋")) {
        message = generateServiceWorkerMsg("👋", "waveEmoji", 4);
      }
      if (wholeText.includes("😊")) {
        message = generateServiceWorkerMsg("😊", "blushEmoji", 3);
      }

      // second row
      if (wholeText.includes("🙂")) {
        message = generateServiceWorkerMsg("🙂", "smileEmoji", 1);
      }
      if (wholeText.includes("😱")) {
        message = generateServiceWorkerMsg("😱", "screamEmoji", 1);
      }

      if (wholeText.includes("😗")) {
        message = generateServiceWorkerMsg("😗", "woopsEmoji", 1);
      }
      if (wholeText.includes("👎")) {
        message = generateServiceWorkerMsg("👎", "thumbsdownEmoji", 1);
      }

      if (wholeText.includes("🔍")) {
        message = generateServiceWorkerMsg("🔍", "searchEmoji", 1);
      }

      if (wholeText.includes("❤️")) {
        message = generateServiceWorkerMsg("❤️", "loveEmoji", 1);
      }

      if (wholeText.includes("😇")) {
        message = generateServiceWorkerMsg("😇", "angelEmoji", 2);
      }

      // third row
      if (wholeText.includes("😠")) {
        message = generateServiceWorkerMsg("😠", "annoyedEmoji", 1);
      }
      if (wholeText.includes("👼")) {
        message = generateServiceWorkerMsg("👼", "angelbabyEmoji", 1);
      }
      if (wholeText.includes("😭")) {
        message = generateServiceWorkerMsg("😭", "cryingEmoji", 1);
      }
      if (wholeText.includes("👏")) {
        message = generateServiceWorkerMsg("👏", "clapEmoji", 4);
      }
      if (wholeText.includes("😉")) {
        message = generateServiceWorkerMsg("😉", "winkEmoji", 1);
      }
      if (wholeText.includes("🍺")) {
        message = generateServiceWorkerMsg("🍺", "beerEmoji", 1);
      }

      // 3 - send the thing
      //   if (SCRIPT_DEBUG) {
      //     console.log("The Message?");
      //     console.log(message);
      //     console.log(Object.keys(message).length !== 0);
      //   }
      if (Object.keys(message).length !== 0) {
        // if (SCRIPT_DEBUG) console.log("Sending Message:");

        (async () => {
          const response = await chrome.runtime.sendMessage(message);
        })();
      }
    }
  }
};

// function that generates things
// TODO: Rename this
const generateServiceWorkerMsg = (theEmoji, sfxName, sfxLength = 4) => {
  if (SCRIPT_DEBUG) console.log(`contains ${sfxName}`);

  // 1 - Show the emoji floating from the bottom
  const videoWindow = document.querySelector(
    "#jitsi-enhance-animation-container"
  );

  // If it's an emoji, make an image
  if (videoWindow && theEmoji) {
    // create a visual UI element
    const emojiElement = document.createElement("div");
    const emojiElementID = `emoji-id-${Date.now()}`; // TODO: Poor Man's ID generator

    emojiElement.setAttribute("id", emojiElementID);
    emojiElement.classList.add("jitsi-enhance-animation-emoji");
    emojiElement.innerText = theEmoji;

    videoWindow.append(emojiElement);

    // randomize the element
    const element = document.getElementById(emojiElementID);
    const numbers = [-75, -60, -45, -30, -15, 15, 30, 45, 60, 75];
    const number = numbers[Math.floor(Math.random() * numbers.length)];
    element.style.setProperty("--emoji-rotation", `${number}deg`);

    console.log("number", number);
    // TODO: would be nice to destroy it after animation is over
    // destroy the element after 4 seconds
    setTimeout(() => {
      element.remove();
      if (SCRIPT_DEBUG) console.log(`Element destroyed`);
    }, 4000);
  }

  // return the Object
  return {
    sfx: sfxName,
    sfxLength: sfxLength,
  };
};

function init() {
  console.log("initializing");
  if (SCRIPT_DEBUG) console.clear();

  /* Save Sessions */
  if (!sessionStorage.getItem("jitsi-enhancer")) {
    sessionStorage.setItem("jitsi-enhancer", "ready");
  }

  /* Inject CSS */
  const videoWindow = document.querySelector("#videospace");

  if (videoWindow) {
    // create a wrapper
    const animationContainer = document.createElement("div");
    animationContainer.setAttribute("id", "jitsi-enhance-animation-container");

    // create a fieldset and legend for text
    const animationContainerFieldset = document.createElement("fieldset");
    const animationContainerFieldsetLegend = document.createElement("legend");
    animationContainerFieldsetLegend.innerText = "JITSI ENHANCED";
    animationContainerFieldset.append(animationContainerFieldsetLegend);
    animationContainer.append(animationContainerFieldset);

    // attach everything together
    videoWindow.prepend(animationContainer);
  } else {
    console.error("Chrome Extension: Can't find the videoContainer");
    return; // early exit
  }

  /* Find the chat */
  let chatWindow = document.querySelector("#chatconversation");

  if (!chatWindow) {
    console.info("Chrome Extension: Can't find the chatWindow");

    // find the chat button
    const chatButton = document.querySelector(
      ".toolbar-button-with-badge"
    ).firstChild;
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

  // TODO: Import in here would be nice.

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

// run the initalization
init();
