targetElement.style.display = 'flex';
targetElement.style.alignItems = 'stretch';

new Panel({
    title    : 'Left panel',
    appendTo : targetElement,
    html     : 'Spicy jalapeno bacon ipsum dolor amet venison beef alcatra spare ribs porchetta biltong. Fatback pork loin tri-tip tongue ground round. Pastrami capicola bresaola beef pancetta beef ribs porchetta kevin kielbasa pork prosciutto short ribs short loin tail. Shoulder beef strip steak bresaola, ham pastrami shankle picanha salami venison bacon kevin tail.',
    flex     : 1,
    height   : '18em',
    minWidth : '10em'
});

new Splitter({
    appendTo : targetElement
});

new Panel({
    title    : 'Right panel',
    appendTo : targetElement,
    html     : 'Spicy jalapeno bacon ipsum dolor amet short ribs cupim ribeye corned beef shank. Andouille boudin short ribs shank brisket tenderloin, kielbasa drumstick strip steak pork porchetta pig. Beef pastrami sirloin salami capicola, t-bone beef ribs doner. Beef strip steak burgdoggen ham hock, meatloaf tongue corned beef kevin. Drumstick boudin turkey hamburger ground round prosciutto.',
    flex     : 1,
    height   : '18em',
    minWidth : '10em'
});
