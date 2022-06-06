/*
  Display CPU and Disk Temperature as Menu, sub menu item.
  Re-arranged by DLopez (GitHub@ndlopez)
  Last modified: 2021/08/31
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

const MyPopup = GObject.registerClass(
    class MyPopup extends PanelMenu.Button{
	_init(){
	    super._init(0);
	    var arr = [];//20210816
	    let icon = new St.Icon({
		//icon_name : 'security-low-symbolic',
		gicon : Gio.icon_new_for_string(Me.dir.get_path()+'/hdd-svgrepo-com.svg'),
		style_class : 'system-status-icon',
	    });
	    this.add_child(icon);

	    //other icons
	    let hddIcon = new St.Icon({
		gicon:Gio.icon_new_for_string(Me.dir.get_path()+'/hdd-svgrepo-com.svg'),style_class:'system-status-icon',});
	    let cpuIcon = new St.Icon({
		gicon:Gio.icon_new_for_string(Me.dir.get_path()+'/cpu-svgrepo-com.svg'),style_class:'system-status-icon',});
	    
	    
	    let pmItem = new PopupMenu.PopupMenuItem(mySensors[2]);
	    try{
		var [ok,out,err,exit] = GLib.spawn_command_line_sync('/usr/bin/bash '+ Me.dir.get_path() +'/get_sensors.sh 2 0');
		arr.push(ByteArray.toString(out).replace('\n',''));
	    }
	    catch(e){logError(e);}
	    //concat new Label to prev
	    pmItem.add_child(new St.Label({text: arr.join('  ')}));
	    this.menu.addMenuItem(pmItem);

	    //click event
	    /*pmItem.connect('activate',()=>{
		log('Menu item clicked');
	    });*/
	    //add disabled menuitem
	    var [ok,out,err,exit] = GLib.spawn_command_line_sync('/usr/bin/bash '+ Me.dir.get_path() +'/get_sensors.sh 3 0');
	    this.menu.addMenuItem(
		new PopupMenu.PopupMenuItem(
		    mySensors[3] + ByteArray.toString(out).replace('\n',''),{reactive: false},
		)
	    );

	    //add a separator
	    this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());

	    this.menu.connect('open-state-changed',(menu,open)=>{
		if (open){
		    log('update using gnome-extensions disable/enable');
		}//call bash get_sensors.sh
	    });
	    //CPU core temp submenu
	    //core 0
	    //var [ok,out,err,exit] = GLib.spawn_command_line_sync('/usr/bin/bash /home/diego/.local/share/gnome-shell/extensions/ondo@moji.physics/get_sensors.sh 0 1');
	    let subItem = new PopupMenu.PopupSubMenuMenuItem(mySensors[0]);
	    this.menu.addMenuItem(subItem);
	    //subItem.add_child(new St.Label({text:}));
	    //core 0
	    var [ok,out,err,exit] = GLib.spawn_command_line_sync('/usr/bin/bash '+ Me.dir.get_path() + '/get_sensors.sh 0 0');
	    //arr.push(out.toString().replace('\n',''));
	    subItem.menu.addMenuItem(new PopupMenu.PopupMenuItem(cpuSensor[0]+ByteArray.toString(out).replace('\n','')));
	    //core 1
	    var [ok,out,err,exit] = GLib.spawn_command_line_sync('/usr/bin/bash '+ Me.dir.get_path() +'/get_sensors.sh 0 1');
	    subItem.menu.addMenuItem(new PopupMenu.PopupMenuItem(cpuSensor[1]+ByteArray.toString(out).replace('\n','')));//add,0index
	    //core 2
	    var [ok,out,err,exit] = GLib.spawn_command_line_sync('/usr/bin/bash '+ Me.dir.get_path() +'/get_sensors.sh 0 2');
	    subItem.menu.addMenuItem(new PopupMenu.PopupMenuItem(cpuSensor[2]+ByteArray.toString(out).replace('\n','')));
	    //core 3
	    var [ok,out,err,exit] = GLib.spawn_command_line_sync('/usr/bin/bash '+ Me.dir.get_path() +'/get_sensors.sh 0 3');
	    subItem.menu.addMenuItem(new PopupMenu.PopupMenuItem(cpuSensor[3]+ByteArray.toString(out).replace('\n','')));

	    //section
	    //let popupMenuSection =  new PopupMenu.PopupMenuSection();
	    //popupMenuSection.actor.add_child(new PopupMenu.PopupMenuItem('NVME temp'));
	    //this.menu.addMenuItem(popupMenuSection);
	    //NVME temp submenu
	    let nvmeItem = new PopupMenu.PopupSubMenuMenuItem(mySensors[1]);
	    this.menu.addMenuItem(nvmeItem);
	    //sensor 1
	    var [ok,out,err,exit] = GLib.spawn_command_line_sync('/usr/bin/bash '+ Me.dir.get_path() +'/get_sensors.sh 1 0');
	    //arr.push(out.toString().replace('\n',''));
	    nvmeItem.menu.addMenuItem(new PopupMenu.PopupMenuItem(nvmeSensor[0]+ByteArray.toString(out).replace('\n','')));
	    //sensor 2
	    var [ok,out,err,exit] = GLib.spawn_command_line_sync('/usr/bin/bash '+ Me.dir.get_path() +'/get_sensors.sh 1 1');
	    nvmeItem.menu.addMenuItem(new PopupMenu.PopupMenuItem(nvmeSensor[1]+ByteArray.toString(out).replace('\n','')));

	    //image in item
	    var [ok,out,err,exit] = GLib.spawn_command_line_sync('/usr/bin/bash '+ Me.dir.get_path() +'/get_sensors.sh 4 0');
	    let popupImgMenuItem = new PopupMenu.PopupImageMenuItem(
		mySensors[4]+ByteArray.toString(out).replace('\n','')+"V",'face-laugh-symbolic',
	    );
	    this.menu.addMenuItem(popupImgMenuItem);

	    //add uptime on menuitem
	    var [ok,out,err,exit] = GLib.spawn_command_line_sync('/bin/bash -c "uptime | cut -f5 -d\' \'"');
	    var str = ByteArray.toString(out).replace('\n','');
	    if (str.length < 5){str="< 1hr";}
	    this.menu.addMenuItem(new PopupMenu.PopupMenuItem(
		    "Uptime  "+str,
	    ));
	    //last update
	    var now=GLib.DateTime.new_now_local();
	    var hora=now.format("%H:%M");
	    this.menu.addMenuItem(new PopupMenu.PopupMenuItem(
		"Last Updated   " + hora,{reactive:false},
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
