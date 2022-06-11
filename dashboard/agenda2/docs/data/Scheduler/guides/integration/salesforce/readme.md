<h1 class="title-with-image">
<img src="Core/logo/salesforce.svg" alt="Bryntum Scheduler supports Lightning Web Components"/>
Using Bryntum Scheduler in Salesforce Lightning Applications
</h1>

Salesforce Lightning allows using 3rd party JS libraries to create web applications. In this guide we will briefly
explain our level of support as well as known problems and challenges.

## Lightning Locker

Lightning Locker is a security architecture for Lightning components (see
[here](https://developer.salesforce.com/docs/atlas.en-us.lightning.meta/lightning/security_code.htm)
for details). Locker Service isolates components in a way which requires us to adapt our library code to this isolated environment.
Starting from API version 40 Lightning Locker is on by default. As of version 4.1.0 of our component suite, we 
offer support for it.

Bryntum Scheduler relies on a number of native Web APIs, some of which are modified (or completely blocked) by Lightning Locker.
We have tested and verified most of the features we support, including:
 - grouping
 - sorting
 - editing
 - tooltips
 - dragdrop (rows, columns, etc)
 - popup editors
 - key navigation

If you find a broken feature, please report it to our [forum](https://bryntum.com/forum/)
or [GitHub](https://github.com/bryntum/support/issues) and we will investigate it.

### Are there known issues?

Yes, there are a few known issues of varying severity. Please refer to [this guide](#Scheduler/guides/integration/salesforce/lwc.md#lightninglocker)
for more details.

## Lightning Aura components

Bryntum Scheduler includes a demo showing how to implement Lightning Component (see examples/salesforce/src/aura). At 
the time demo was implemented we did not support Lightning Locker. Locker had to be disabled by setting API version to 39.
Currently, it is not possible via Salesforce Developer Console. We plan to revisit that demo and update try to add support
for recent API versions.

Please refer to [this guide](#Scheduler/guides/integration/salesforce/aura.md) for instructions.

## Lightning Web Components

Salesforce recommends to
[always choose Lightning Web Components](https://developer.salesforce.com/docs/component-library/documentation/en/lwc/lwc.get_started_lwc_or_aura)
unless you need an unsupported feature. Please refer to [this guide](#Scheduler/guides/integration/salesforce/lwc.md)
for instructions.



<p class="last-modified">Last modified on 2022-05-30 6:38:16</p>