const grid = new Grid({
    appendTo : targetElement,

    autoHeight : true,
    rowHeight  : 50,
    flex       : 1,

    columns : [
        { text : 'Name', field : 'name', width : 160 },
        { text : 'Start', field : 'startDate', width : 160 }
    ],

    data : [
        { id : 1, name : 'Mr Boss', startDate : '2020-08-17' }
    ],

    features : {
        // This will enable Filter feature and all its menu items in both cell and header menus
        filter     : { property : 'name', value : 'Boss' },
        cellMenu   : {
            items : {
                // Remove "Delete record" default item
                removeRow        : false,
                // Remove "Before" and "After" items provided by Filter feature to only have "On" option for Date columns
                filterDateBefore : false,
                filterDateAfter  : false
            }
        },
        headerMenu : {
            items : {
                // Remove "Edit filter" item provided by Filter feature to only have "Remove filter" option in case a filter is applied to the column field
                editFilter : false,
                multiSort  : {
                    menu : {
                        // Remove "Add descending sorting" item provided by Sort feature to only have ascending sorting
                        addSortDesc : false
                    }
                }
            }
        }
    }
});
