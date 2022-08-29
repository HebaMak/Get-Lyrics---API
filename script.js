//variables
const form = document.getElementById('form');
const search = document.getElementById('search');
const result = document.getElementById('result');
const lyrixContainer = document.getElementById('lyricsContainer');

const apiURL = 'https://api.lyrics.ovh'

//get input value
form.addEventListener('submit' , e => {
  e.preventDefault();
  
  let searchValue = search.value.trim();
  
  if(!searchValue) {
    alert ("Nothing to search")
  } else {
    beginSearch(searchValue)
  }
})

//create search function
async function beginSearch(searchValue) {
  const searchResult = await fetch(`${apiURL}/suggest/${searchValue}`);
  const data = await searchResult.json();
  // console.log(data)
  displayData(data);
}

//display search results
function displayData(data) {
  result.innerHTML = `
    <ul class='songs'>
      <span class='closeResult' id='closeResult'>X</span>
      ${data.data.map(song =>
        `<li>
            <div>
              <strong>${song.artist.name}</strong> - ${song.title}
            </div>
            <span data-artist="${song.artist.name}" data-songtitle="${song.title}">Get Lyrics</span>
          </li>`).join()
      }
    </ul>
  `
}

//clear results and clear input
result.addEventListener('click' , e => {
  const closeResult = e.target;

  //check close button
  if(closeResult.tagName === 'SPAN' && closeResult.id === 'closeResult') {
    result.innerHTML = '<p>Enter Song or Artiste in the field above</p>'
    search.value = ''
  }
})


//get lyrics function
result.addEventListener('click' , e => {
  const clickedElement = e.target;

  //check get lyrics button
  if(clickedElement.tagName === 'SPAN') {
    const artist = clickedElement.getAttribute('data-artist');
    const songTitle = clickedElement.getAttribute('data-songtitle');  

    getLyrics(artist , songTitle);
  }
})

//create getLyrics functon
async function getLyrics(artist , songTitle) {
  const response = await fetch(`${apiURL}/v1/${artist}/${songTitle}`);
  const data = await response.json();
  

  // result.innerHTML = `<h2><stron>${artist}</stron> - ${songTitle}</h2>
  //                     <p>${lyrics}</p>`;

  if(data.lyrics) {
    const lyrics = data.lyrics.replace( /(\r\n|\r|\n)/g , '<br>');
    lyrixContainer.style.display='block'
    lyrixContainer.innerHTML = `<span class='closeLyrics' id='closeLyrics'>X</span>
                    <h2><stron>${artist}</stron> - ${songTitle}</h2>
                    <p>${lyrics}</p>`;
    
  } else {
    lyrixContainer.style.display='block'
    lyrixContainer.innerHTML = `<span class='closeLyrics' id='closeLyrics'>X</span>
                    <h2>No Lyrics Found</h2>`;
  }
  
}

//clear lyrics
lyrixContainer.addEventListener('click' , e => {
  const closeResult = e.target;

  //check close button
  if(closeResult.tagName === 'SPAN' && closeResult.id === 'closeLyrics') {
    lyrixContainer.style.display='none'
  }
})



/*
  why use this code replace( /(\r\n|\r|\n)/g, '<br>')
  Linux uses \n for a new-line, 
  Windows \r\n and old Macs \r. 
  So there are multiple ways to write a newline. 
  Your second tool (RegExr) does for example match on the single \r.

  [\r\n]+ as Ilya suggested will work, 
  but will also match multiple consecutive new-lines. 
  so
  (\r\n|\r|\n) is more correct
*/