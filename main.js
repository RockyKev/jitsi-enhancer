

function init() {
  console.log("initializing");
  console.clear();
  const chatWindow = document.querySelector("#chatconversation");

  function playSFX(name) {
    const sfxList = {
      thumbsUp: "oh we're clappin",
      weScream: "oh we're cheerin",
      boo: "oh we're booin'",
    };
    console.log("we're inside playSFX", name);
    console.log(typeof name);
  
    // check if the name is here
    if (!Object.hasOwn(sfxList, name)) {
      console.error("This sfx doesn't exist");
      return;
    }
  
    // const musicSource = "https://github.com/RockyKev/teatime-with-rocky/blob/241fcc4fcf6f4b65a0de1b63c68051abed938cdf/a-jazz-piano-110481.mp3?raw=true";
    // const musicElement = new Audio(musicSource);
    // musicElement.play();
    // musicElement.volume = 0.55;
  
    return sfxList[name];
  }

  function chatCallback(mutations) {
    console.log(mutations);
  
    for (let mutation of mutations) {
 
      if (mutation.type === "childList" && mutation.addedNodes[0]) {
        console.log("A child node has been added");
  
        // Get the new added node
        // [0] is a timestamp. [1] is the added
        const childElement = mutation.addedNodes[0];
        const childText = childElement.querySelector('.usermessage');
        // const wholeText = childText.lastChild.wholeText;
        const wholeText = childText.innerText;

        if (!childElement || !childText) {
          console.warning("none was returned");
          return
        }
        // const childText = childElement.querySelector('span')
        (childElement) ? console.log(childElement) : console.log("no childElement was returned");
        (childText) ? console.dir(childText) : console.log("no childText was returned");
        (wholeText) ? console.dir(wholeText) : console.log("no wholeText was returned");


        // TODO: Crazy Regex for Emoji checker?
        // https://stackoverflow.com/a/64007175/4096078

        if (wholeText.includes('👍')) {
          console.log("contains thumbs up")
          playSFX('thumbsUp');
        } 
        
        if (wholeText.includes('😱')) {
          playSFX('weScream');
        } 

        // if (child === "clap") {
        //   console.log(child);
        //   console.log(playSFX(child));
        // }
        // console.log(child)
      }
    }
  }

  const observer = new MutationObserver(chatCallback);
  const options = {
    attributes: true,
    childList: true,
    subtree: true,
    characterDataOldValue: true
  }

  observer.observe(chatWindow, options);

  console.log(chatWindow);
}


// Badge Init
chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({
    text: "OFF",
  });
});

const meetings = "https://meet.jit.si/";

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
