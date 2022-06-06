#!/usr/bin/bash
#Get status of headphone jack
amixer -c 0 cget numid=12,iface=CARD | awk -F"=" 'NR==3 {print $2;}'

