<h1 class="title-with-image">
<img src="Core/logo/salesforce.svg" alt="Bryntum Grid supports Lightning Web Components"/>
Using Bryntum Grid as a Lightning Web Component
</h1>

<img src="Grid/salesforce_grid_demo.png" style="width: 800px; height: 320px" alt="Bryntum Grid Lightning Web Component demo"/>

## Getting started

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
    $ sfdx force:project:create -n BryntumGrid --manifest
      target dir = /home/user/salesforce
         create BryntumGrid/config/project-scratch-def.json
         create BryntumGrid/README.md
         create BryntumGrid/sfdx-project.json
         create BryntumGrid/manifest/package.xml
         create BryntumGrid/.vscode/extensions.json
         create BryntumGrid/.vscode/launch.json
         create BryntumGrid/.vscode/settings.json
         create BryntumGrid/force-app/main/default/lwc/.eslintrc.json
         create BryntumGrid/force-app/main/default/aura/.eslintrc.json
         create BryntumGrid/scripts/soql/account.soql
         create BryntumGrid/scripts/apex/hello.apex
         create BryntumGrid/.eslintignore
         create BryntumGrid/.forceignore
         create BryntumGrid/.gitignore
         create BryntumGrid/.prettierignore
         create BryntumGrid/.prettierrc
         create BryntumGrid/package.json
    $ cd BryntumGrid
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
    $ sfdx force:org:create -f config/project-scratch-def.json --setalias BryntumGrid --durationdays 30 --setdefaultusername
    Successfully created scratch org: ..., username: test-...@example.com
    ```
    Or from VS Code by typing to command palette: `SFDX: Create a Default Scratch Org`

6. Create a static resource

    Copy the static resource definition from examples directory to Salesforce DX project directory 
    ```shell
    $ cp path-to-bryntum-grid/examples/salesforce/src/staticresources/bryntum_grid.resource-meta.xml \
    ~/salesforce/BryntumGrid/force-app/main/default/staticresources/bryntum_grid.resource-meta.xml
    ```
   
    Create a directory for static resources:
    ```shell
    $ mkdir ~/salesforce/BryntumGrid/force-app/main/default/staticresources/bryntum_grid
    ```
   
    Copy required sources to the static resource folder, required sources are:
    - JS bundle specific for LWC
    - CSS bundle
    - Locales
    - Fonts
    ```shell
    $ cd path-to-bryntum-grid/build
    $ cp -r grid.lwc.module.js grid.stockholm.css grid.stockholm.css.map grid.d.ts locales/ fonts/ \
    ~/salesforce/BryntumGrid/force-app/main/default/staticresources/bryntum_grid
    $ cd ~/salesforce/BryntumGrid/
    ```
   
   You should get this folder structure
    ```shell
    $ ll force-app/main/default/staticresources/bryntum_grid
    total 4752
    drwxr-xr-x 1 user user    4096 Oct 20 16:36 ./
    drwxr-xr-x 1 user user    4096 Oct 20 16:35 ../
    drwxr-xr-x 1 user user    4096 Oct 20 16:36 fonts/
    -rw-r--r-- 1 user user  205093 Oct 20 16:36 grid.d.ts
    -rw-r--r-- 1 user user 3129856 Oct 20 16:36 grid.lwc.module.js
    -rw-r--r-- 1 user user  221654 Oct 20 16:36 grid.stockholm.css
    -rw-r--r-- 1 user user  294224 Oct 20 16:36 grid.stockholm.css.map
    drwxr-xr-x 1 user user    4096 Oct 20 16:36 locales/
    ```

    Push the static resource to the default Scratch Org
    ```shell
    $ sfdx force:source:push
    Job ID | ...
    SOURCE PROGRESS | ████████████████████████████████████████ | 1/1 Components
    === Pushed Source
    STATE  FULL NAME     TYPE            PROJECT PATH
    ─────  ────────────  ──────────────  ───────────────────────────────────────────────────────────────────────────────
    Add    bryntum_grid  StaticResource  force-app/main/default/staticresources/bryntum_grid/fonts/Roboto-Bold.woff
    Add    bryntum_grid  StaticResource  force-app/main/default/staticresources/bryntum_grid/fonts/Roboto-Bold.woff2
    Add    bryntum_grid  StaticResource  force-app/main/default/staticresources/bryntum_grid/fonts/Roboto-Light.woff
    Add    bryntum_grid  StaticResource  force-app/main/default/staticresources/bryntum_grid/fonts/Roboto-Light.woff2
    Add    bryntum_grid  StaticResource  force-app/main/default/staticresources/bryntum_grid/fonts/Roboto-Medium.woff
    Add    bryntum_grid  StaticResource  force-app/main/default/staticresources/bryntum_grid/fonts/Roboto-Medium.woff2
    Add    bryntum_grid  StaticResource  force-app/main/default/staticresources/bryntum_grid/fonts/Roboto-Regular.woff
    Add    bryntum_grid  StaticResource  force-app/main/default/staticresources/bryntum_grid/fonts/Roboto-Regular.woff2
    Add    bryntum_grid  StaticResource  force-app/main/default/staticresources/bryntum_grid/fonts/fa-solid-900.eot
    Add    bryntum_grid  StaticResource  force-app/main/default/staticresources/bryntum_grid/fonts/fa-solid-900.svg
    Add    bryntum_grid  StaticResource  force-app/main/default/staticresources/bryntum_grid/fonts/fa-solid-900.ttf
    Add    bryntum_grid  StaticResource  force-app/main/default/staticresources/bryntum_grid/fonts/fa-solid-900.woff
    Add    bryntum_grid  StaticResource  force-app/main/default/staticresources/bryntum_grid/fonts/fa-solid-900.woff2
    Add    bryntum_grid  StaticResource  force-app/main/default/staticresources/bryntum_grid/grid.d.ts
    Add    bryntum_grid  StaticResource  force-app/main/default/staticresources/bryntum_grid/grid.lwc.module.js
    Add    bryntum_grid  StaticResource  force-app/main/default/staticresources/bryntum_grid/grid.stockholm.css
    Add    bryntum_grid  StaticResource  force-app/main/default/staticresources/bryntum_grid/grid.stockholm.css.map
    Add    bryntum_grid  StaticResource  force-app/main/default/staticresources/bryntum_grid/locales/grid.locale.En.js
    Add    bryntum_grid  StaticResource  force-app/main/default/staticresources/bryntum_grid/locales/grid.locale.Nl.js
    Add    bryntum_grid  StaticResource  force-app/main/default/staticresources/bryntum_grid/locales/grid.locale.Ru.js
    Add    bryntum_grid  StaticResource  force-app/main/default/staticresources/bryntum_grid/locales/grid.locale.SvSE.js
    Add    bryntum_grid  StaticResource  force-app/main/default/staticresources/bryntum_grid.resource-meta.xml
    ```
    Or from VS Code by typing to the command palette: `SFDX: Push Source To Default Scratch Org`
   
7. Create a Lightning Web Component

    ```shell
    $ sfdx force:lightning:component:create --type lwc -n Grid_component -d force-app/main/default/lwc
    target dir = /home/user/salesforce/BryntumGrid/force-app/main/default/lwc
       create force-app/main/default/lwc/grid_component/grid_component.js
       create force-app/main/default/lwc/grid_component/grid_component.html
       create force-app/main/default/lwc/grid_component/grid_component.js-meta.xml
    ```
   Or from VS Code by typing to command palette: `SFDX: Create Lightning Web Component`

8. Copy the Lightning Web Component code

    ```shell
    $ cd path-to-bryntum-grid/examples/salesforce/src/lwc/grid_component
    $ cp *.js *.html *.css *.map ~/salesforce/BryntumGrid/force-app/main/default/lwc/grid_component
    $ cd ~/salesforce/BryntumGrid/
    ```
   
   Change the component definition in `grid_component.js-meta.xml` to expose it in the Lightning App Builder:
    ```xml
    <?xml version="1.0" encoding="UTF-8"?>
    <LightningComponentBundle xmlns="http://soap.sforce.com/2006/04/metadata">
        <apiVersion>49.0</apiVersion>
        <isExposed>true</isExposed>
        <masterLabel>Bryntum Grid</masterLabel>
        <description>Bryntum Grid sample</description>
        <targets>
          <target>lightning__AppPage</target>
        </targets>
    </LightningComponentBundle>
    ```
   
   As a result you should get a project which looks like this:
   
   <img src="Grid/salesforce_grid_project.png" style="width: 800px; height: 560px" alt="Build Grid Lightning Component project"/>

9. Push the sources to the Scratch Org
    
    ```shell
    $ sfdx force:source:push
    Job ID | ...
    SOURCE PROGRESS | ████████████████████████████████████████ | 1/1 Components
    === Pushed Source
    STATE  FULL NAME                           TYPE                      PROJECT PATH
    ─────  ──────────────────────────────────  ────────────────────────  ────────────────────────────────────────────────────────────────────
    Add    grid_component/data.js              LightningComponentBundle  force-app/main/default/lwc/grid_component/data.js
    Add    grid_component/grid_component.css   LightningComponentBundle  force-app/main/default/lwc/grid_component/grid_component.css
    Add    grid_component/grid_component.html  LightningComponentBundle  force-app/main/default/lwc/grid_component/grid_component.html
    Add    grid_component/grid_component.js    LightningComponentBundle  force-app/main/default/lwc/grid_component/grid_component.js
    Add    grid_component/grid_component.js    LightningComponentBundle  force-app/main/default/lwc/grid_component/grid_component.js-meta.xml
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

