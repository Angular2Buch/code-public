/* */ 
"format cjs";
// Some of the code comes from WebComponents.JS
// https://github.com/webcomponents/webcomponentsjs/blob/master/src/HTMLImports/path.js
import { RegExpWrapper, StringWrapper, isPresent } from 'angular2/src/core/facade/lang';
/**
 * Rewrites URLs by resolving '@import' and 'url()' URLs from the given base URL,
 * removes and returns the @import urls
 */
export function resolveStyleUrls(resolver, baseUrl, cssText) {
    var foundUrls = [];
    cssText = extractUrls(resolver, baseUrl, cssText, foundUrls);
    cssText = replaceUrls(resolver, baseUrl, cssText);
    return new StyleWithImports(cssText, foundUrls);
}
export class StyleWithImports {
    constructor(style, styleUrls) {
        this.style = style;
        this.styleUrls = styleUrls;
    }
}
function extractUrls(resolver, baseUrl, cssText, foundUrls) {
    return StringWrapper.replaceAllMapped(cssText, _cssImportRe, (m) => {
        var url = isPresent(m[1]) ? m[1] : m[2];
        foundUrls.push(resolver.resolve(baseUrl, url));
        return '';
    });
}
function replaceUrls(resolver, baseUrl, cssText) {
    return StringWrapper.replaceAllMapped(cssText, _cssUrlRe, (m) => {
        var pre = m[1];
        var originalUrl = m[2];
        if (RegExpWrapper.test(_dataUrlRe, originalUrl)) {
            // Do not attempt to resolve data: URLs
            return m[0];
        }
        var url = StringWrapper.replaceAll(originalUrl, _quoteRe, '');
        var post = m[3];
        var resolvedUrl = resolver.resolve(baseUrl, url);
        return pre + "'" + resolvedUrl + "'" + post;
    });
}
var _cssUrlRe = /(url\()([^)]*)(\))/g;
var _cssImportRe = /@import\s+(?:url\()?\s*(?:(?:['"]([^'"]*))|([^;\)\s]*))[^;]*;?/g;
var _quoteRe = /['"]/g;
var _dataUrlRe = /^['"]?data:/g;
//# sourceMappingURL=style_url_resolver.js.map