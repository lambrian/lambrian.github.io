import numpy as np
from PIL import Image
from collections import defaultdict
import json
import os
import glob

def to_hex_str(rgb):
    return ''.join(list(map(lambda num: ('00' + hex(num)[2:])[-2:], rgb[:3])))

def color_distance(rgb_a, rgb_b):
    return abs(int(rgb_a[0]) - int(rgb_b[0])) + abs(int(rgb_a[1]) - int(rgb_b[1])) + abs(int(rgb_a[2]) - int(rgb_b[2]))

def alike_colors(rgb_a, rgb_b, tolerance=0):
    if rgb_a is None or rgb_b is None:
        return False

    return color_distance(rgb_a, rgb_b) <= tolerance

def compute_board_img_2(filename, side_length):
    im = Image.open(filename)
    array = np.array(im)
    section_width = int(len(array) / side_length)
    seen_prevalent_colors = defaultdict(int)
    BUFFER = int(section_width * .07)
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
    
    if len(color_encoded) == side_length * side_length and len(color_map) == side_length:
        return color_encoded
    else:
        return None
    
def main():
    files = glob.glob('./output/*')
    for f in files:
        os.remove(f)

    # assign directory
    directory = 'board_img'
    
    # iterate over files in
    # that directory

    page_to_board = {}
    for filename in os.listdir(directory):
        print(filename)
        f = os.path.join(directory, filename)
     
        split_filename = filename.split("#")
        page_id = split_filename[0]
        side_length = split_filename[1]

       # checking if it is a file
        if os.path.isfile(f):
            encoded_board = compute_board_img_2(f, int(side_length))
            if encoded_board is not None:
                page_to_board[page_id] = encoded_board

    with open("output.json", "w") as f:
        f.write(json.dumps(page_to_board))
main()