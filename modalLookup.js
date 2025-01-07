import {dataMapping} from './modalLookupDataMapping.js';

const updateAjaxUrl = (ajaxUrl, searchParams) => {
    // Create a URL object
    const url = new URL(ajaxUrl);

    // Create a URLSearchParams object from the existing query string
    const params = new URLSearchParams(url.search);

    // Append new search parameters
    for (const key in searchParams) {
        if (searchParams.hasOwnProperty(key)) {
            params.set(key, searchParams[key]); // Use set to update or add new parameters
        }
    }

    // Update the URL with the new search parameters
    url.search = params.toString();

    return url.toString(); // Return the updated URL as a string
};

const modalLookup = {
    getData: function($modal) {
        let ajaxUrl = $modal.data('ajax-url');
        let tableName = $modal.data('table-name');
        let $table = $modal.find('table');
        let $tbody = $table.find('tbody');
        let $pagination = $modal.find('.pagination');

        let tableDataMapping = dataMapping[tableName];

        // Collect all search terms from input fields
        const searchParams = {};
        $modal.find('input[type="search"]').each(function() {
            const inputName = $(this).attr('name');
            const inputValue = $(this).val();
            if (inputValue) {
                searchParams[inputName] = inputValue;
            }
        });

        // Update the AJAX URL with search parameters
        ajaxUrl = updateAjaxUrl(ajaxUrl, searchParams);

        $.ajax({
            type: 'GET',
            url: ajaxUrl,
            dataType: 'json',
            success: function(response) {
                const data = response.data; // Adjust this based on your API response structure
                const items = data[tableDataMapping.items]; // Use the mapping to get the items
                const totalPages = data[tableDataMapping.pagination].total_pages;

                // Clear existing table data
                $tbody.empty();

                // Populate the table with data
                items.forEach(item => {
                    const row = $('<tr></tr>');
                    tableDataMapping.columns.forEach(column => {
                        const cell = $('<td></td>');
                        let columnValue = null;
                        if(column.field.indexOf(".") !== -1) {
                            columnValue = item[column.field.split('.')[0]][column.field.split('.')[1]];
                        } else {
                            columnValue = item[column.field];
                        }

                        // Check if the column value is a date and format it
                        if (column.isDate) {
                            columnValue = columnValue.date.substring(0, 10);
                        }
                        
                        if (column.link) {
                            cell.attr('style', "width: 5px");
                            cell.append(`
                                <a  class="text-decoration-none modal-lookup-option" 
                                    href="#" 
                                    data-target="#form" 
                                    ${column.dataAttributes.map((dataAttribute) => {
                                        let dataKeyValue = null;
                                        let dataValue = null;
                                        if(dataAttribute.ojectProperty.indexOf(".") !== -1) {
                                            dataValue = item[dataAttribute.ojectProperty.split('.')[0]][dataAttribute.ojectProperty.split('.')[1]];
                                        } else {
                                            dataValue = item[dataAttribute.ojectProperty];
                                        }
                                        if (dataAttribute.isDate) {
                                            dataValue = dataValue.date.substring(0, 10);
                                        }
                                        dataKeyValue = `data-${dataAttribute.inputId}="${dataValue}"`;
                                        return dataKeyValue;
                                    }).join(' ')}
                                >
                                    <i class="fa-solid fa-circle-check text-link"></i>
                                </a>
                            `);
                        } else {
                            cell.text(columnValue);
                        }
                        row.append(cell);
                    });
                    //$(`#${tableId} tbody`).append(row);
                    $tbody.append(row);
                });
                
                // Create pagination
                modalLookup.createPagination($pagination, totalPages, ajaxUrl);

                // Initialize filtering
                modalLookup.filterTable($table);
            },
            error: function(xhr, status, error) {
                console.error('Error fetching data:', error);
                //console.error('Response text:', xhr.responseText);
            }
        });
    },
    filterTable: function($table) {
        const $inputs = $table.find('input[type="search"]');
        $inputs.off('input'); // Remove previous event handlers
        $inputs.on('input', function() {
            const $modal = $table.closest('.modal'); // Find the closest modal
            modalLookup.getData($modal); // Fetch new data with all search terms
        });
    },
    createPagination: function($pagination, totalPages, urlString) {
        const url = new URL(urlString);
        const urlParams = new URLSearchParams(url.search);
        let currentPage = 1;

        if (urlParams.has('page')) {
            currentPage = parseInt(urlParams.get('page'), 10);
        }

        const cleanUrl = urlString.split("?")[0];
        $pagination.empty(); // Clear existing pagination controls

        // Add "First" link
        if (currentPage > 1) {
            $pagination.append(`
                <li class="page-item">
                    <a class="page-link" href="${cleanUrl}?page=1" aria-label="First">
                        <span aria-hidden="true">&laquo;</span>
                    </a>
                </li>
            `);
        }

        if (currentPage > 1) {
            $pagination.append(`
                <li class="page-item">
                    <a class="page-link" href="${cleanUrl}?page=${currentPage - 1}" aria-label="Previous">
                        <span aria-hidden="true">&lt;</span>
                    </a>
                </li>
            `);
        }

        // Display page numbers with ellipsis
        const maxVisiblePages = 5; // Maximum number of page links to show
        const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (startPage > 1) {
            $pagination.append(`
                <li class="page-item">
                    <a class="page-link" href="${cleanUrl}?page=1">1</a>
                </li>
            `);
            if (startPage > 2) {
                $pagination.append(`
                    <li class="page-item disabled"><span class="page-link">...</span></li>
                `);
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            $pagination.append(`
                <li class="page-item ${i === currentPage ? 'active' : ''}">
                    <a class="page-link" href="${cleanUrl}?page=${i}">${i}</a>
                </li>
            `);
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                $pagination.append(`
                    <li class="page-item disabled"><span class="page-link">...</span></li>
                `);
            }
            $pagination.append(`
                <li class="page-item">
                    <a class="page-link" href="${cleanUrl}?page=${totalPages}">${totalPages}</a>
                </li>
            `);
        }

        if (currentPage < totalPages) {
            $pagination.append(`
                <li class="page-item">
                    <a class="page-link" href="${cleanUrl}?page=${currentPage + 1}" aria-label="Next">
                        <span aria-hidden="true">&gt;</span>
                    </a>
                </li>
            `);
        }

        // Add "Last" link
        if (currentPage < totalPages) {
            $pagination.append(`
                <li class="page-item">
                    <a class="page-link" href="${cleanUrl}?page=${totalPages}" aria-label="Last">
                        <span aria-hidden="true">&raquo;</span>
                    </a>
                </li>
            `);
        }

        // Event delegation for pagination links
        $pagination.off('click', '.page-link'); // Remove previous event handlers
        $pagination.on('click', '.page-link', function(e) {
            e.preventDefault(); // Prevent default anchor behavior
            let ajaxUrl = $(this).attr('href'); // Get the URL from the clicked link
            let $modal = $(this).closest('.modal'); // Find the closest modal
            $modal.data('ajax-url', ajaxUrl); // Update the modal's ajax-url
            modalLookup.getData($modal); // Fetch new data
        });
    }
};

export { modalLookup };
