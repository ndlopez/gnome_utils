/*
  Display CPU and Disk Temperature as Menu, sub menu item.
  Re-arranged by DLopez (GitHub@ndlopez)
  Last modified: 2021/09/01
  Ref1 https://www.youtube.com/watch?v=ZpKlJVp-V7o
  Ref2 https://gitlab.com/justperfection.channel/how-to-create-a-gnome-shell-extension/-/tree/master/example8%40example8.com
*/
const Main = imports.ui.main;
const St = imports.gi.St;
const ByteArray = imports.byteArray;//20210818
const GLib = imports.gi.GLib;//20210816
const GObject = imports.gi.GObject;
const Gio = imports.gi.Gio;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const Me = imports.misc.extensionUtils.getCurrentExtension();

const mySensors = ["CPU Core Temp","NVME Temp","WiFi card ","ACPI Interface ","Batttery "];
const cpuSensor = ["Core 0 ","Core 1 ","Core 2 ","Core 3 "];
const nvmeSensor = ["Sensor 1 ","Sensor 2 "];

let myPopup;
function getScript(dev,par){
    var myOut = "";
    var sensorPar = "/get_sensors.sh "+dev.toString() + " " + par.toString();
    log("ondo@moji: "+sensorPar);
    try{
	var [ok,out,err,exit] = GLib.spawn_command_line_sync('/usr/bin/bash ' + Me.dir.get_path() + sensorPar);
	myOut=ByteArray.toString(out).replace('\n','');
	log("ondo@moji: "+out);
    }catch(e){logError(e);}
    return myOut;
}

const MyPopup = GObject.registerClass(
    class MyPopup extends PanelMenu.Button{
	_init(){
	    super._init(0);
	    var arr = [];//20210816
	    let icon = new St.Icon({
		//icon_name : 'security-low-symbolic',
		//gicon : Gio.icon_new_for_string(Me.dir.get_path()+'/hdd-svgrepo-com.svg'),
		gicon : Gio.icon_new_for_string(Me.dir.get_path()+'/tacometer-svgrepo-com.svg'),
		style_class : 'system-status-icon',
	    });
	    this.add_child(icon);

	    //other icon
	    let cpuIcon = new St.Icon({
		gicon:Gio.icon_new_for_string(Me.dir.get_path()+'/cpu-svgrepo-com.svg'),style_class:'system-status-icon',});
	    
	    //Wifi Card
	    let pmItem = new PopupMenu.PopupMenuItem(mySensors[2]);
	    var fromWiFi = getScript(2,0);
	    arr.push(fromWiFi);

	    //concat new Label to prev
	    pmItem.add_child(new St.Label({text: arr.join('  ')}));
	    this.menu.addMenuItem(pmItem);

	    //click event
	    pmItem.connect('activate',()=>{
	
		log('clicked and should update' + getScript(2,0));
	    });
	    //add disabled menuitem
	    var fromAcpi = getScript(3,0);
	    this.menu.addMenuItem(
		new PopupMenu.PopupMenuItem(
		    mySensors[3] + fromAcpi,{reactive: false},
		)
	    );

	    //add a separator
	    this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());

	    /*this.menu.connect('open-state-changed',(menu,open)=>{
		if (open){
		    log('update using gnome-extensions disable/enable');
		}//call bash get_sensors.sh
	    });*/
	    //CPU core temp submenu
	    //core 0
	    let subItem = new PopupMenu.PopupSubMenuMenuItem(mySensors[0]);
	    this.menu.addMenuItem(subItem);
	    //subItem.add_child(new St.Label({text:}));

	    //Core0~3
	    for (let idx in cpuSensor){
		var fromCore = getScript(0,idx);
		subItem.menu.addMenuItem(new PopupMenu.PopupMenuItem(cpuSensor[idx]+fromCore));
	    }
	    
	    //NVME temp submenu
	    let nvmeItem = new PopupMenu.PopupSubMenuMenuItem(mySensors[1]);
	    this.menu.addMenuItem(nvmeItem);

	    //NVMEsensor 1~2
	    for (let jdx in nvmeSensor){
		var fromNvme = getScript(1,jdx);
		nvmeItem.menu.addMenuItem(new PopupMenu.PopupMenuItem(nvmeSensor[jdx]+fromNvme));
	    }

	    //icon in item, Battery status
	    var fromBat = getScript(4,0);
	    if (fromBat.length < 7){//NotOffline
		fromBat+=" V";
	    }
	    let popupImgMenuItem = new PopupMenu.PopupImageMenuItem(
		mySensors[4]+fromBat,'face-laugh-symbolic',
	    );
	    this.menu.addMenuItem(popupImgMenuItem);

	    //add uptime on menuitem
	    var [ok,out,err,exit] = GLib.spawn_command_line_sync('/bin/bash -c "uptime | cut -f5 -d\' \'"');
	    var upStr = ByteArray.toString(out).replace('\n','');
	    if (upStr.length < 5){upStr="< 1hr";}
	    this.menu.addMenuItem(new PopupMenu.PopupMenuItem(
		    "Uptime  "+upStr,
	    ));
	    //last update
	    var now=GLib.DateTime.new_now_local();
	    var hora=now.format("%H:%M");
	    this.menu.addMenuItem(new PopupMenu.PopupMenuItem(
		"Last Updated   " + hora,{reactive:false},
	    ));
	    this.menu.addMenuItem(new PopupMenu.PopupMenuItem(
		"Github@ndlopez",{reactive:false},
	    ));
	}
    }

);

function init(){}

function enable(){
    myPopup = new MyPopup();
    Main.panel.addToStatusArea('myPopup',myPopup,1);
}

function disable(){
    myPopup.destroy();
}
