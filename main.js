function init() {
  console.log("initializing");
  console.clear();
  const chatWindow = document.querySelector("#chatconversation");

  // function playSFX(name) {
  //   const sfxList = {
  //     thumbsUp: "oh we're clappin",
  //     weScream: "oh we're cheerin",
  //     boo: "oh we're booin'",
  //   };
  //   console.log("we're inside playSFX", name);
  //   console.log(typeof name);

  //   // check if the name is here
  //   if (!Object.hasOwn(sfxList, name)) {
  //     console.error("This sfx doesn't exist");
  //     return;
  //   }

  //   // const musicSource = "https://github.com/RockyKev/teatime-with-rocky/blob/241fcc4fcf6f4b65a0de1b63c68051abed938cdf/a-jazz-piano-110481.mp3?raw=true";
  //   // const musicElement = new Audio(musicSource);
  //   // musicElement.play();
  //   // musicElement.volume = 0.55;

  //   return sfxList[name];
  // }

  function chatCallback(mutations) {
    console.log(mutations);

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
        // (childElement) ? console.log(childElement) : console.log("no childElement was returned");
        // (childText) ? console.dir(childText) : console.log("no childText was returned");
        // (wholeText) ? console.dir(wholeText) : console.log("no wholeText was returned");

        // TODO: Crazy Regex for Emoji checker?
        // https://stackoverflow.com/a/64007175/4096078

        if (wholeText.includes("👍")) {
          console.log("contains thumbs up");
          console.log(chrome);

          (async () => {
            const response = await chrome.runtime.sendMessage({
              greeting: "hello",
            });
          })();

        }

        if (wholeText.includes("😱")) {
          console.log("contains scream");
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
function playSound(volume = 0.5, src = "audio/ff-victory.mp3", length = 4) {
  let url = chrome.runtime.getURL("audio.html");

  // set this string dynamically in your code, this is just an example
  // this will play success.wav at half the volume and close the popup after a second
  url += `?volume=${volume}&src=${src}&length=${length * 1000}`;

  console.log("building the query string")
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

// Chrome Extension Init
chrome.action.onClicked.addListener(async (tab) => {
  console.log("event listener started");

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
  console.log("I have recieved a request")
  console.log(
    sender.tab
      ? "from a content script:" + sender.tab.url
      : "from the extension"
  );

  console.log(request);


  if (request.greeting === "hello") {
          playSound(1);
        console.log("sound played");
  };
  console.groupEnd();

});
