// Store the JSON data
let jsonData = { videos: [] };

// Function to render video list items
function renderVideoItems() {
  const videoListElement = document.getElementById('video-list');
  videoListElement.innerHTML = '';

  jsonData.videos.forEach((video, index) => {
    const videoItem = document.createElement('div');
    videoItem.classList.add('video-item');

    const thumbnailAnchor = document.createElement('a');
    thumbnailAnchor.href = video.url;
    thumbnailAnchor.target = '_blank';

    const thumbnail = document.createElement('img');
    thumbnail.classList.add('video-thumbnail');
    thumbnail.src = video.thumbnail;
    thumbnail.alt = video.title;

    thumbnailAnchor.appendChild(thumbnail);

    const title = document.createElement('h3');
    title.classList.add('video-title');
    title.innerHTML = video.title;

    const removeButton = document.createElement('button');
    removeButton.classList.add('remove-button');
    removeButton.innerText = 'Remove';
    removeButton.addEventListener('click', () => {
      jsonData.videos.splice(index, 1);
      renderVideoItems();
    });

    videoItem.appendChild(thumbnailAnchor);
    videoItem.appendChild(title);
    videoItem.appendChild(removeButton);

    videoListElement.appendChild(videoItem);
  });
}

document.getElementById('loadDataButton').addEventListener('click', function () {
  // Get the JSON data from the text area
  const jsonDataString = document.getElementById('jsonData').value;

  try {
    // Parse the JSON data
    jsonData = JSON.parse(jsonDataString);

    // Render the video list items
    renderVideoItems();
  } catch (error) {
    console.error('Error parsing JSON data:', error);
  }
});

// Function to copy text to clipboard
function copyTextToClipboard(text) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand('copy');
  document.body.removeChild(textArea);
}

// Copy JSON data to the clipboard
document.getElementById('copyButton').addEventListener('click', function () {
  const jsonDataString = JSON.stringify(jsonData, null, 2);
  copyTextToClipboard(jsonDataString);
  alert('JSON data copied to clipboard:\n\n' + jsonDataString);
});
