#!/usr/bin/env python
from pypodio2 import api
import couchdbkit

c = api.OAuthAppClient("dmworkshop", "m42dAe5V3vNq1Gg2YyMUiiV88zGi26oK2PidkQgXBPV6O7Si8HMtsNBHZTqRaiFu", 1672981, "4eea55bff0ef4a38ac5c53f35949c3a3")

appreturn = c.transport.get(url = '/item/app/1672981/?limit=200')

s = couchdbkit.Server('http://127.0.0.1:5984')
db = s['dmworkshop']

vr = db.view('app/participants_confirmed', include_docs=True)
for row in vr:
    db.delete_doc(row['doc'])
i = 0

for item in appreturn['items']:
    i = i + 1
    print i, ': ', item['item_id']
    item['_id'] = str(item['item_id'])
    item['type'] = 'participant'
    if db.doc_exist(item['_id']):
        item['_rev'] = db.get_rev(item['_id'])
    db.save_doc(item)


