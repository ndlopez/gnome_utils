const Gio = imports.gi.Gio;
const St = imports.gi.St;
const GLib = imports.gi.GLib;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;


class Extension {
    constructor() {
        this._indicator = null;
        
        this.settings = ExtensionUtils.getSettings(
            'org.gnome.shell.extensions.example');
    }
    
    enable() {
        log(`enabling ${Me.metadata.name}`);

        let indicatorName = `${Me.metadata.name} Indicator`;
        
        // Create a panel button
        this._indicator = new PanelMenu.Button(0.0, indicatorName, false);
        
        // Add an icon
        let iconH = new St.Icon({
            //gicon: Gio.icon_new_for_string(Me.dir.get_path()+'/earphones-svgrepo-com.svg'),
            gicon: Gio.icon_new_for_string(Me.dir.get_path()+'/headphones-svgrepo-com.svg'),
	    //new Gio.ThemedIcon({name: 'face-laugh-symbolic'}),
            style_class: 'system-status-icon',
        });
        let iconS = new St.Icon({
            gicon: Gio.icon_new_for_string(Me.dir.get_path()+'/speaker-svgrepo-com.svg'),
	    //new Gio.ThemedIcon({name: 'face-laugh-symbolic'}),
            style_class: 'system-status-icon',
        });
	try{
	    var [ok,out,err,exit] = GLib.spawn_command_line_sync('/bin/bash -c "amixer -c 0 cget numid=12,iface=CARD | awk -F\"=\" \'NR==3 {print $2;}\'"');
	    var statOut = imports.byteArray.toString(out).replace('\n','');
	    if (statOut.length >2){
		this._indicator.add_child(iconS);
		//log('Output of amixer: '+statOut);
	    }
	    else{
		this._indicator.add_child(iconH);
		//log('Output of amixer: '+statOut);
	    }
	}
	catch(e){logError(e);}

        // Bind our indicator visibility to the GSettings value
        // NOTE: Binding properties only works with GProperties (properties
        // registered on a GObject class), not native JavaScript properties
        this.settings.bind(
            'show-indicator',
            this._indicator,
            'visible',
            Gio.SettingsBindFlags.DEFAULT
        );

        Main.panel.addToStatusArea(indicatorName, this._indicator);
    }
    
    disable() {
        log(`disabling ${Me.metadata.name}`);

        this._indicator.destroy();
        this._indicator = null;
    }
}

function init() {
    log(`initializing ${Me.metadata.name}`);
    
    return new Extension();
}
