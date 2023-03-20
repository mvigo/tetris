

// Fetch the search results for a specific artist from the Discogs API
async function fetchRecords(artist) {
  try {
    const response = await fetch(
      `https://api.discogs.com/database/search?q=${encodeURIComponent(artist)}&type=release&key=${CONSUMER_KEY}&secret=${CONSUMER_SECRET}`
    );
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching records data:', error);
  }
}

// Fetch the release details from the Discogs API
async function fetchRecordDetails(id) {
  try {
    const response = await fetch(
      `https://api.discogs.com/releases/${id}?key=${CONSUMER_KEY}&secret=${CONSUMER_SECRET}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching record details:', error);
  }
}

// Display records on the main page (index.html)
async function displayRecords() {
  const artist = 'The Beatles'; // Replace this with the desired artist
  const records = await fetchRecords(artist);
  const recordsSection = document.querySelector('.records');

  if (records && recordsSection) {
    records.forEach((record) => {
      const recordCard = `
        <article class="record">
          <h2>${record.title}</h2>
          <p>${record.year}</p>
          <p>${record.type}</p>
          <img src="${record.thumb}" alt="${record.title} album cover">
          <a href="record.html?id=${record.id}">View Details</a>
        </article>
      `;
      recordsSection.innerHTML += recordCard;
    });
  }
}

// Display record details on the record detail page (record.html)
async function displayRecordDetails() {
  const idParam = new URLSearchParams(window.location.search).get('id');
  const recordDetailsSection = document.querySelector('.record-details');

  if (idParam && recordDetailsSection) {
    const record = await fetchRecordDetails(idParam);

    if (record) {
      const trackList = record.tracklist
        .map((track) => `<li>${track.position} - ${track.title}</li>`)
        .join('');
      const recordDetails = `
        <h2>${record.title}</h2>
        <p>${record.artists[0].name}</p>
        <p>${record.genres.join(', ')}</p>
        <p>Release Date: ${record.released}</p>
        <img src="${record.images[0].uri}" alt="${record.title} album cover">
        <h3>Tracklist</h3>
        <ul>
          ${trackList}
        </ul>
      `;
      recordDetailsSection.innerHTML = recordDetails;
    }
  }
}

// Call the displayRecords and displayRecordDetails functions
displayRecords();
displayRecordDetails();
