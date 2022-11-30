"""
Using Python and NetworkManager on GTK
to control network
More info:
https://fedoramagazine.org/using-python-and-networkmanager-to-control-the-network/
"""
import gi

gi.require_version("NM","1.0")
from gi.repository import GLib, NM
client = NM.Client.new(None)
# print("version",client.get_version())

devices = client.get_devices()
print("devices")
for dev in devices:
    print(" -name:",dev.get_iface())
    print("  type:",dev.get_type_description())
    print("  state:",dev.get_state().value_nick)
    # get ip address if avail
    ip4 = dev.get_ip4_config()
    if ip4 is not None:
        print("  addresses")
        for num in ip4.get_addresses():
            print("    - {}/{}".format(num.get_address(),num.get_prefix()))
        print("    routes")
        for route in ip4.get_routes():
            print("    - {}/{} via {}".format(route.get_dest(),route.get_prefix(),route.get_next_hop()))

