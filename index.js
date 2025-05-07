import * as Carousel from "./Carousel.js";
import axios from "axios";

// The breed selection input element.
const breedSelect = document.getElementById("breedSelect");
// The information section div element.
const infoDump = document.getElementById("infoDump");
// The progress bar div element.
const progressBar = document.getElementById("progressBar");
// The get favourites button element.
const getFavouritesBtn = document.getElementById("getFavouritesBtn");

// Step 0: Store your API key here for reference and easy access.
const API_KEY =
  "live_cSyFCeIm9VPsdB2AGK49DMYyxK1xgTN0c0vng18WcBrg8GkJNeaHNIULdVzxg9G8"; // Use ? API URL/KEY

// 1. Create an async function "initialLoad"
async function initialLoad() {
  try {
    // Retrieve a list of breeds from the cat API using fetch().
    const response = await fetch("https://api.thecatapi.com/v1/breeds", {
      headers: {
        "x-api-key": API_KEY,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const breeds = await response.json();
    breeds.forEach((breed) => {
      // Create an <option> element for each breed,
      const option = document.createElement("option");
      // Each option should have a value attribute equal to the id of the breed.
      option.value = breed.id;
      // Each option should display text equal to the name of the breed
      option.textContent = breed.name;
      // append each <option> element to 'breedSelect'
      breedSelect.appendChild(option);
    });
  } catch (error) {
    console.error("Could not load cat breeds:", error);
    // Display an error message in the dropdown menu
    breedSelect.innerHTML = "<option>Error loading breeds</option>";
  }
  // Call handleSelect here to create the initial carousel.
  handleSelect();
}
// Execute initialLoad() immediately
initialLoad();

// function for breedSelect event listener
async function handleSelect() {
  try {
    let selectedBreedID = breedSelect.value;

    // Retrieve information on the selected breed from the cat API using fetch().
    const response = await fetch(
      `https://api.thecatapi.com/v1/images/search?limit=5&breed_ids=${selectedBreedID}&api_key=${API_KEY}&has_breeds=1`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const breedData = await response.json();
    // Log response body text to the console to ensure the request is receiving multiple array items
    console.log(breedData);

    // Clear the Carousel
    Carousel.clear();

    // Use the other data you have been given to create an informational section within the infoDump element.
    // heading of list that will display links to the images in the carousel
    infoDump.innerHTML = "<h5>Image IDs (in order of appearance)</h5>";
    // Outer structure of list
    let imgIdList = document.createElement("ol");

    // For each object in the response array,
    breedData.forEach((object) => {
      // create a new element for the carousel.
      let newCarEl = Carousel.createCarouselItem(
        object.url,
        `A(n) ${object.breeds[0].name} cat`,
        object.id
      );
      // Append each of these new elements to the carousel.
      Carousel.appendCarousel(newCarEl);

      // Image link list: Each link's text is the corresponding image id
      imgIdList.innerHTML += `<li><a href="${object.url}">${object.id}</a></li>`;
    });
    // start the carousel
    Carousel.start();
    // add the image link list to the infoDump section
    infoDump.appendChild(imgIdList);

    // Create table to display data for the selected cat breed
    // Create table's outer structure
    infoDump.appendChild(document.createElement("table"));
    // Add a row for each data point in the breeds object that is in the cat object
    Object.keys(breedData[0].breeds[0]).forEach((key) => {
      if (!breedData[0].breeds[0][key]) {
        infoDump.querySelector(
          "table"
        ).innerHTML += `<tr style="border-bottom: 1px solid black">
        <th style="text-align: right; padding-right: 5px">${key}</th>
        <td style="border-left: 1px solid black; padding-left: 5px">No Data</td>
      </tr>`;
      } else if (breedData[0].breeds[0][key] == "[object Object]") {
        infoDump.querySelector(
          "table"
        ).innerHTML += `<tr style="border-bottom: 1px solid black">
        <th style="text-align: right; padding-right: 5px">${key}</th>
        <td style="border-left: 1px solid black; padding-left: 5px">${Object.entries(
          breedData[0].breeds[0][key]
        )}</td>
      </tr>`;
      } else {
        infoDump.querySelector(
          "table"
        ).innerHTML += `<tr style="border-bottom: 1px solid black">
        <th style="text-align: right; padding-right: 5px">${key}</th>
        <td style="border-left: 1px solid black; padding-left: 5px">${breedData[0].breeds[0][key]}</td>
      </tr>`;
      }
    });
  } catch (error) {
    //console.log(error);
    console.error(
      "Could not load breed images and corresponding information:",
      error
    );
    // Display an error message in the infoDump information section
    infoDump.innerHTML =
      "<h4>Error loading cat breed images and corresponding information</h4>";
  }
}
// 2. Create an event handler for breedSelect
breedSelect.addEventListener("change", handleSelect);
/**
 * 3. Fork your own sandbox, creating a new one named "JavaScript Axios Lab."
 */
/**
 * 4. Change all of your fetch() functions to axios!
 * - axios has already been imported for you within index.js.
 * - If you've done everything correctly up to this point, this should be simple.
 * - If it is not simple, take a moment to re-evaluate your original code.
 * - Hint: Axios has the ability to set default headers. Use this to your advantage
 *   by setting a default header with your API key so that you do not have to
 *   send it manually with all of your requests! You can also set a default base URL!
 */
/**
 * 5. Add axios interceptors to log the time between request and response to the console.
 * - Hint: you already have access to code that does this!
 * - Add a console.log statement to indicate when requests begin.
 * - As an added challenge, try to do this on your own without referencing the lesson material.
 */

/**
 * 6. Next, we'll create a progress bar to indicate the request is in progress.
 * - The progressBar element has already been created for you.
 *  - You need only to modify its "width" style property to align with the request progress.
 * - In your request interceptor, set the width of the progressBar element to 0%.
 *  - This is to reset the progress with each request.
 * - Research the axios onDownloadProgress config option.
 * - Create a function "updateProgress" that receives a ProgressEvent object.
 *  - Pass this function to the axios onDownloadProgress config option in your event handler.
 * - console.log your ProgressEvent object within updateProgess, and familiarize yourself with its structure.
 *  - Update the progress of the request using the properties you are given.
 * - Note that we are not downloading a lot of data, so onDownloadProgress will likely only fire
 *   once or twice per request to this API. This is still a concept worth familiarizing yourself
 *   with for future projects.
 */

/**
 * Tell instructor when you get here
 *
 * 7. As a final element of progress indication, add the following to your axios interceptors:
 * - In your request interceptor, set the body element's cursor style to "progress."
 * - In your response interceptor, remove the progress cursor style from the body element.
 */
/**
 * 8. To practice posting data, we'll create a system to "favourite" certain images.
 * - The skeleton of this function has already been created for you.
 * - This function is used within Carousel.js to add the event listener as items are created.
 *  - This is why we use the export keyword for this function.
 * - Post to the cat API's favourites endpoint with the given ID.
 * - The API documentation gives examples of this functionality using fetch(); use Axios!
 * - Add additional logic to this function such that if the image is already favourited,
 *   you delete that favourite using the API, giving this function "toggle" functionality.
 * - You can call this function by clicking on the heart at the top right of any image.
 */
export async function favourite(imgId) {
  // your code here
}

/**
 * 9. Test your favourite() function by creating a getFavourites() function.
 * - Use Axios to get all of your favourites from the cat API.
 * - Clear the carousel and display your favourites when the button is clicked.
 *  - You will have to bind this event listener to getFavouritesBtn yourself.
 *  - Hint: you already have all of the logic built for building a carousel.
 *    If that isn't in its own function, maybe it should be so you don't have to
 *    repeat yourself in this section.
 */

/**
 * 10. Test your site, thoroughly!
 * - What happens when you try to load the Malayan breed?
 *  - If this is working, good job! If not, look for the reason why and fix it!
 * - Test other breeds as well. Not every breed has the same data available, so
 *   your code should account for this.
 */
