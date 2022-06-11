# Using Bryntum Calendar as a Lightning Web Component

As of version 4.1.0, Bryntum Calendar offers full support for Locker Service and can be embedded into a Lightning
Web Component.

### CSS collision

It is possible to get a CSS collision on components when loading static resources for different Bryntum products. Normally
this should not be a problem because each product bundle exports the components it is based on. Scheduler exports Grid, Gantt
exports both Scheduler and Grid. Which means you can use Grid from Gantt's static resource.

But in case you have a static resource for Calendar (having calendar.theme.css) and another for Scheduler (having scheduler.theme.css)
you may see some wrong styles, like timeline header misplaced by a few pixels.

We don't know how common this use case would be, so if you experience this issue please let us know on [forum](https://bryntum.com/forum)
or [GitHub](https://github.com/bryntum/support/issues).

### Changed/missing API

As mentioned above, the Locker Service does change behavior of some APIs and does not support a few. We refactored our
code base to polish rough edges and allow overriding certain behavior specifically to work with Locker Service. As a result
**calendar.lwc.module.js only works when Locker Service is enabled**, it is not supposed to work on a regular page.

Overrides are organized in a single entry **lib/Grid/override/salesforce/AllOverrides.js** which you will only need if you want to generate a
special bundle (e.g. to achieve minimum size). Entry should be imported first.

## Supported Browsers

We decided to only support modern browsers because Salesforce drops old browsers support by the end of 2020. Thus, IE11
and old (non-chromium based) Edge are not supported. 

## Installation

### Prerequisites

* Salesforce CLI

    We will be using it to create Lightning Web Component and upload it to an organization.
    See [this article](https://developer.salesforce.com/docs/atlas.en-us.sfdx_setup.meta/sfdx_setup/sfdx_setup_intro.htm)
    for installation guidance.
    
* Visual Studio Code with [Salesforce Extension Pack](https://marketplace.visualstudio.com/items?itemName=salesforce.salesforcedx-vscode)

### Setup

1. [Enable Dev Hub in Org](https://developer.salesforce.com/docs/atlas.en-us.sfdx_setup.meta/sfdx_setup/sfdx_setup_enable_devhub.htm)

2. Enable [My Domain](https://help.salesforce.com/articleView?id=domain_name_overview.htm&type=5) to use Lightning features

2. Create base directory for Salesforce DX project:
    ```
    mkdir ~/salesforce
    ```
    
3. Create Salesforce DX project via CLI:
    ```
    cd ~/salesforce
    sfdx force:project:create -n BryntumCalendar --manifest
    cd BryntumCalendar
    ```
    Or from VSCode by typing to command palette: `SFDX: Create Project` -> `Standard` -> ...

4. [Authorize an Org](https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_dev_auth_web_flow.htm)
    ```
    sfdx force:auth:web:login --setdefaultdevhubusername
    ```
    Or from VSCode by typing to command palette: `SFDX: Authorize a Dev Hub`

5. Create Scratch Org
    ```
    sfdx force:org:create -f config/project-scratch-def.json --setalias BryntumCalendar --durationdays 30 --setdefaultusername
    ```
    Or from VSCode by typing to command palette: `SFDX: Create a Default Scratch Org`

6. Create static resource

    Copy static resource definition from examples directory to Salesforce DX project directory 
    ```
    cp path-to-bryntum-grid/examples/salesforce/src/staticresources/bryntum_calendar.resource-meta.xml \
    ~/salesforce/BryntumCalendar/force-app/main/default/staticresources/bryntum_calendar.resource-meta.xml
    ```
   
    Create directory for static resource:
    ```
    mkdir ~/salesforce/BryntumCalendar/force-app/main/default/staticresources/bryntum_calendar
    ```
   
    Copy required sources to the static resource folder, required sources are:
    - JS bundle specific for LWC
    - CSS bundle
    - Locales
    - Fonts
    ```
    cd path-to-bryntum-calendar/build
    cp -r calendar.lwc.module.js calendar.stockholm.css calendar.stockholm.css.map calendar.d.ts locales/ fonts/ \
    ~/salesforce/BryntumCalendar/force-app/main/default/staticresources/bryntum_calendar
    cd ~/salesforce/BryntumCalendar/
    ```

    Push static resource to a default Scratch Org
    ```
    sfdx force:source:push
    ```
    Or from VSCode by typing to command palette: `SFDX: Push Source To Default Scratch Org`
   
7. Create Lightning Web Component

    ```
    sfdx force:lightning:component:create --type lwc -n Calendar_component -d force-app\main\default\lwc
    ```
   Or from VSCode by typing to command palette: `SFDX: Create Lightning Web Component`

8. Copy Lightning Web Component code

    ```
    cd path-to-bryntum-calendar/examples/salesforce/src/lwc/calendar_component
    cp *.js *.html *.css *.map ~/salesforce/BryntumCalendar/force-app/main/default/lwc/calendar_component
    cd ~/salesforce/BryntumCalendar/
    ```
   
   Change component definition in `calendar_component.js-meta.xml` to expose it in the Lightning App Builder:
   ```
   <isExposed>true</isExposed>
   <masterLabel>Bryntum Calendar</masterLabel>
   <description>Bryntum Calendar sample</description>
   <targets>
     <target>lightning__AppPage</target>
   </targets>
   ```

9. Push sources to Scratch Org
    
    ```
    sfdx force:source:push
    ```
    Or from VSCode by typing to command palette: `SFDX: Push Source To Default Scratch Org`
    
## Usage

To use web component we should create Lightning Application 

1. Open default org
    ```
    sfdx force:org:open
    ```
    Or from VSCode by typing to command palette: `SFDX: Open Default Org`
    
2. Open the Lightning App Builder, create new Lightning Page. Pick `App Page` then page name and layout.

3. You should see `Bryntum Calendar` custom component available for the new page. Append it to any region and save.

4. Activate the page. Click `Activation`, navigate to `Lightning Experience` tab and pick Lightning Application to append
this page to. Save the changes.

5. Open the application page. It should be accessible in the app launcher if you click it and type `Bryntum`.

If everything went correctly you should see simple calendar demo running on the Lightning Page.


## Notes

* Performance is expected to be less than on regular browser page, considering Locker Service impact.
* Performance of the **trial** bundle is expected to be even less for some tasks. For instance, opening a date picker
takes ~12ms on a normal page, ~33ms in Lightning application for release version and ~38ms for trial version.
