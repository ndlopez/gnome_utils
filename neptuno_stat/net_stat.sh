#!/bin/bash
# Monitor traffic on WiFi
pf="" #prefix
declare -i rpf=0 #prefix rate
frpf=0.0 #prefix rate float
wlan_device=wlp0s20f3
rj45_device=enp0s31f6
device=${rj45_device}
#device=${wlan_device}
interval=1

function pre_conf(){
	pf=""
	rpf=$1
	frpf=$1
	if [[ $rpf -ge 1024 ]];then
		frpf=$(echo "scale=1; $frpf/1024.0" | bc)
		rpf=$(( $rpf/1024 ))
		pf="k"
	fi
	if [[ $rpf -ge 1024 ]];then
		frpf=$(echo "scale=1; $frpf/1024.0" | bc)
		rpf=$(( $rpf/1024))
		pf="M"
	fi
	if [[ $rpf -ge 1024 ]];then
		frpf=$(echo "scale=2; $frpf/1024.0" | bc)
		pf="G"
	fi
}

rx1=`ifconfig | grep $device -A7 | awk '/RX.*bytes/{print $5;}'`
tx1=`ifconfig | grep $device -A7 | awk '/TX.*bytes/{print $5;}'`

#if [[ $? != 0 ]];then
#    device=$ethdev
#fi

#to get rate uncomment the following...
#sleep $interval
#rx2=`ifconfig | grep $device -A7 | awk '/RX.*bytes/{print $5;}'`
#tx2=`ifconfig | grep $device -A7 | awk '/TX.*bytes/{print $5;}'`
#clear
#rx=$(( (($rx2-$rx1)/$interval)*8 ))
#tx=$(( (($tx2-$tx1)/$interval)*8 ))

#echo -n "traffic Down:"
pre_conf $rx1
if [[ ${frpf} > 0 ]];then
	echo -n "${frpf}${pf}b"
else
	echo -n "Offline"
fi
#echo -n "traffic Up:"
pre_conf $tx1
echo " ${frpf}${pf}b"

