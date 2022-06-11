const grid = new TreeGrid({
    appendTo : targetElement,

    // Makes grid as high as it needs to be to fit rows
    autoHeight : true,

    // Initial dataset, will be transformed by the TreeGroup feature
    store : {
        fields : [
            'name',
            'status',
            'prio'
        ],
        data : [
            { id : 1, name : 'Project 1', expanded : true, children : [
                { id : 11, name : 'Task 11', status : 'WIP', prio : 'High' },
                { id : 12, name : 'Task 12', status : 'Done', prio : 'Low' },
                { id : 13, name : 'Task 13', status : 'Done', prio : 'High' }
            ]},
            { id : 2, name : 'Project 2', expanded : true, children : [
                { id : 21, name : 'Task 21', status : 'WIP', prio : 'High' },
            ]}
        ]
    },

    columns : [
        { type : 'tree', field : 'name', text : 'Name', flex : 1 }
    ],

    features : {
        treeGroup : {
            levels : ['status']
        }
    },

    tbar : [
        {
            type : 'buttongroup',
            toggleGroup : true,
            items : [
                {
                    text : 'Status',
                    pressed : true,
                    onToggle({ pressed }) {
                        pressed && grid.group(['status'])
                    }
                },
                {
                    text : 'Prio',
                    onToggle({ pressed }) {
                        pressed && grid.group(['prio'])
                    }
                },
                {
                    text : 'Status + Prio',
                    onToggle({ pressed }) {
                        pressed && grid.group(['status', 'prio'])
                    }
                },
                {
                    text : 'none',
                    onToggle({ pressed }) {
                        pressed && grid.clearGroups()
                    }
                }
            ]
        }
    ]
});
