import numpy as np
import pandas as pd
import random
import math
import json

data = pd.read_csv('data.csv')
nested_dicts = []
last_angle, tot_delta = 0, 0
for row_id, row in data.iterrows():
    item = {}
    item['always-display'] = {}
    item['info-reveal'] = {}

    angle = 2 * math.log10(10 if pd.isna(row['Numeric (grams)']) or float(row['Numeric (grams)']) == 0 else float(row['Numeric (grams)'])) + tot_delta
    while (abs(angle - last_angle) % (2 * math.pi) <= math.pi / 3):
        angle += math.pi / 3
        tot_delta += math.pi / 3

    item['dx'] = math.cos(angle)
    item['dy'] = math.sin(angle)
    item['carbon'] = row['Numeric (grams)']

    item['always-display']['img'] = '' if pd.isna(row['Image Name']) else row['Image Name'] + '.svg'
    item['always-display']['figcaption'] = row['Shortened Name']
    
    item['info-reveal']['output'] = row['CO2 (g/kg)']
    item['info-reveal']['name'] = row['Item Name']
    item['info-reveal']['description'] = '' if pd.isna(row['(Tentative) "Lively style" Description?']) else row['(Tentative) "Lively style" Description?']
    
    nested_dicts.append(item)
    last_angle = angle

nested_dicts.append({
    "always-display": {
        "img": "qr.png",
        "figcaption": "Survey"
    },
    "dx": 0.00001,
    "dy": 0.00001,
    "carbon": 0.008
})

nested_dicts.append({
    "fun-fact": {
        "h1": "Did you know?",
        "p": "By 2030, AI will be using the amount of energy that Japan uses today."
    },
    "dx": -0.74,
    "dy": 0.74,
    "carbon": 1
})

f = open('data.json', 'w')
f.write(json.dumps({'data': nested_dicts}))