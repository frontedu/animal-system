// grid with TemplateColumn
const grid = new Grid({
    appendTo : targetElement,

    // makes grid as high as it needs to be to fit rows
    autoHeight : true,
    rowHeight  : 100,
    readOnly   : true,
    data       : [
        { id : 1, name : 'Sweden', population : 10.3, flagImg : 'data/Core/images/flag/swe.png' },
        { id : 2, name : 'Denmark', population : 5.8, flagImg : 'data/Core/images/flag/den.png' },
        { id : 3, name : 'Norway', population : 5.3, flagImg : 'data/Core/images/flag/nor.png' },
        { id : 4, name : 'Finland', population : 5.5, flagImg : 'data/Core/images/flag/fin.png' },
        { id : 5, name : 'Iceland', population : 0.3, flagImg : 'data/Core/images/flag/ice.png' }
    ],

    columns : [
        {
            type     : 'template',
            text     : 'Template Column',
            width    : 200,
            field    : 'name',
            align    : 'center',
            template : ({ record }) => `<dl style="margin:0">
                <dt><img src="${record.flagImg}" height="50px" style="box-shadow:1px 0 5px #aaa"/></dt>
                <dd style="text-align: center;margin-top: 7px;font-style:normal;font-weight:bold">${record.name}</dd>
                </dl>`
        },
        { field : 'population', type : 'number', text : 'Population', flex : 1, renderer : ({ value }) => value + 'M' }
    ]
});
