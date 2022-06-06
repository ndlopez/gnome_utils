#!/bin/bash
myDir=$HOME/.local/share/gnome-shell/extensions/ondo@moji.physics

card=$1
idx=$2

cards=("coretemp-isa-0000" "nvme-pci-0100" "iwlwifi_1-virtual-0" "acpitz-acpi-0" "BAT1-acpi-0")
datLen=(6 5 2 2 2)
offset=(4 5 3 3 3)

#outFile=sensors.txt

get_temp_data(){
    local myIdx=`expr $idx + ${offset[$card]}`
    #echo $myIdx ${datLen[$card]} ${cards[$card]}
    #mycom = `awk -F" " 'NR=='$myIdx' {print $2;}'`
    if [[ $card > 1 ]]; then
	#out=$(cat $outFile | grep -A ${datLen[$card]} ${cards[$card]} | awk -F" " 'NR=='$myIdx' {print $2;}')
	out=$(sensors | grep -A ${datLen[$card]} ${cards[$card]} | awk -F" " 'NR=='$myIdx' {print $2;}')
    else
	#out=$(cat $outFile | grep -A ${datLen[$card]} ${cards[$card]} | awk -F" " 'NR=='$myIdx' {print $3;}')
	out=$(sensors | grep -A ${datLen[$card]} ${cards[$card]} | awk -F" " 'NR=='$myIdx' {print $3;}')
    fi
    if [[ -z $out ]];then
	echo "Offline"
    else
	echo $out
    fi
}

if [[ -d $myDir ]];then
	cd $myDir
	#sensors -j 2> err.log 1> sensors.json
	#sensors 2> err.log 1> $outFile
	get_temp_data $card $idx
else
	echo "$myDir not found"
fi

