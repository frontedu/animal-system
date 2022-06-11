<h1 class="title-with-image">
<img src="Core/logo/salesforce.svg" alt="Bryntum Calendar supports Lightning Web Components"/>
Using Bryntum Calendar as a Lightning Web Component
</h1>

<img src="Calendar/salesforce_calendar_demo.png" style="width: 800px; height: 478px" alt="Bryntum Calendar Lightning Web Component demo"/>

## Installation

### Prerequisites

* Salesforce CLI

    We will be using it to create Lightning Web Component and upload it to an organization.
    See [this article](https://developer.salesforce.com/docs/atlas.en-us.sfdx_setup.meta/sfdx_setup/sfdx_setup_intro.htm)
    for installation guidance.
    
* Visual Studio Code with
[Salesforce Extension Pack](https://marketplace.visualstudio.com/items?itemName=salesforce.salesforcedx-vscode)

### Setup

1. [Enable Dev Hub in Org](https://developer.salesforce.com/docs/atlas.en-us.sfdx_setup.meta/sfdx_setup/sfdx_setup_enable_devhub.htm)

2. Enable [My Domain](https://help.salesforce.com/articleView?id=domain_name_overview.htm&type=5) to use Lightning features

2. Create a base directory for Salesforce DX project:
    ```shell
    $ mkdir ~/salesforce
    ```
    
3. Create a Salesforce DX project via CLI:
    ```shell
    $ cd ~/salesforce
    $ sfdx force:project:create -n BryntumCalendar --manifest
      target dir = /home/user/salesforce
         create BryntumCalendar/config/project-scratch-def.json
         create BryntumCalendar/README.md
         create BryntumCalendar/sfdx-project.json
         create BryntumCalendar/manifest/package.xml
         create BryntumCalendar/.vscode/extensions.json
         create BryntumCalendar/.vscode/launch.json
         create BryntumCalendar/.vscode/settings.json
         create BryntumCalendar/force-app/main/default/lwc/.eslintrc.json
         create BryntumCalendar/force-app/main/default/aura/.eslintrc.json
         create BryntumCalendar/scripts/soql/account.soql
         create BryntumCalendar/scripts/apex/hello.apex
         create BryntumCalendar/.eslintignore
         create BryntumCalendar/.forceignore
         create BryntumCalendar/.gitignore
         create BryntumCalendar/.prettierignore
         create BryntumCalendar/.prettierrc
         create BryntumCalendar/package.json
    $ cd BryntumCalendar
    ```
    Or from VS Code by typing this to the command palette: `SFDX: Create Project` -> `Standard` -> ...

4. [Authorize an Org](https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_dev_auth_web_flow.htm)
    ```shell
    $ sfdx force:auth:web:login --setdefaultdevhubusername
    Successfully authorized ...@...com with org ID ...
    You may now close the browser
    ```
    Or from VS Code by typing to command palette: `SFDX: Authorize a Dev Hub`

5. Create a Scratch Org
    ```shell
    $ sfdx force:org:create -f config/project-scratch-def.json --setalias BryntumCalendar --durationdays 30 --setdefaultusername
    Successfully created scratch org: ..., username: test-...@example.com
    ```
    Or from VS Code by typing to command palette: `SFDX: Create a Default Scratch Org`

6. Create a static resource

    Copy the static resource definition from examples directory to Salesforce DX project directory 
    ```shell
    $ cp path-to-bryntum-calendar/examples/salesforce/src/staticresources/bryntum_calendar.resource-meta.xml \
    ~/salesforce/BryntumCalendar/force-app/main/default/staticresources/bryntum_calendar.resource-meta.xml
    ```
   
    Create a directory for static resources:
    ```shell
    $ mkdir ~/salesforce/BryntumCalendar/force-app/main/default/staticresources/bryntum_calendar
    ```
   
    Copy required sources to the static resource folder, required sources are:
    - JS bundle specific for LWC
    - CSS bundle
    - Locales
    - Fonts
    ```shell
    $ cd path-to-bryntum-calendar/build
    $ cp -r calendar.lwc.module.js calendar.stockholm.css calendar.stockholm.css.map calendar.d.ts locales/ fonts/ \
    ~/salesforce/BryntumCalendar/force-app/main/default/staticresources/bryntum_calendar
    $ cd ~/salesforce/BryntumCalendar/
    ```
   
   You should get this folder structure
    ```shell
    $ ll force-app/main/default/staticresources/bryntum_calendar
    total 7204
    drwxr-xr-x 1 user user    4096 Oct 20 19:43 ./
    drwxr-xr-x 1 user user    4096 Oct 20 19:45 ../
    -rw-r--r-- 1 user user  460872 Oct 20 19:43 calendar.d.ts
    -rw-r--r-- 1 user user 6158373 Oct 20 19:43 calendar.lwc.module.js
    -rw-r--r-- 1 user user  638487 Oct 20 19:43 calendar.stockholm.css
    -rw-r--r-- 1 user user  110788 Oct 20 19:43 calendar.stockholm.css.map
    drwxr-xr-x 1 user user    4096 Oct 20 19:43 fonts/
    drwxr-xr-x 1 user user    4096 Oct 20 19:43 locales/
    ```

    Push the static resource to the default Scratch Org
    ```shell
    $ sfdx force:source:push
    Job ID | ...
    SOURCE PROGRESS | ████████████████████████████████████████ | 1/1 Components
    === Pushed Source
    STATE  FULL NAME     TYPE            PROJECT PATH
    ─────  ────────────  ──────────────  ───────────────────────────────────────────────────────────────────────────────
    Add    bryntum_calendar  StaticResource  force-app/main/default/staticresources/bryntum_calendar/fonts/Roboto-Bold.woff
    Add    bryntum_calendar  StaticResource  force-app/main/default/staticresources/bryntum_calendar/fonts/Roboto-Bold.woff2
    Add    bryntum_calendar  StaticResource  force-app/main/default/staticresources/bryntum_calendar/fonts/Roboto-Light.woff
    Add    bryntum_calendar  StaticResource  force-app/main/default/staticresources/bryntum_calendar/fonts/Roboto-Light.woff2
    Add    bryntum_calendar  StaticResource  force-app/main/default/staticresources/bryntum_calendar/fonts/Roboto-Medium.woff
    Add    bryntum_calendar  StaticResource  force-app/main/default/staticresources/bryntum_calendar/fonts/Roboto-Medium.woff2
    Add    bryntum_calendar  StaticResource  force-app/main/default/staticresources/bryntum_calendar/fonts/Roboto-Regular.woff
    Add    bryntum_calendar  StaticResource  force-app/main/default/staticresources/bryntum_calendar/fonts/Roboto-Regular.woff2
    Add    bryntum_calendar  StaticResource  force-app/main/default/staticresources/bryntum_calendar/fonts/fa-solid-900.eot
    Add    bryntum_calendar  StaticResource  force-app/main/default/staticresources/bryntum_calendar/fonts/fa-solid-900.svg
    Add    bryntum_calendar  StaticResource  force-app/main/default/staticresources/bryntum_calendar/fonts/fa-solid-900.ttf
    Add    bryntum_calendar  StaticResource  force-app/main/default/staticresources/bryntum_calendar/fonts/fa-solid-900.woff
    Add    bryntum_calendar  StaticResource  force-app/main/default/staticresources/bryntum_calendar/fonts/fa-solid-900.woff2
    Add    bryntum_calendar  StaticResource  force-app/main/default/staticresources/bryntum_calendar/calendar.d.ts
    Add    bryntum_calendar  StaticResource  force-app/main/default/staticresources/bryntum_calendar/calendar.lwc.module.js
    Add    bryntum_calendar  StaticResource  force-app/main/default/staticresources/bryntum_calendar/calendar.stockholm.css
    Add    bryntum_calendar  StaticResource  force-app/main/default/staticresources/bryntum_calendar/calendar.stockholm.css.map
    Add    bryntum_calendar  StaticResource  force-app/main/default/staticresources/bryntum_calendar/locales/calendar.locale.En.js
    Add    bryntum_calendar  StaticResource  force-app/main/default/staticresources/bryntum_calendar/locales/calendar.locale.Nl.js
    Add    bryntum_calendar  StaticResource  force-app/main/default/staticresources/bryntum_calendar/locales/calendar.locale.Ru.js
    Add    bryntum_calendar  StaticResource  force-app/main/default/staticresources/bryntum_calendar/locales/calendar.locale.SvSE.js
    Add    bryntum_calendar  StaticResource  force-app/main/default/staticresources/bryntum_calendar.resource-meta.xml
    ```
    Or from VS Code by typing to the command palette: `SFDX: Push Source To Default Scratch Org`
   
7. Create a Lightning Web Component

    ```shell
    $ sfdx force:lightning:component:create --type lwc -n Calendar_component -d force-app/main/default/lwc
    target dir = /home/user/salesforce/BryntumCalendar/force-app/main/default/lwc
       create force-app/main/default/lwc/calendar_component/calendar_component.js
       create force-app/main/default/lwc/calendar_component/calendar_component.html
       create force-app/main/default/lwc/calendar_component/calendar_component.js-meta.xml
    ```
   Or from VS Code by typing to command palette: `SFDX: Create Lightning Web Component`

8. Copy the Lightning Web Component code

    ```shell
    $ cd path-to-bryntum-calendar/examples/salesforce/src/lwc/calendar_component
    $ cp *.js *.html *.css *.map ~/salesforce/BryntumCalendar/force-app/main/default/lwc/calendar_component
    $ cd ~/salesforce/BryntumCalendar/
    ```
   
   Change the component definition in `calendar_component.js-meta.xml` to expose it in the Lightning App Builder:
    ```xml
    <?xml version="1.0" encoding="UTF-8"?>
    <LightningComponentBundle xmlns="http://soap.sforce.com/2006/04/metadata">
        <apiVersion>49.0</apiVersion>
        <isExposed>true</isExposed>
        <masterLabel>Bryntum Calendar</masterLabel>
        <description>Bryntum Calendar sample</description>
        <targets>
          <target>lightning__AppPage</target>
        </targets>
    </LightningComponentBundle>
    ```
   
   As a result you should get a project which looks like this:
   
   <img src="Calendar/salesforce_calendar_project.png" style="width: 800px; height: 560px" alt="Build Calendar Lightning Component project"/>

9. Push the sources to the Scratch Org
    
    ```shell
    $ sfdx force:source:push
    Job ID | ...
    SOURCE PROGRESS | ████████████████████████████████████████ | 1/1 Components
    === Pushed Source
    STATE  FULL NAME                           TYPE                      PROJECT PATH
    ─────  ──────────────────────────────────  ────────────────────────  ────────────────────────────────────────────────────────────────────
    Add    calendar_component/data/data.js             LightningComponentBundle  force-app/main/default/lwc/calendar_component/data/launch-saas.js
    Add    calendar_component/calendar_component.css   LightningComponentBundle  force-app/main/default/lwc/calendar_component/calendar_component.css
    Add    calendar_component/calendar_component.html  LightningComponentBundle  force-app/main/default/lwc/calendar_component/calendar_component.html
    Add    calendar_component/calendar_component.js    LightningComponentBundle  force-app/main/default/lwc/calendar_component/calendar_component.js
    Add    calendar_component/calendar_component.js    LightningComponentBundle  force-app/main/default/lwc/calendar_component/calendar_component.js-meta.xml
    ```
    Or from VS Code by typing this to the command palette: `SFDX: Push Source To Default Scratch Org`
    
## Usage

To use the web component we need a Lightning Application 

1. Open default org
    ```shell
    $ sfdx force:org:open
    ```
    Or from VS Code by typing this to the command palette: `SFDX: Open Default Org`
    
2. Open the Lightning App Builder, create a new Lightning Page. Pick `App Page` then page name and layout.

3. You should see a `Bryntum Calendar` custom component available for the new page. Append it to any region and save.

4. Activate the page. Click `Activation`, navigate to `Lightning Experience` tab and pick Lightning Application to append
this page to. Save the changes.

<img src="Calendar/salesforce_calendar_build_ltng_app.gif" style="width: 800px; height: 473px" alt="Build Calendar Lightning Component"/>

5. Open the application page. It should be accessible in the app launcher if you click it and type `Bryntum`.

If everything went well, you should see a simple calendar demo running in the Lightning Page.

<img src="Calendar/salesforce_calendar_use_ltng_app.gif" style="width: 800px; height: 473px" alt="Use Calendar Lightning Component"/>

## Lightning Locker

As of version 4.1.0, Bryntum Calendar offers full support for Locker Service and can be embedded into a Lightning
Web Component (LWC), as simple as:

```
Promise.all([
    loadScript(this, CALENDAR + '/calendar.lwc.module.js'),
    loadStyle(this, CALENDAR + '/calendar.stockholm.css')
]).then(() => {
    new bryntum.calendar.Calendar({
        appendTo : this.template,
        /*...*/
    });
})
```

### CSS collisions

You may encounter a CSS collision on components when loading static resources for different Bryntum products. Normally
this should not be a problem because each product bundle exports the components it is based on. Scheduler exports Grid, Calendar
exports both Scheduler and Grid. Which means you can use Grid from Calendar's static resource (please note you still need 
a license for every Bryntum product you use).

In case you have a static resource for the Grid (having grid.theme.css) and another for Scheduler (having scheduler.theme.css)
you may see some wrong styles, like the timeline header misplaced by a few pixels.

If you experience this or any other integration issue please let us know in our [forums](https://bryntum.com/forum).

### Changed and missing APIs

Lightning Locker modifies the behavior of some native APIs (and other native APIs are not supported). 
We have refactored our code base to allow overriding certain behavior specifically to work with Lightning Locker. As a result
**calendar.lwc.module.js only works when Lightning Locker is enabled**, it is not supposed to work in a regular page.

Overrides are organized in a single entry **lib/Grid/override/salesforce/AllOverrides.js** which you will only need 
if you want to generate a special bundle (e.g. to achieve minimum size). This entry should be imported first.

## Supported Browsers

The LWC bundle we provide only supports modern browsers since Salesforce dropped support for legacy browsers at the 
end of 2020. IE11 and old (non-Chromium based) Edge are not supported. 


<p class="last-modified">Last modified on 2022-05-30 6:38:15</p>