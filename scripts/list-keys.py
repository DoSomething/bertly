import short_url

START_COUNTER = 46237404 # as of June 8th 6:00pm
END_COUNTER = 48232176   # as of July 22nd 11:50am

"""
This script outputs any shortlink keys that Bertly would generate
from the given START_COUNTER to END_COUNTER.

 Usage:
 $ python list-keys.txt > keys.txt

"""
if __name__ == "__main__":
    for id in range(START_COUNTER, END_COUNTER):
        key = short_url.encode_url(id)
        print(key)
