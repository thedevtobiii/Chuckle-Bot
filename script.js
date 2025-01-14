const button = document.getElementById('button');
const audioElement = document.getElementById('audio');

const VoiceRSS = {
  speech: function (e) {
    this._validate(e);
    this._request(e);
  },
  _validate: function (e) {
    if (!e) throw "The settings are undefined";
    if (!e.key) throw "The API key is undefined";
    if (!e.src) throw "The text is undefined";
    if (!e.hl) throw "The language is undefined";
    if (e.c && "auto" != e.c.toLowerCase()) {
      var a = false;
      switch (e.c.toLowerCase()) {
        case "mp3":
          a = new Audio().canPlayType("audio/mpeg").replace("no", "");
          break;
        case "wav":
          a = new Audio().canPlayType("audio/wav").replace("no", "");
          break;
        case "aac":
          a = new Audio().canPlayType("audio/aac").replace("no", "");
          break;
        case "ogg":
          a = new Audio().canPlayType("audio/ogg").replace("no", "");
          break;
        case "caf":
          a = new Audio().canPlayType("audio/x-caf").replace("no", "");
      }
      if (!a) throw "The browser does not support the audio codec " + e.c;
    }
  },
  _request: function (e) {
    const a = this._buildRequest(e);
    const t = this._getXHR();
    t.onreadystatechange = function () {
      if (4 == t.readyState) {
        if (200 == t.status) {
          if (0 == t.responseText.indexOf("ERROR")) {
            console.error("VoiceRSS API Error:", t.responseText);
            return;
          }
          audioElement.src = t.responseText;
          audioElement.play();
        } else {
          console.error("HTTP Error:", t.status, t.statusText);
        }
      }
    };
    t.open("POST", "https://api.voicerss.org/", true);
    t.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
    t.send(a);
  },
  _buildRequest: function (e) {
    const a = e.c && "auto" != e.c.toLowerCase() ? e.c : this._detectCodec();
    return "key=" + (e.key || "") +
      "&src=" + (e.src || "") +
      "&hl=" + (e.hl || "") +
      "&r=" + (e.r || "") +
      "&c=" + (a || "") +
      "&f=" + (e.f || "") +
      "&ssml=" + (e.ssml || "") +
      "&b64=true";
  },
  _detectCodec: function () {
    const e = new Audio();
    return e.canPlayType("audio/mpeg").replace("no", "") ? "mp3" :
      e.canPlayType("audio/wav").replace("no", "") ? "wav" :
      e.canPlayType("audio/aac").replace("no", "") ? "aac" :
      e.canPlayType("audio/ogg").replace("no", "") ? "ogg" :
      e.canPlayType("audio/x-caf").replace("no", "") ? "caf" : "";
  },
  _getXHR: function () {
    try {
      return new XMLHttpRequest();
    } catch (e) {}
    throw "The browser does not support HTTP request";
  },
};


function toggleButton(){
  button.disabled = !button.disabled; 
}


//passing joke to voice rss api
function toggleButton() {
  button.disabled = !button.disabled;
}

// Passing joke to VoiceRSS API
function tellMe(joke) {
  console.log('Telling joke:', joke);
  VoiceRSS.speech({
    key: 'd059f30c8fa6459a8b7aa2434867fd94',
    src: joke,
    hl: 'en-us',
    v: 'Linda',
    r: 0,
    c: 'mp3',
    f: '44khz_16bit_stereo',
    ssml: false,
  });
}

// Get jokes from Joke API
async function getJokes() {
  let joke = '';
  const apiUrl = 'https://v2.jokeapi.dev/joke/Programming,Miscellaneous,Dark,Pun,Spooky,Christmas?blacklistFlags=religious,political,explicit';
  const jokeTextElement = document.getElementById('joke-text');

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    joke = data.setup ? `${data.setup}...${data.delivery}` : data.joke;
    jokeTextElement.innerText = joke;  
      

    // Tell the joke
    tellMe(joke);

    // Disable button while the joke is being told
    toggleButton();
  } catch (error) {
    console.error('Error fetching joke:', error);
  }
}

// Event Listeners
button.addEventListener('click', () => {
  getJokes();
});

audioElement.addEventListener('ended', toggleButton);
document.getElementById('audio').remove();  




