import numpy as np
from PIL import Image
from collections import defaultdict
import json
import os
import glob

def compute_row(array, row):
    curr_row_colors = []
    prev_color = None
    curr_color_count = 0
    for col in range(len(array[0])):
        curr_color = array[row][col]
                              
        if not alike_colors(prev_color, curr_color, 20):
            curr_row_colors.append((curr_color, curr_color_count))
            curr_color_count = 1
            prev_color = curr_color
        else:
            curr_color_count += 1

    curr_row_colors = list(filter(lambda color: color[1] > 10, curr_row_colors))
    return list(map(lambda color: color[0], curr_row_colors))

def compute_board_img(filename):
    print(filename)
    im = Image.open(filename)
    array = np.array(im)

    # arbitrary index into first row
    curr_row_colors = compute_row(array, int(len(array) / 10) * 1 + 30)
    print(len(curr_row_colors), curr_row_colors)
    num_color_rows = len(curr_row_colors)

    rows = []
    for curr_row in range(num_color_rows):
        row_colors = compute_row(array, int(len(array) / num_color_rows) * curr_row + 30)
        rows.append(row_colors)

    for row_i in range(len(rows)):
        print(len(rows[row_i]), list(map(lambda color: to_hex_str(color), rows[row_i])))

    # TODO add validation that it's a square matrix

    color_map = {}
    color_encoded = []
    curr_color_encode = 0
    
    for curr_row_i in range(len(rows)):
        curr_color_encoded = []
        for curr_col_j in range(len(rows[curr_row_i])):
            curr_color = rows[curr_row_i][curr_col_j]
            if not curr_color in color_map:
                color_map[curr_color] = curr_color_encode
                curr_color_encode += 1

            curr_color_encoded.append(color_map[curr_color])
        color_encoded.append(curr_color_encoded)
    flattened_colors = []
    for i in range(len(color_encoded)):
        for j in range(len(color_encoded)):
            flattened_colors.append(color_encoded[i][j])

    basename = os.path.splitext(os.path.basename(filename))[0]

    with open("output/%s.json" % basename, "w") as f:
        f.write(json.dumps(flattened_colors))