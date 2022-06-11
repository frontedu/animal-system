targetElement.innerHTML = '<p>Drag the splitter between grid regions to resize</p>';
let grid = new Grid({
    appendTo : targetElement,

    // makes grid as high as it needs to be to fit rows
    autoHeight: true,

    features : {
        // enabled region resize
        regionResize: true
    },

    data : DataGenerator.generateData(5),

    columns : [
        { field : 'firstName', text : 'First name', width: 150, locked: true },
        { field : 'surName', text : 'Surname', width: 150, locked: true },
        { field : 'city', text : 'City', flex : 1 },
        { field : 'team', text : 'Team', flex : 1 },
        { field : 'score', text : 'Score', flex : 1 },
        { field : 'rank', text : 'Rank', flex : 1 }
    ]
});
