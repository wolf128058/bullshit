const cells = 24;

function loadWords() {
    let bullshits = words.split("\n")
						 .filter(word => word.length > 0)
						 .map(word => word.trim());

    let randomizedWords = randomize(bullshits);
    let counter = 0;
    while (counter < cells) {
        document.getElementById('cell' + counter++).innerHTML = '<span class="word">' + randomizedWords.pop() + '</span>';
    }
}

function randomize(words) {
    let randomizedWords = [];
    let tempWords = words.slice();

    for (let i = 0; i < cells; i++) {
        let wordCount = tempWords.length;
        let randomIndex = Math.floor(Math.random() * wordCount);
        let randomWord = tempWords[randomIndex];
        randomizedWords.push(randomWord);
        tempWords.splice(randomIndex, 1);

        if (tempWords.length === 0) {
            tempWords = words.slice();
        }
    }

    return randomizedWords;
}

function checkauth() {

    sessionStorage['client_id']  = '68zj11o3opi4yqpumocfub6lwhufb4';

    let loc_hash    = location.hash;
    let mytoken = loc_hash.match(/access_token=([0-9a-z]+)/);
    if(mytoken !== null && mytoken[1] !== null ) {
        sessionStorage['access_token']  = mytoken[1];
        checkStreamOnline('MichaelvonUllrichstein');
    } else {
        console.log('No Token no Twitchinfos!');
        let authurl = "https://id.twitch.tv/oauth2/authorize"
        authurl += "?response_type=token"
        authurl += "&client_id=" + sessionStorage['client_id'];
        authurl += "&redirect_uri="  + location.protocol + "//" + location.host + "/"
        window.location.replace(authurl);
    }

}

async function checkStreamOnline(streamerName) {
    try {
      const response = await fetch(`https://api.twitch.tv/helix/streams?user_login=${streamerName}`, {
        headers: {
          'Client-Id': sessionStorage['client_id'],
          'Authorization': "Bearer " + sessionStorage['access_token']
        }
      });

      const data = await response.json();

      if (data.data.length > 0) {
        link = document.createElement('a');
        link.setAttribute('href', 'https://twitch.tv/' + streamerName.toLowerCase());
        link.setAttribute('target', '_blank');
        link.textContent = streamerName + " ist online.";
        while (document.querySelector('.statusinfo').firstChild) {
            document.querySelector('.statusinfo').removeChild(document.querySelector('.statusinfo').firstChild)
        }
        document.querySelector('.statusinfo').appendChild(link);
        document.querySelector('.statusinfo').style.display = 'block';
        document.querySelector('.statusinfo').style.color = '#95FE30';
        return true;
      } else {
        document.querySelector('.statusinfo').textContent = streamerName + " ist offline.";
        document.querySelector('.statusinfo').style.display = 'block';
        document.querySelector('.statusinfo').style.color = '#FD0140';
        return false;
      }
    } catch (error) {
      console.error('Fehler beim Abrufen des Stream-Status:', error);
    }
  }
