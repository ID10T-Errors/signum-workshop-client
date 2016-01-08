/*
    Copyright 2016 Signum Collective
    
    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at
    
      http://www.apache.org/licenses/LICENSE-2.0
    
    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/

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

