const dataMapping = {
    responseData: {
        items: 'items', // The key in the response that contains the items
        pagination: 'pagination', // The key in the response that contains pagination info
        columns: [
            {
                field: 'id', // Field to display in the table
                isDate: false,
                link: true, // Indicates this cell should be a link
                dataAttributes: [
                    { ojectProperty: 'id', inputId: 'id' },
                    { ojectProperty: 'name', inputId: 'id' }
                ]
            },
            {
                field: 'name', // Field to display in the table
                isDate: false,
                link: false // This cell is not a link
            }
        ]
    }
};

export { dataMapping };