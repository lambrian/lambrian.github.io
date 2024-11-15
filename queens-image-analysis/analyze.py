import numpy as np
from PIL import Image
from collections import defaultdict
import json

def to_hex_str(rgb):
    return ''.join(list(map(lambda num: ('00' + hex(num)[2:])[-2:], rgb[:3])))

def color_distance(rgb_a, rgb_b):
    return abs(int(rgb_a[0]) - int(rgb_b[0])) + abs(int(rgb_a[1]) - int(rgb_b[1])) + abs(int(rgb_a[2]) - int(rgb_b[2]))

def alike_colors(rgb_a, rgb_b, tolerance=0):
    if rgb_a is None or rgb_b is None:
        return False

    return color_distance(rgb_a, rgb_b) <= tolerance

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

# import required module
import os
import glob

def compute_board_img_2(filename):
    print(filename)
    im = Image.open(filename)
    array = np.array(im)
    side_length = 10 # TODO make variable
    section_width = int(len(array) / side_length)
    seen_prevalent_colors = defaultdict(int)
    BUFFER = int(section_width * .05)
    print(section_width)
    sector_colors = []
    for row_i in range(side_length):
        for col_i in range(side_length):
            # count all pixels
            # in section [row_i * side_length,  (row_i + 1) * side_length]
            # in columns [col_i * side_length, (col_i + 1) * side_length]
            sector_count = defaultdict(int)
            for pixel_x in range(row_i * section_width + BUFFER, (row_i + 1) * section_width - BUFFER):
                for pixel_y in range(col_i * section_width + BUFFER, (col_i + 1) * section_width - BUFFER):
                    sector_count[tuple(array[pixel_x][pixel_y])] += 1

            counts = list(map(lambda color: (color, sector_count[color]), sector_count))
            counts.sort(key=lambda color: -color[1])
            sector_colors.append(counts[0][0])
            seen_prevalent_colors[counts[0][0]] += 1
    

    color_map = {}
    color_encoded = []
    next_color_code = 0
    
    for i in range(len(sector_colors)):
        curr_color = sector_colors[i]
        color_match = None
        for encoded_color in color_map:
            if alike_colors(curr_color, encoded_color, 20):
                color_match = encoded_color
                break
        
        if color_match is None:
            color_map[curr_color] = next_color_code
            color_match = curr_color
            next_color_code += 1
            
        color_encoded.append(color_map[color_match])
    print(len(color_map), color_map)
    print(color_encoded)
    
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
    return

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


def main():
    files = glob.glob('./output/*')
    for f in files:
        os.remove(f)

    # assign directory
    directory = 'board_img'
    
    # iterate over files in
    # that directory
    for filename in os.listdir(directory):
        f = os.path.join(directory, filename)
     
       # checking if it is a file
        if os.path.isfile(f):
            compute_board_img_2(f)

main()