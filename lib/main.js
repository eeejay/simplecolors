var { Cu } = require("chrome");
var prefs = require("sdk/preferences/service");
var prefsTarget = require("sdk/preferences/event-target").PrefsTarget({});
var simplePrefs = require('sdk/simple-prefs');
var _ = require("sdk/l10n").get;

Cu.import("resource://gre/modules/Services.jsm");
Cu.import("resource://gre/modules/Prompt.jsm");

function getWindow() {
    return Services.wm.getMostRecentWindow("navigator:browser");
}

var PREF_MAP = {
    background_color: 'browser.display.background_color',
    foreground_color: 'browser.display.foreground_color',
    anchor_color: 'browser.anchor_color',
    visited_color: 'browser.visited_color'
};

var nativeWindow = getWindow().NativeWindow;
var toggleDocColorsMenu = 0;

const USE_DOC_COLORS = 'browser.display.use_document_colors';

exports.main = function (options, callbacks) {
    toggleDocColorsMenu = nativeWindow.menu.add(
     { name: _('use_document_colors'),
       icon: null,
       checkable: true,
       callback: function() {
          prefs.set(USE_DOC_COLORS,
            !prefs.get(USE_DOC_COLORS, true));
        }
    });

    prefsTarget.on(USE_DOC_COLORS, function() {
        nativeWindow.menu.update(toggleDocColorsMenu, {
            checked: prefs.get(USE_DOC_COLORS, true)
        });
    });

    nativeWindow.menu.update(toggleDocColorsMenu, {
            checked: prefs.get(USE_DOC_COLORS, true)
    });

    for (var prefName in simplePrefs.prefs) {
      simplePrefs.prefs[prefName] = prefs.get(PREF_MAP[prefName]);
      simplePrefs.on(prefName, function (name) {
        prefs.set(PREF_MAP[name], simplePrefs.prefs[name])
      })
    }
};

exports.onUnload = function (reason) {
    nativeWindow.menu.remove(toggleDocColorsMenu);
};