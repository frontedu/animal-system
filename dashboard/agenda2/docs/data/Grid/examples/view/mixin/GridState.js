targetElement.innerHTML = '<p>Click the first button to store grids state, rearrange the grid, then click the second one to restore</p>';

// button to store state
let storeButton = new Button({
    appendTo: targetElement,
    text : 'Store',
    onClick: () => {
        // grid.state fetches the grids current state
        localStorage.setItem('docs-grid-state', JSON.stringify(grid.state));
        Toast.show('State stored');
    }
});

// button to restore state
let restoreButton = new Button({
    appendTo: targetElement,
    text : 'Restore',
    onClick: () => {
        const state = JSON.parse(localStorage.getItem('docs-grid-state'));
        // assigning to grid.state applies a state to the grid
        if (state) grid.state = state;
        Toast.show('State restored');
    }
});

// grid with cell editing
let grid = new Grid({
    appendTo : targetElement,

    // makes grid as high as it needs to be to fit rows
    autoHeight : true,

    data : DataGenerator.generateData(5),

    columns : [
        { field : 'name', text : 'Name', flex : 1 },
        { field : 'city', text : 'City', width : 150 },
        { field : 'color', text : 'Color', width : 150 }
    ]
});
