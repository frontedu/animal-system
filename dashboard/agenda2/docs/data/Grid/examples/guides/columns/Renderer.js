let grid = new Grid({
    appendTo : targetElement,

    autoHeight : true,

    data : DataGenerator.generateData(3),

    columns : [
        {
            field : 'name',
            text  : 'Name',
            flex  : 1,
            renderer({ cellElement, record }) {
                cellElement.style.backgroundColor = record.color;
                cellElement.style.color           = '#fff';
                return record.name;
            }
        },
        {
            field      : 'color',
            text       : 'Color',
            flex       : 1,
            htmlEncode : false,
            renderer({ value }) {
                return `
                        <div style="
                            width: 1em;
                            height: 1em;
                            border-radius: 3px;
                            background-color: ${value};
                            margin-right: .5em"></div>
                        ${value}
                    `;
            }
        }
    ]
});