3. You should see a `Bryntum Grid` custom component available for the new page. Append it to any region and save.

4. Activate the page. Click `Activation`, navigate to `Lightning Experience` tab and pick Lightning Application to append
this page to. Save the changes.

<img src="Grid/salesforce_grid_build_ltng_app.gif" style="width: 800px; height: 472px" alt="Build Grid Lightning Component"/>

5. Open the application page. It should be accessible in the app launcher if you click it and type `Bryntum`.

If everything went well, you should see a simple grid demo running in the Lightning Page.

<img src="Grid/salesforce_grid_use_ltng_app.gif" style="width: 800px; height: 472px" alt="Use Grid Lightning Component"/>

## Lightning Locker

As of version 4.1.0, Bryntum Grid offers full support for Locker Service and can be embedded into a Lightning
Web Component (LWC) as simple as:

```
Promise.all([
    loadScript(this, GRID + '/grid.lwc.module.js'),
    loadStyle(this, GRID + '/grid.stockholm.css')
]).then(() => {
    new bryntum.grid.Grid({
        appendTo : this.template,
        ...
    });
})
```

### CSS collisions

You may encounter a CSS collision on components when loading static resources for different Bryntum products. Normally
this should not be a problem because each product bundle exports the components it is based on. Scheduler exports Grid, Gantt
exports both Scheduler and Grid. Which means you can use Grid from Gantt's static resource (please note you still need 
a license for every Bryntum product you use).

In case you have a static resource for the Grid (having grid.theme.css) and another for Scheduler (having scheduler.theme.css)
you may see some wrong styles, like the timeline header misplaced by a few pixels.

If you experience this or any other integration issue please let us know in our [forums](https://bryntum.com/forum).

### Changed and missing APIs

Lightning Locker modifies the behavior of some native APIs (and other native APIs are not supported).
We have refactored our code base to allow overriding certain behavior specifically to work with Lightning Locker. As a result
**grid.lwc.module.js only works when Lightning Locker is enabled**, it is not supposed to work in a regular page.

Overrides are organized in a single entry **lib/Grid/override/salesforce/AllOverrides.js** which you will only need 
if you want to generate a special bundle (e.g. to achieve minimum size). This entry should be imported first.

## Supported Browsers

The LWC bundle we provide only supports modern browsers since Salesforce dropped support for legacy browsers at the 
end of 2020. IE11 and old (non-Chromium based) Edge are not supported. 


<p class="last-modified">Last modified on 2022-05-30 6:38:16</p>