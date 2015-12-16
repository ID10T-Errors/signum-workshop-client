const Remarkable = require('remarkable')
const hljs = require('highlight.js')

var md = new Remarkable('full', {
    html: false,
    xhtmlOut: true,
    linkify: true,
    langPrefix: 'language-',
    highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return hljs.highlight(lang, str).value
            } catch (e) {
            }
        }

        try {
            return hljs.highlightAuto(str).value
        } catch (e) {
        }

        return '';
    }
})

export function toHtml (markdown) {
    return md.render(markdown)
}

