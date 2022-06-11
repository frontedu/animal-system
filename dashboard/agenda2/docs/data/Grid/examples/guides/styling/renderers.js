const grid = new Grid({
    appendTo   : targetElement,
    autoHeight : true,

    columns : [
        {
            text     : 'Name',
            field    : 'firstName',
            flex     : 1,
            renderer : ({ value }) => `My name is ${value}!`
        },
        {
            text  : 'City', // Can be any column to style rows
            field : 'city',
            width : 100,
            renderer({ row, value }) {
                // Color only odd rows
                row.eachElement(el => el.style.background = row.index % 2 === 0 ? '#b2ffe9' : '#ffffff');

                return value;
            }
        },
        {
            type           : 'number',
            text           : 'Age',
            field          : 'age',
            width          : 80,
            cellCls        : 'age',
            align          : 'center',
            htmlEncode     : false,
            headerRenderer(meta) {
                meta.headerElement.style.color = '#1E88E5';
                meta.headerElement.style.fontWeight = '700';
                return `- AGE -`;
            },
            renderer       : ({ value }) => `<i class="b-fa ${value < 40 ? 'b-fa-child' : 'b-fa-male'}"></i>`
        },
        {
            text       : 'Color',
            field      : 'color',
            cls        : 'color',
            flex       : 1,
            htmlEncode : false,
            icon       : 'b-fa b-fa-paint-brush',
            renderer({ value, cellElement }) {
                cellElement.innerHTML = '<div class="color-box"></div>' + value;
                cellElement.firstElementChild.style.cssText = `
                    margin-right: .5em; 
                    width: 1em; 
                    height: 1em; 
                    border-radius: .2em; 
                    background-color: ${value};
                `;
            }
        }
    ],

    data : DataGenerator.generateData(5)
});
