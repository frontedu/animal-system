class Link extends Widget {
    static get configurable() {
        return {
            external : null,
            href     : null,
            target   : '_blank',
            text     : null
        };
    }

    compose() {
        const { external, href, target, text } = this;

        return {
            children : {
                linkElement : {
                    tag : 'a',
                    href,
                    text
                },

                externalLinkElement : external && {
                    tag   : 'a',
                    class : {
                        'b-fa'                   : 1,
                        'b-fa-external-link-alt' : 1
                    },
                    href,
                    target
                }
            }
        };
    }
}

class CopyableLink extends Link {
    static get configurable() {
        return {
            copyIcon : 'b-fa-copy'
        };
    }

    compose() {
        const { copyIcon } = this;

        return {
            children : {
                // Insert copyIconElement before inherited externalLinkElement:
                'copyIconElement > externalLinkElement' : {
                    tag   : 'span',
                    class : {
                        'b-fa'     : 1,
                        [copyIcon] : 1
                    },
                    listeners : {
                        click : 'onCopyLink'
                    }
                }
            }
        };
    }

    onCopyLink(event) {
        navigator.clipboard?.writeText(this.linkElement.href);
    }
}

const link = new CopyableLink({
    appendTo : targetElement,
    text     : 'Copyable link',
    href     : '#foo'
});
