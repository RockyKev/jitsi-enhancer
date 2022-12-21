# Jitsi Enhancer

This enhances Jitsi to add sfx to emojis, and more. (please clap)

## How to use

1. Install this by downloading the zip file and unpacking it, or use the [Official Chrome Store](https://chrome.google.com/webstore/detail/jitsi-enhancer/dmgjnkmnphhfphojhcmhmomkmfbpbdbj). 

2. Pin the Extension on your toolbar for easy access.

![](./images/readme-pin-it.png)

3. When visiting a jitsi meeting (or self-hosted jitsi meeting), activate the extension.

![](./images/readme-activate.png)

4. You can use emojis. You can also use a few slash commands.

For example:
```
/audienceClap
```

5. Most importantly, have fun!

## TODO 

### 0.6 Soundgarden

- [x] Fix generic icon
- [x] set up multiple sfx for 5 things
- [x] set up multiple sfx for all the things
- [x] change popup to sfx
- [x] get animated CSS when button is clicked
- [x] Add debugger

### 0.7 Weezer
- [x] Queue multiple sound effects
- [x] have the chat load when you turn it on
- [x] fix the CSS so it's shown as on
- [x] Fix icon for popup
- [x] Add easter eggs
- [x] update/disable hotkey
- [x] animated emoji spin
- [x] rename project
- [x] publish on store (with a custom account)


### 0.8 Pearl Jam
- [x] restructure and use import statements https://developer.chrome.com/docs/extensions/reference/scripting/#files
- [x] update readme and improve documentation
- [x] Test on Mac
- [x] separate service worker and background file
- [x] Fix time function - refactor generateSuccessful
- [x] container screen full, you can’t full screen tiles.
- [x] What about emoji’s in the name? - update: no issues


### 0.9 Red Hot Chili Peppers
- [ ] add super animation when event it clicked X times.
- [ ] Add a tracker of how many emojis were clicked.
- [ ] Add twitch-style 'crazy border' when something happens
- [ ] unhook if there's an accident. 
- [ ] Only create one "jitsi-extend-animation-container"
- [ ] Keep it active even without chat window
- [ ] Add a global variable to set it so only one sfx at a time.
 
### 1.0 Green Day
- [ ] Release

## Unknowns
1 - What happens when multiple emojis are in the same sentence?
3 - If you load the extension before the chat, it causes an error. 
4 - what happens when you hit it on the intro screen?
[ ] [vite build](https://github.com/StarkShang/vite-plugin-chrome-extension)
[ ] turning it off doesn’t unhook things?

## Unorganized
1 - Set it up so animation doesn't play if you're not paying attention to the screen.
2 - Session counter to see counts of things
3 - Multi tap
4 - Typescript?
5 - Can't unload script if you disable? Figure out a [solution to turn off](https://stackoverflow.com/questions/18477910/chrome-extension-how-to-remove-content-script-after-injection). Maybe [move to manifest?](https://github.com/fregante/webext-dynamic-content-scripts/blob/main/how-to-add-github-enterprise-support-to-web-extensions.md)

## References
https://jitsi.github.io/handbook/docs/dev-guide/dev-guide-iframe/

     
## Screenshot
![screenshot](./images/screenshot.png)


## Attribution

<a href="https://www.flaticon.com/free-icons/girl" title="girl icons">Girl icons created by Freepik - Flaticon</a>

Sound Effect from <a href="https://pixabay.com/sound-effects/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=music&amp;utm_content=6185">Pixabay</a>

Additional sound effects from https://www.zapsplat.com