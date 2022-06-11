"use strict";

StartTest(async t => {
  t.setWindowSize(1027, 768);
  const {
    isPR,
    isTrial,
    productName,
    skipTrialCheck,
    skipHeaderCheck,
    skipTestSizeCheck,
    popups
  } = t.getConfig(); // No upper test t.it level here to use separate subTestTimeout per each `t.it`
  // Use of `t.it` is slower than simple iteration but this outputs the failed example name from `t.it` description to TC log

  t.diag('Check each online example to have correct link back to all examples and trial button');
  await t.waitForSelector('.example'); // For Trial test all examples
  // For Full test all except frameworks
  // For PR tests 10 first examples only (sanity check to save time)

  let examples = Array.from(t.global.document.querySelectorAll('.example:not(.offline)')).map(el => ({
    id: el.id.replace('b-example', 'example'),
    name: el.id.replace('b-example-', ''),
    href: el.href
  })).filter(el => isTrial || !el.href.includes('frameworks'));

  if (isPR) {
    examples = examples.slice(0, Math.min(examples.length, 10));
  }

  for (const example of examples) {
    t.describe(`Check example #${example.id}`, async t => {
      const closePopups = async () => {
        const selector = popups === null || popups === void 0 ? void 0 : popups[example.id];

        if (selector) {
          await t.waitForSelector(selector);
          await t.click(selector);
        }
      };

      t.global.document.body.innerHTML = '';
      await t.waitForPageNavigate(`${example.href}?test`);
      await t.waitForSelector('#title h1');
      await closePopups();
      const {
        document
      } = t.global,
            {
        title
      } = document,
            titleElement = document.getElementById('title'),
            correct = `examples/#${example.id}`;
      t.it('Check title', t => {
        var _titleElement$href;

        if (!(titleElement !== null && titleElement !== void 0 && (_titleElement$href = titleElement.href) !== null && _titleElement$href !== void 0 && _titleElement$href.endsWith(correct))) {
          t.fail(`Wrong #title href: "${titleElement === null || titleElement === void 0 ? void 0 : titleElement.href}", Correct ends with: "${correct}"`);
        } // Should have a meta description node


        const metaDescriptionNode = t.query('meta[name=description]')[0];
        t.isGreater(title.length, 10, 'Page has a sane title');
        t.ok(metaDescriptionNode, 'Description tag found');
        t.isGreater(metaDescriptionNode === null || metaDescriptionNode === void 0 ? void 0 : metaDescriptionNode.getAttribute('content').length, 10, 'Description tag has content');
        t.selectorCountIs('h1', 1, 'One H1 on the page');

        if (!skipHeaderCheck.find(skip => example.id.includes(skip))) {
          const titleH1Element = titleElement.querySelector('h1'),
                demoTitle = title.split(' - ')[1] || title;
          t.is(titleH1Element.innerText, demoTitle, 'Title H1 text should match demo title from "document.title" tag');
        }
      });
      t.it('Check trial panel', async t => {
        if (!skipTrialCheck.find(skip => example.id.includes(skip))) {
          await t.click('[data-ref=downloadTrial]');
          await t.waitForSelector('.b-trialpanel');
          const combo = document.querySelector('input[name=productId]');
          t.is(combo.value, `Bryntum ${productName}`, `Correct product selected for ${example.id}`);
          t.pass(`Trial panel displayed for ${example.id}`);
        }
      });
      t.it('Check code editor, it should not crash when making a change', async t => {
        // Skip check for demos without code editor (scripttag, frameworks, etc.)
        if (!document.querySelector('[data-ref="codeButton"]')) {
          t.pass('No code editor. Test skipped');
          return;
        }

        await t.click('[data-ref="codeButton"]');
        await t.waitForSelector('.b-codeeditor pre code');
        const editorElement = t.query('.b-codeeditor pre code')[0];
        await t.waitFor(() => editorElement.innerText.length > 0);
        await t.click('.b-codeeditor .b-panel-header');

        if (!t.query('.b-codeeditor .readonly').length) {
          editorElement.innerText = editorElement.innerText + ' ';
          await t.doubleClick('[data-ref=autoApply]');
        }

        await closePopups(); // Close editor

        await t.click('.b-codeeditor [data-ref="close"]');
        t.pass('Code editor is ok');
      });
      t.it('Check current config, should yield something', async t => {
        const g = t.global,
              product = g.gantt || g.schedulerPro || g.calendar || g.taskBoard || g.grid || g.scheduler; // Some demos are for tooltips and combos etc, might get native Scheduler

        if (product !== null && product !== void 0 && product.isWidget) {
          const configString = product.getTestCase();
          t.isGreater(configString.length, 300, 'Has some content');

          if (!(skipTestSizeCheck !== null && skipTestSizeCheck !== void 0 && skipTestSizeCheck.includes(example.name))) {
            t.isLess(configString.length, 1000000, 'Content is not huge');
          }

          t.ok(configString.match(/new (Gantt|Calendar|SchedulerPro|Scheduler|TaskBoard|Grid)/), 'Has code to create a new instance');
        }
      });
    });
  }
});