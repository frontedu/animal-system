const style = targetElement.appendChild(document.createElement('style'));

style.innerText = `#responsiveGrid.b-responsive-small { font-size: 2vw; }`;

// grid with basic configuration
const grid = new Grid({
    id               : 'responsiveGrid',
    appendTo         : targetElement,
    height           : 200,
    responsiveLevels : {
        small  : 400,
        normal : '*'
    },

    columns : [
        { field : 'name', text : 'Name', flex : 1 },
        { field : 'city', text : 'City', flex : 1 }
    ],

    data : [
        { id : 1, name : 'Dan Stevenson', city : 'Los Angeles' },
        { id : 2, name : 'Talisha Babin', city : 'Paris' }
    ]
});
