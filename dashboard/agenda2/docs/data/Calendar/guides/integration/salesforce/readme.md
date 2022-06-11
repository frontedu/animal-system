<h1 class="title-with-image">
<img src="Core/logo/salesforce.svg" alt="Bryntum Calendar supports Lightning Web Components"/>
Using Bryntum Calendar in Salesforce Lightning Applications
</h1>

Salesforce Lightning allows using 3rd party JS libraries to create web applications. In this guide we will briefly
explain our level of support as well as known problems and challenges.

## Lightning Locker

Lightning Locker is a security architecture for Lightning components (see
[here](https://developer.salesforce.com/docs/atlas.en-us.lightning.meta/lightning/security_code.htm)
for details). Locker Service isolates components in a way which requires us to adapt our library code to this isolated environment.
Starting from API version 40 Lightning Locker is on by default. As of version 4.1.0 of our component suite, we 
offer support for it.

Bryntum Calendar relies on a number of native Web APIs, some of which are modified (or completely blocked) by Lightning Locker.
We have tested and verified most of the features we support, including:
 - editing
 - tooltips
 - dragdrop
 - popup editors
 - key navigation

If you find a broken feature, please report it to our [forum](https://bryntum.com/forum/)
or [GitHub](https://github.com/bryntum/support/issues) and we will investigate it.

### Are there known issues?

Yes, there are a few known issues of varying severity. Please refer to [this guide](#Calendar/guides/integration/salesforce/lwc.md#lightninglocker)
for more details.


## Lightning Web Components

Salesforce recommends to
[always choose Lightning Web Components](https://developer.salesforce.com/docs/component-library/documentation/en/lwc/lwc.get_started_lwc_or_aura)
unless you need an unsupported feature. Please refer to [this guide](#Calendar/guides/integration/salesforce/lwc.md)
for instructions.



<p class="last-modified">Last modified on 2022-05-30 6:38:15</p>