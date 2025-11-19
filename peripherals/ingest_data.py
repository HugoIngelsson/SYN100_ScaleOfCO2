import numpy as np
import pandas as pd
import random
import math
import json

data = pd.read_csv('data.csv')
nested_dicts = []
for row_id, row in data.iterrows():
    item = {}
    item['always-display'] = {}
    item['info-reveal'] = {}

    angle = 4 * math.log10(10 if pd.isna(row['Numeric (grams)']) or float(row['Numeric (grams)']) == 0 else float(row['Numeric (grams)']))
    item['dx'] = math.cos(angle)
    item['dy'] = math.sin(angle)
    item['carbon'] = row['Numeric (grams)']

    item['always-display']['img'] = '' if pd.isna(row['Image Name']) else row['Image Name'] + '.svg'
    item['always-display']['figcaption'] = row['Item Name']
    
    item['info-reveal']['output'] = row['CO2 (g/kg)']
    item['info-reveal']['name'] = row['Item Name']
    item['info-reveal']['description'] = '' if pd.isna(row['(Tentative) "Lively style" Description?']) else row['(Tentative) "Lively style" Description?']
    
    nested_dicts.append(item)

nested_dicts.append({
    "always-display": {
        "img": "qr.png",
        "figcaption": "Survey"
    },
    "dx": 0.00001,
    "dy": 0.00001,
    "carbon": 0.008
})

f = open('data.json', 'w')
f.write(json.dumps({'data': nested_dicts}))