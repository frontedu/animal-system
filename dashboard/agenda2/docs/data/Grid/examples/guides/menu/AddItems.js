const grid = new Grid({
    appendTo : targetElement,

    autoHeight : true,
    rowHeight  : 50,
    flex       : 1,

    columns : [
        { text : 'Name', field : 'name', width : 160 }
    ],

    data : [
        { id : 1, name : 'Mr Boss' }
    ],

    features : {
        cellMenu : {
            items : {
                // Custom reference to the new menu item
                renameUser : {
                    text   : 'Rename to Mark',
                    cls    : 'b-separator', // Add a visual line above the item
                    weight : 1, // Insert at the top
                    onItem : ({ item, record, column }) => {
                        record.name = 'Mark';
                    }
                }
            }
        }
    }
});
