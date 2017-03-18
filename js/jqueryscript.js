let app = {};

//init method that holds code that runs upon initializing the app (all the way below)
app.init = () => {
  //fetch data using 'toronto' as keyword in paramater of API request as starting point
  app.fetchData('toronto');

  //create on click event when user clicks search button
  $('#button').on('click', () => {

    //clear all content before fetching new data
    $('#renderphoto').remove();

    //get user input and use value as paramater to fetch data
    const keyword = $('#userKeyword').val();
    app.fetchData(keyword);
  });
};

//method to fetch data, called after app initializes
app.fetchData = (query) => {
  //separate different parts of API URL with paramaters into variables
  const consumerKey = 'SIwRLq0AwiEydJeCT8NLk3chVNyEMgweH52bQVx5';
  const baseURL = 'https://api.500px.com/v1/'
  const photoURL = 'photos/search'

  //fetch data
  fetch(`${baseURL}${photoURL}?consumer_key=${consumerKey}&term=${query}`)
    //convert data to JSON
    .then( response => response.json() )
    //use JSON data to call on method that displays images in browser
    .then( jsonData => {
      app.displayImg(jsonData);
    });
};

//method to display images in browser, called after fetching data
app.displayImg = (data) => {
  //get array of photos from JSON data
  const photoArray = data.photos;

  //loop over photo array
  photoArray.map( photoObj => {
    //create function that renders photo from array onto DOM
    const renderPhoto = (photo, elementId) => {
      //get image id
      id = photo.id;
      //create elements for image its information, and escape button
      const img = $('<img>').attr('src',photo.image_url).addClass('image');
      const title = $('<h2>').text(photo.name + ' by ' + photo.user.fullname).attr('class','title');
      const description = $('<p>').append(photo.description).addClass('description');
      const location = $('<h3>').text(photo.user.country).addClass('location')
      const views = $('<h3>').text('Views: ' + photo.times_viewed).addClass('views')
      const esc = $('<button>').text('X').addClass('esc').attr('id',`esc-${id}`)

      //create container for image info, to be displayed on click event
      const infoContainer = $('<div>').attr('style','display:none').addClass('info').attr('id',`info-${id}`).append(title, description, location, views, esc);

      //create main container for image and info (info hidden until click event)
      const mainContainer = $('<div>').addClass('container').attr('id',id).append(img, infoContainer);

      //add main container with image and info to DOM
      $(elementId).append(mainContainer)

      //create event listener to remove info container when esc button is clicked
      $('.esc').on('click', () => {
        $(this).closest('.info').remove()
      });

      //creaet event listener to display info container when image is clicked
      $('.image').on('click', () => {
        $(this).next().removeAttr('style');
      });
    }
    //call on function to render photos onto DOM by using the fetched photo array and an element in the DOM as paramaters
    renderPhoto(photoObj,'#renderphoto')
  });
}

//start the app!
$( () => {
  app.init();
});
