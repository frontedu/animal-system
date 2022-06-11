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
        headerMenu : {
            items : {
                // Rename and move grouping items to be between "Hide column" (210) and "Sort ascending" (300)
                groupAsc    : {
                    text   : 'Group Aa..Zz',
                    weight : 290
                },
                groupDesc   : {
                    text   : 'Group Zz..Aa',
                    weight : 291
                },
                groupRemove : {
                    text   : 'Ungroup',
                    weight : 292
                }
            }
        }
    }
});
