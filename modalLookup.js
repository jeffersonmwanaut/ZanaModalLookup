import {dataMapping} from './modalLookupDataMapping.js';

const modalLookup = {
    getData: function($modal) {
        let ajaxUrl = $modal.data('ajax-url');
        let tableName = $modal.data('table-name');
        let $table = $modal.find('table');
        let $tbody = $table.find('tbody');
        let $pagination = $modal.find('.pagination');

        let tableDataMapping = dataMapping[tableName];

        $.ajax({
            type: 'GET',
            url: ajaxUrl,
            dataType: 'json',
            success: function(response) {
                const data = response.data;
                const items = data[tableDataMapping.items];
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
                    $tbody.append(row);
                });
                
                // Create pagination
                modalLookup.createPagination($pagination, totalPages, ajaxUrl);
            },
            error: function(xhr, status, error) {
                console.error('Error fetching data:', error);
            }
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

        if (currentPage > 1) {
            $pagination.append(`
                <li class="page-item">
                    <a class="page-link" href="${cleanUrl}?page=${currentPage - 1}" aria-label="Previous">
                        <span aria-hidden="true">&laquo;</span>
                    </a>
                </li>
            `);
        }

        for (let i = 1; i <= totalPages; i++) {
            $pagination.append(`
                <li class="page-item ${i === currentPage ? 'active' : ''}">
                    <a class="page-link" href="${cleanUrl}?page=${i}">${i}</a>
                </li>
            `);
        }

        if (currentPage < totalPages) {
            $pagination.append(`
                <li class="page-item">
                    <a class="page-link" href="${cleanUrl}?page=${currentPage + 1}" aria-label="Next">
                        <span aria-hidden="true">&raquo;</span>
                    </a>
                </li>
            `);
        }

        $(document).on('click', '.page-link', function(e){
            e.preventDefault();
            let ajaxUrl = $(this).attr('href');
            let $modal = $(this).closest('.modal');
            $modal.data('ajax-url', ajaxUrl);
            modalLookup.getData($modal);
        });
    }
};

export { modalLookup };