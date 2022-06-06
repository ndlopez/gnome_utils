#!/usr/bin/bash
#Get uptime of $this pc
/usr/bin/uptime | cut -f5 -d' ' | cut -f1 -d','

