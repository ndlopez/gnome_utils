/*
  Display current temperature of CPU and nvme
  Using lm_sensors CLI app
  Ref https://gitlab.com/justperfection.channel/how-to-create-a-gnome-shell-extension/-/tree/master/example@example.com
*/
const {St,GLib,Clutter} = imports.gi;
const Gio = imports.gi.Gio;
const Main = imports.ui.main;
const Mainloop = imports.mainloop;
const Me = imports.misc.extensionUtils.getCurrentExtension();

let panelBtn, panelBtnTxt, timeout;

function setButtonTxt(){
    var arr = [];
    //display date
    /*var [ok,out,err,exit] = GLib.spawn_command_line_sync('date');
    arr.push(out.toString().replace('\n',''));*/

    //display headphone icon when plugged
    let icon = new St.Icon({
	gicon: Gio.icon_new_for_string(Me.dir.get_path()+'/headphones-svgrepo-com.svg'),
	style_class:'system-status-icon',
    });
    var music=String.fromCharCode(9835);
    var [ok,out,err,exit] = GLib.spawn_command_line_sync('/usr/bin/bash /home/diego/.local/share/gnome-shell/extensions/ondotori/get_status.sh');
    if (out.toString().replace('\n','') == 'off'){
	arr.push(music +'x');
	log('get_status.sh: Headphones? ' + out.toString().replace('\n',''));}
    else{arr.push(music);}
    //disp 'private' when running certain app
    /*var [ok,out,err,exit] = GLib.spawn_command_line_sync('/bin/bash -c "ifconfig -a | grep tun0"');
      if (out.length > 0){arr.push('Private');}*/
    panelBtnTxt.set_text(arr.join('   '));
    return true;
}

function init(){
    panelBtn = new St.Bin({
	style_class:"panel-button"
    });
    panelBtnTxt = new St.Label({
	style_class:"myPanelText",
	text:"Starting...",
	y_align: Clutter.ActorAlign.CENTER,
    });
    panelBtn.set_child(panelBtnTxt);
}

function enable(){
    Main.panel._rightBox.insert_child_at_index(panelBtn,1);
    timeout=Mainloop.timeout_add_seconds(60.0,setButtonTxt);
}

function disable(){
    Mainloop.source_remove(timeout);
    Main.panel._rightBox.remove_child(panelBtn);
}
