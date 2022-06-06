#!/usr/bin/bash
myDir=$HOME/.local/share/gnome-shell/extensions/ondo@moji.physics
myFile=$myDir/sensors.txt

if [[ -d $myDir ]];then
	if [[ -f $myFile ]];then
		ls -l $myDir/sensors.txt | awk -F" " '{print $8}'
	else
		echo "Not found"
	fi
else
	echo "No such directory"
	exit 2
fi

