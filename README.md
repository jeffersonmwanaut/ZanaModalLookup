# Zana Modal Lookup

Zana Modal Lookup is a JavaScript module that handles the retrieval and display of data in a modal dialog, along with pagination functionality. It uses jQuery for DOM manipulation and AJAX requests.

## Table of contents

- [Technical requirements](#Technical-Requirements)
- [Key Components](#Key-Components)
- [Code Functionality](#Code-Functionality)
- [Example Usage](#Example-Usage)

## Technical requirements

* [Bootstrap 5.3 or higher](https://getbootstrap.com/docs/5.3/getting-started/introduction/#cdn-links)
* [jQuery 3.6.1 or higher](https://www.jsdelivr.com/package/npm/jquery)
* [Fontawesome 6.5.1 or higher](https://cdnjs.com/libraries/font-awesome/6.5.1)

## Key Components

1. **Data Mapping**:

- The `dataMapping` object imported from `modalLookupDataMapping.js` is used to define how the data should be structured and displayed in the modal. It includes information about the items to be displayed and pagination details.

2. **getData Function**:

- This function is responsible for fetching data from a specified URL (defined in the modal's data attributes) and populating a table within the modal.
- It makes an AJAX GET request to the `ajaxUrl` and expects a JSON response.
- Upon a successful response, it clears any existing table data and populates the table with new data based on the mapping provided.
- It also formats date fields and handles links within the table cells.

3. **createPagination Function**:

- This function generates pagination controls based on the total number of pages returned in the AJAX response.
- It constructs the pagination links and appends them to the pagination element in the modal.
- It also handles the click events on pagination links to fetch the corresponding page of data.

4. **Event Handling**:

- The code includes an event listener for pagination link clicks, which prevents the default action and instead fetches the new data for the selected page.

## Code Functionality

- **AJAX Request**: The getData function initiates an AJAX request to fetch data. It handles both success and error cases.
- **Dynamic Table Population**: The table is dynamically populated based on the data received. It supports nested object properties and date formatting.
- **Pagination**: The pagination is dynamically created based on the total number of pages, allowing users to navigate through different pages of data.
- **Link Handling**: If a column is defined as a link, it generates an anchor tag with data attributes that can be used for further actions (like opening a form).

## Example Usage

To use this module, you would typically have a modal in your HTML with a table and a pagination element. You would call `modalLookup.getData($modal)` where `$modal` is a jQuery object representing the modal you want to populate with data.
