#!/usr/bin/env python
from pypodio2 import api
import couchdbkit

c = api.OAuthAppClient("dmworkshop", "m42dAe5V3vNq1Gg2YyMUiiV88zGi26oK2PidkQgXBPV6O7Si8HMtsNBHZTqRaiFu", 1673486, "28100dec36d64ca6852558ec2522e29f")

appreturn = c.transport.get(url = '/item/app/1673486/?limit=400')
print 'number of items found', appreturn['total']
s = couchdbkit.Server('http://127.0.0.1:5984')
db = s['dmworkshop']

vr = db.view('app/agenda', include_docs=True)
for row in vr:
    db.delete_doc(row['doc'])

i = 0
for item in appreturn['items']:
    i = i + 1
    print i, ': ', item['item_id']
    item['_id'] = str(item['item_id'])
    item['type'] = 'agenda'
    if db.doc_exist(item['_id']):
        item['_rev'] = db.get_rev(item['_id'])
    db.save_doc(item)


#db.compact()
#db.compact('app')
