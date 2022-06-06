# Read JSON output from <sensors> app and return coreTemp
import sys,json
myDir = '$HOME/.local/share/gnome-shell/extensions/ondo@moji.physics/'

if len(sys.argv) < 3:
    print('Pls! input sensorIndex and keyIndex as params')
    quit()
else:
    sensorIdx = int(sys.argv[1])
    keyIdx = int(sys.argv[2])

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
for item in sensorData[keysVec[sensorIdx]]:#2=coreTemp,#3=nvmeTemp
    #print(item)
    coreKeys.append(item)

if sensorIdx > 4 or keyIdx < 6:
    myOut = 'temp' + str(keyIdx) +'_input'
    print("   ",sensorData[keysVec[sensorIdx]][coreKeys[keyIdx]][myOut],"\u2103")
else:
    print('Error')

