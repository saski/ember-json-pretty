﻿import Ember from 'ember';

var _replacer = function(match, pIndent, pKey, pVal, pEnd) {
    var key = '<span class=json-key>';
    var val = '<span class=json-value>';
    var str = '<span class=json-string>';
    var brace = '<span class=json-brace>';
    var bracket = '<span class=json-bracket>';
    var bracketInternal = '<span class=json-bracket-internal>';
    var blank = '<span class=json-blank>';
    var comma = '<span class=json-comma>,</span>';
    var twoPoints = '<span class=json-two-points>: </span>';
    var r = pIndent || '';

    if (pKey){
        r = r + key + pKey.replace(/[": ]/g, '') + '</span>' + twoPoints;
        if(pEnd !== undefined && (pEnd.trim() === '[' || pEnd.trim() === ']')){
            r = r + bracketInternal + pEnd + '</span>';
            pEnd = '';
        }
    }
    if (pVal){
        r = r + (pVal[0] === '"' ? str : val) + pVal + '</span>';
    }
    if(match.trim() === '},' && pEnd === undefined){
        r = r + blank + match.replace('},', '') + '</span>' + brace + match.replace(',','').trim() + '</span>' + comma;
        pEnd = '';
    }
    if(match.trim() === '{' || (match.trim() === '}' && pEnd !== '')){
        r = r + blank + match.replace('}', '').replace('{', '') + '</span>' + brace + match.trim() + '</span>';
        pEnd = '';
    }
    if(match.trim() === '[' || match.trim() === ']'){
        r = r + bracket + match + '</span>';
        pEnd = '';
    }
    return r + (pEnd || '');
};

var _replaceKeyStyle = function(jsonHTML, keyColor, keyHighlight){
    return jsonHTML
            .replace(   /<span class=json-key>/g,
                        '<span class=json-key style="color:' + keyColor + '; background-color:' + keyHighlight + ';">'
                    );
};

var _replaceValueStyle = function(jsonHTML, valueColor, valueHighlight){
    return jsonHTML
            .replace(   /<span class=json-value>/g,
                        '<span class=json-value style="color:' + valueColor + '; background-color:' + valueHighlight + ';">'
                    );
};

var _replaceStringStyle = function(jsonHTML, stringColor, stringHighlight){
    return jsonHTML
            .replace(   /<span class=json-string>/g,
                        '<span class=json-string style="color:' + stringColor + '; background-color:' + stringHighlight + ';">'
                    );
};

var _replaceBraceStyle = function(jsonHTML, braceColor, braceHighlight){
    return jsonHTML
            .replace(   /<span class=json-brace>/g,
                        '<span class=json-brace style="color:' + braceColor + '; background-color:' + braceHighlight + ';">'
                    );
};

var _replaceBracketStyle = function(jsonHTML, bracketColor, bracketHighlight){
    return jsonHTML
            .replace(   /<span class=json-bracket>/g,
                        '<span class=json-bracket style="color:' + bracketColor + '; background-color:' + bracketHighlight + ';">'
                    )
            .replace(   /<span class=json-bracket-internal>/g,
                        '<span class=json-bracket-internal style="color:' + bracketColor + '; background-color:' + bracketHighlight + ';">'
                    );
};

var _prettyPrint = function(    obj,
                                keyColor, keyHighlight,
                                valueColor, valueHighlight,
                                stringColor, stringHighlight,
                                braceColor, braceHighlight,
                                bracketColor, bracketHighlight) {
    var jsonLine = /^( *)("[\w]+": )?("[^"]*"|[\w.+-]*)?([,[{])?([,[}])?([,[},])?$/mg,
        jsonHTML = JSON.stringify(obj, null, 3)
            .replace(/&/g, '&amp;').replace(/\\"/g, '&quot;')
            .replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(jsonLine, _replacer);

        jsonHTML = _replaceKeyStyle(jsonHTML, keyColor, keyHighlight);
        jsonHTML = _replaceValueStyle(jsonHTML, valueColor, valueHighlight);
        jsonHTML = _replaceStringStyle(jsonHTML, stringColor, stringHighlight);
        jsonHTML = _replaceBraceStyle(jsonHTML, braceColor, braceHighlight);
        jsonHTML = _replaceBracketStyle(jsonHTML, bracketColor, bracketHighlight);

    return jsonHTML;
};

export default Ember.Component.extend({
    tagName: 'pre',
    keyColor: '#A52A2A',
    keyHighlight: '#FFFFFF00',
    valueColor: '#000080',
    valueHighlight: '#FFFFFF00',
    stringColor: '#C0FF3E',
    stringHighlight: '#FFFFFF00',
    braceColor: '#000000',
    braceHighlight: '#FFFFFF00',
    bracketColor: '#000000',
    bracketHighlight: '#FFFFFF00',
    pretty: function () {
        var jsonObj = this.get('jsonObj'),
            keyColor = this.get('keyColor'),
            keyHighlight = this.get('keyHighlight'),
            valueColor = this.get('valueColor'),
            valueHighlight = this.get('valueHighlight'),
            stringColor = this.get('stringColor'),
            stringHighlight = this.get('stringHighlight'),
            braceColor = this.get('braceColor'),
            braceHighlight = this.get('braceHighlight'),
            bracketColor = this.get('bracketColor'),
            bracketHighlight = this.get('bracketHighlight'),
            json_pretty = _prettyPrint( jsonObj,
                                        keyColor, keyHighlight,
                                        valueColor, valueHighlight,
                                        stringColor, stringHighlight,
                                        braceColor, braceHighlight,
                                        bracketColor, bracketHighlight);
        
        return Ember.String.htmlSafe(json_pretty);
    }.property('jsonObj'),
});