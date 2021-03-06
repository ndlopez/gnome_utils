/*
  Display network and uptime status
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

    //display uptime
    /*
    var [ok,out,err,exit] = GLib.spawn_command_line_sync('/bin/bash -c "uptime |cut -f5 -d\' \'"');
    var str = imports.byteArray.toString(out).replace('\n','');
    if(str.length < 5){
	str = "< 1hr";
    }
    arr.push('Up ' + str);
    log('neptuno stat: Uptime output '+ str);*/
    
    //disp 'private' when running certain app
    //var [ok,out,err,exit] = GLib.spawn_command_line_sync('/bin/bash -c "ifconfig -a | grep wlp0"');
    //if (out.length > 0){arr.push('Private');}
    const shNetStat = "/net_stat.sh";
    var [ok,out,err,exit] = GLib.spawn_command_line_sync('/bin/bash ' + Me.dir.get_path() + shNetStat);
    var dat= imports.byteArray.toString(out).replace('\n','');
    var myArr = dat.split(' ');
    arr.push('↓'+myArr[0]);
    log('neptuno stat: Wifi traffic '+dat);
    panelBtnTxt.set_text(arr.join(' '));
    return true;
}

function init(){
    panelBtn = new St.Bin({
	style_class:"panel-button"
    });
    panelBtnTxt = new St.Label({
	style_class:"myPanelText",
	text:"Updating...",
	y_align: Clutter.ActorAlign.CENTER,
    });
    panelBtn.set_child(panelBtnTxt);
}

function enable(){
    Main.panel._rightBox.insert_child_at_index(panelBtn,1);
    timeout=Mainloop.timeout_add_seconds(300.0,setButtonTxt);
}

function disable(){
    Mainloop.source_remove(timeout);
    Main.panel._rightBox.remove_child(panelBtn);
}
