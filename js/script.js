let app = {};

//init method that holds code that runs upon initializing the app (all the way below)
app.init = () => {
  //fetch data using 'toronto' as keyword in paramater of API request as starting point
  app.fetchData('toronto');

  //create on click event when user clicks search button
  document.querySelector('#button').addEventListener('click', () => {
    //clear all content before fetching new data
    document.getElementById('renderphoto').innerHTML = '';
    //get user input and use value as paramater to fetch data
    const keyword = document.querySelector('#userKeyword').value;
    //console.log(keyword);
    app.fetchData(keyword);
  });

  //create keypress event when user clicks hits enter
  document.querySelector('#userKeyword').addEventListener('keydown', (e) => {
    if (e.keyCode === 13) {
      //clear all content before fetching new data
      document.getElementById('renderphoto').innerHTML = '';

      //get user input and use value as paramater to fetch data
      const keyword = document.querySelector('#userKeyword').value;
      //console.log(keyword);
      app.fetchData(keyword);
    };
  });
};

//method to fetch data, called after app initializes
app.fetchData = (query) => {
  //separate different parts of API URL with paramaters into variables
  const consumerKey = 'SIwRLq0AwiEydJeCT8NLk3chVNyEMgweH52bQVx5';
  const baseURL = 'https://api.500px.com/v1/';
  const photoURL = 'photos/search';
  const geo = '43.653226,-79.383184,50km';

  //fetch data
  fetch(`${baseURL}${photoURL}?consumer_key=${consumerKey}&term=${query}&geo=${geo}`)
    //convert data to JSON
    .then( response => response.json() )
    //use JSON data to call on method that displays images in browser
    .then( jsonData => {
      //console.log(jsonData);
      app.displayImg(jsonData);
    });
};

//method to display images in browser, called after fetching data
app.displayImg = (data) => {
  //get array of photos from JSON data
  const photoArray = data.photos;
  //loop over photo array
  photoArray.map( photoObj => {
    //call on function to render photos onto DOM by using the fetched photo array and an element in the DOM as paramaters
    app.renderPhoto(photoObj,'renderphoto')
  });
}

//create function that renders photo from array onto DOM
app.renderPhoto = (photo, elementId) => {
  //get image id
  id = photo.id;

  //create element for image
  const image_url = photo.image_url;
  const img = document.createElement('img');
  img.setAttribute('src',image_url);
  img.setAttribute('class','image');
  img.setAttribute('id',`image-${id}`);

  //create element for image title and artist
  const name = photo.name;
  const artist = photo.user.fullname;
  const title = document.createElement('h2');
  const titleText = document.createTextNode(`${name} by ${artist}`);
  title.appendChild(titleText);
  title.setAttribute('class','title');
  title.setAttribute('id',`title-${id}`);

  //create element for image description
  const imgDescription = photo.description;
  const description = document.createElement('p');
  const descriptionText = document.createTextNode(imgDescription);
  description.appendChild(descriptionText);
  description.setAttribute('class','description');
  description.setAttribute('id',`description-${id}`);

  //create element for image artist's country
  const country = photo.user.country;
  const location = document.createElement('h3');
  const locationText = document.createTextNode(country);
  location.appendChild(locationText);
  location.setAttribute('class','location');
  location.setAttribute('id',`location-${id}`);

  //create element for image views
  const imgViews = photo.times_viewed;
  const views = document.createElement('h3');
  const viewsText = document.createTextNode(`Views: ${imgViews}`);
  views.appendChild(viewsText);
  views.setAttribute('class','views');
  views.setAttribute('id',`views-${id}`);

  //create element for info container's escape button
  const esc = document.createElement('button');
  const escText = document.createTextNode('✖');
  esc.appendChild(escText);
  esc.setAttribute('class','esc');
  esc.setAttribute('id',`esc-${id}`);

  //create container for image info, to be displayed on click event
  const infoContainer = document.createElement('div');
  infoContainer.append(title, description, location, views, esc);
  infoContainer.setAttribute('style','display:none');
  infoContainer.setAttribute('class','info');
  infoContainer.setAttribute('id',`info-${id}`)

  //create main container for image and info (info hidden until click event)
  const mainContainer = document.createElement('div');
  mainContainer.append(img, infoContainer);
  mainContainer.setAttribute('class','container');
  mainContainer.setAttribute('id',id);

  //add main container with image and info to DOM
  document.getElementById(elementId).appendChild(mainContainer);

  //create event listener to remove info container when esc button is clicked
  document.getElementById(`esc-${id}`).addEventListener('click', (target) => {
    const hideInfo = target.path[1];
    hideInfo.setAttribute('style','display:none');
  });

  //creaet event listener to display info container when image is clicked
  document.getElementById(id).addEventListener('click', (target) => {
    const displayInfo = target.path[1].getElementsByClassName('info')[0]
    //console.log(displayInfo)
    displayInfo.setAttribute('style','display:block');
  });
}

//start the app!
app.init();
