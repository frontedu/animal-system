// grid with WidgetColumn
const grid = new Grid({
    appendTo: targetElement,

    // makes grid as high as it needs to be to fit rows
    autoHeight: true,
    store : {
        fields : ['price', 'inflightMeal', 'priorityBoarding'],
        data     : DataGenerator.generateData(5).map(data => {
            data.price = Math.round(Math.random() * 1000) + 100;
            return data;
        }),
    },
    rowHeight: 100,
    columns  : [
        { field: 'city', text: 'Destination', flex: 1 },
        {
            type   : 'widget',
            text   : 'Extras',
            align  : 'center',
            width  : 300,
            widgets: [
                {
                    type: 'checkbox',
                    name: 'inflightMeal',
                    label: 'In-flight Meal'
                },
                {
                    type: 'checkbox',
                    name: 'priorityBoarding',
                    label: 'Priority boarding'
                }
            ]
        },
        {
            text : 'Total price',
            align : 'right',
            htmlEncode : false,
            renderer({ record }) {
                let total = record.price;

                if (record.inflightMeal) {
                    total += 30;
                }
                if (record.priorityBoarding) {
                    total += 50;
                }

                return `<strong>\$ ${total}</strong>`;
            }
        },
        {
            type   : 'widget',
            text   : 'Button column',
            width : 140,
            widgets: [{
                type   : 'button',
                cls    : 'b-raised',
                icon   : 'b-icon b-fa-plane',
                text   : 'Book now',
                flex   : 1,
                onClick: ({ source: btn }) => {
                    const { record } = btn.cellInfo;
                    Toast.show(`Booking a flight to ${record.city}`);
                }
            }]
        },
    ]
});
