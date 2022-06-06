# Read JSON output from <sensors> app and return coreTemp
import sys,json
myDir = '$home/.local/share/gnome-shell/extensions/ondotori/'
#inKey = sys.argv[1]
#print(inKey)
sensorIdx = int(sys.argv[1])
keyIdx=int(sys.argv[2])

with open(myDir + 'sensors.json','r') as myFile:
    data = myFile.read()
myFile.close()

sensorData = json.loads(data)
#print("wifi_temp"+str(sensorData['iwlwifi_1-virtual-0']['temp1']))
sensorKeys = []
for item in sensorData:
    myLen = len(sensorData[item])
    sensorKeys.append(myLen)

keysVec = list(sensorData.keys())
#sensorDict = dict([(keysVec[0],sensorKeys[0])])

coreKeys = []
#keyIdx=3
for item in sensorData[keysVec[sensorIdx]]:#2=coreTemp,#3=nvmeTemp
    #print(item)
    coreKeys.append(item)
myOut = 'temp' + str(keyIdx) +'_input'
#print(keysVec[2],coreKeys[3])
print(coreKeys[keyIdx],":",sensorData[keysVec[sensorIdx]][coreKeys[keyIdx]][myOut])
