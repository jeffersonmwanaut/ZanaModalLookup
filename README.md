# Zana Modal Lookup

Zana Modal Lookup is a JavaScript module that handles the retrieval and display of data in a modal dialog, along with pagination functionality. It uses jQuery for DOM manipulation and AJAX requests.

## Table of contents

- [Technical requirements](#Technical-Requirements)
- [Key Components](#Key-Components)
- [Code Functionality](#Code-Functionality)
- [Example Usage](#Example-Usage)
- [Creators](#creators)

## Technical requirements

* [Bootstrap 5.3 or higher](https://getbootstrap.com/docs/5.3/getting-started/introduction/#cdn-links)
* [jQuery 3.6.1 or higher](https://www.jsdelivr.com/package/npm/jquery)
* [Fontawesome 6.5.1 or higher](https://cdnjs.com/libraries/font-awesome/6.5.1)

## Key Components

1. **Data Mapping**:

The `dataMapping` object imported from `modalLookupDataMapping.js` is used to define how the data should be structured and displayed in the modal. It includes information about the items to be displayed and pagination details. The structure includes:

* **items**: The key in the response that contains the items.
* **pagination**: The key in the response that contains pagination info.
* **columns**: An array defining the fields to display in the table, whether they are links, and any data attributes associated with them.

2. **getData Function**:

This function is responsible for fetching data from a specified URL (defined in the modal's data attributes) and populating a table within the modal. Key functionalities include:

* It makes an AJAX GET request to the `ajaxUrl` and expects a JSON response.
* Upon a successful response, it clears any existing table data and populates the table with new data based on the mapping provided.
* It formats date fields and handles links within the table cells.

3. **createPagination Function**:

This function generates pagination controls based on the total number of pages returned in the AJAX response. It constructs the pagination links and appends them to the pagination element in the modal. Key functionalities include:

* It handles the click events on pagination links to fetch the corresponding page of data.

4. **Event Handling**:

The code includes an event listener for pagination link clicks, which prevents the default action and instead fetches the new data for the selected page.

## Code Functionality

- **AJAX Request**: The getData function initiates an AJAX request to fetch data. It handles both success and error cases.
- **Dynamic Table Population**: The table is dynamically populated based on the data received. It supports nested object properties and date formatting.
- **Pagination**: The pagination is dynamically created based on the total number of pages, allowing users to navigate through different pages of data.
- **Link Handling**: If a column is defined as a link, it generates an anchor tag with data attributes that can be used for further actions (like opening a form).

## Example Usage

To use this module, you would typically have a modal in your HTML with a table and a pagination element. You would call `modalLookup.getData($modal)` where `$modal` is a jQuery object representing the modal you want to populate with data.

### HTML Structure

```html
<!-- Button to open the modal -->
<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#lookupModal">
    Open Lookup Modal
</button>

<!-- Modal Structure -->
<div class="modal fade" id="lookupModal" tabindex="-1" role="dialog" aria-labelledby="lookupModalLabel" aria-hidden="true" 
     data-ajax-url="https://api.example.com/items" 
     data-table-name="responseData">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="lookupModalLabel">Item Lookup</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <input type="search" name="search" placeholder="Search..." class="form-control mb-3">
                <table class="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
                <nav>
                    <ul class="pagination"></ul>
                </nav>
            </div>
        </div>
    </div>
</div>
```

### JavaScript Initialization

```javascript
import { modalLookup } from './modalLookupDataMapping.js';

$(document).ready(function() {
    // Event listener for when the modal is shown
    $('#lookupModal').on('show.bs.modal', function (event) {
        const $modal = $(this);
        modalLookup.getData($modal); // Fetch data when the modal is shown
    });
});
```

### Explanation of Usage

1. **Modal Trigger**: The button with `data-toggle="modal"` and `data-target="#lookupModal"` opens the modal when clicked.
2. **Data Attributes**: The modal itself contains `data-ajax-url` and `data-table-name` attributes, which are used by the `getData` function to fetch and display data.
3. **Dynamic Data Fetching**: When the modal is shown, the getData function is called, which fetches data from the specified URL and populates the table accordingly.

This setup allows for a dynamic and interactive modal that can display data fetched from an API, complete with pagination and search functionality.


## Creators

**Jefferson Mwanaut**

- <https://github.com/jeffersonmwanaut>
- <https://www.linkedin.com/in/jeffersonmwanaut>
