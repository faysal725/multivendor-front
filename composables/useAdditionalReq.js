export const simpleGet = async(api) => {
// Define the URL you want to make a GET request to
    const apiUrl = api;

    // Use the fetch function to make the GET request
    fetch(apiUrl)
    .then(response => {
        // Check if the response status is OK (status code 200)
        if (!response.ok) {
        throw new Error('Network response was not ok');
        }
        
        // Parse the response body as JSON
        return response.json();
    })
    .then(data => {
        // Handle the JSON data here
        console.log(data);
    })
    .catch(error => {
        // Handle any errors that occurred during the fetch
        console.error('Fetch error:', error);
    });

}