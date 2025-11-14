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

    item['dx'] = random.random() * 2 - 1
    item['dy'] = math.sqrt(1 - item['dx'] ** 2) * (1 if random.random() < 0.5 else -1)
    item['carbon'] = row['Numeric (grams)']

    item['always-display']['img'] = '' if pd.isna(row['Image Name']) else row['Image Name']
    item['always-display']['figcaption'] = row['Item Name']
    
    item['info-reveal']['output'] = row['CO2 (g/kg)']
    item['info-reveal']['name'] = row['Item Name']
    item['info-reveal']['description'] = '' if pd.isna(row['Brief Description (~20 words)']) else row['Brief Description (~20 words)']
    
    nested_dicts.append(item)

f = open('dump.json', 'w')
f.write(json.dumps({'data': nested_dicts}))