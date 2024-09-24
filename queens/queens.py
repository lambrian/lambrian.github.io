import random
import math
import re
from dataclasses import dataclass
import sys

@dataclass
class Cell:
    color: int
    is_queen: bool

    def __init__(self, color: int = 0, is_queen: bool = False):
        self.color = color
        self.is_queen = is_queen

@dataclass
class Board:
    grid: list[list[Cell]]
    size: int

    def cell_at(x: int, y: int):
        # TODO check size
        return grid[x][y]
    
    def __init__(self, size: int):
        self.size = size
        self.grid = [[Cell() for i in range(size)] for j in range(size)]

def test():
    num_rows = random.randint(4, 11)
    board = Board(num_rows)
    valid_queen_spots = set([(i, j) for i in range(num_rows) for j in range(num_rows)])
    for i in range(num_rows):
        if not len(valid_queen_spots):
            print("Could not generate valid board. Breaking.")
            return None

        queen_spot = pop_random_from_set(valid_queen_spots)
        # remove all elements in row and column
        valid_queen_spots = set(filter(lambda valid_cell: valid_cell[0] != queen_spot[0] and\
                                                          valid_cell[1] != queen_spot[1] and\
                                                          valid_cell != (queen_spot[0] - 1, queen_spot[1] - 1) and\
                                                          valid_cell != (queen_spot[0] + 1, queen_spot[1] - 1) and\
                                                          valid_cell != (queen_spot[0] - 1, queen_spot[1] + 1) and\
                                                          valid_cell != (queen_spot[0] + 1, queen_spot[1] + 1), valid_queen_spots))
        print(*queen_spot)
        board.cell_at(*queen_spot).is_queen = True
    return grid

def pop_random_from_set(s):
    rand_index = random.randint(0, len(s) - 1)
    rand_value = list(s)[rand_index]
    s.remove(rand_value)
    return rand_value

def determine_colors(grid):
    valid_cells = set([(i, j) for i in range(len(grid)) for j in range(len(grid))])
    uncolored_cells = set([(i, j) for i in range(len(grid)) for j in range(len(grid))])
    color_count = 1
    for i in range(len(grid)):
        for j in range(len(grid)):
            if grid[i][j].is_queen:
                grid[i][j].color = color_count
                color_count += 1
                uncolored_cells.remove((i, j))
    
    while len(uncolored_cells):
        uncolored_cell = pop_random_from_set(uncolored_cells)
        # get the cells that are cartesian direction
        option_cells = [
            (uncolored_cell[0] - 1, uncolored_cell[1]),
            (uncolored_cell[0] + 1, uncolored_cell[1]),
            (uncolored_cell[0], uncolored_cell[1] - 1),
            (uncolored_cell[0], uncolored_cell[1] + 1),
        ]
        adj_cell_i = option_cells[random.randint(0, 3)]
        if adj_cell_i in valid_cells:
            random_adjacent_cell = grid[adj_cell_i[0]][adj_cell_i[1]]
            if random_adjacent_cell["color"]:
                grid[uncolored_cell[0]][uncolored_cell[1]]["color"] = random_adjacent_cell["color"]
                continue
        uncolored_cells.add(uncolored_cell)

def print_answers(grid):
    for row in range(len(grid)):
        row_print = []
        for col in range(len(grid)):
            if grid[row][col]["is_queen"]:
                row_print.append('X')
            else:
                row_print.append('-')
        print(row_print)

def encode_colors(input_str):
    colors = [int(c) for c in input_str.split(",")]
    print(colors)
    num_rows = math.sqrt(len(colors))
    if not num_rows.is_integer():
        print("number of cells is not a square")
        return None
    num_rows = int(num_rows)

    grid = []
    for i in range(num_rows):
        curr = []
        for j in range(num_rows):
            curr.append({"color": int(colors[i*num_rows + j]), "is_queen": False})
        grid.append(curr)
    return grid

def print_color_grid_html(grid):
    print(f'<div class="grid" style="--rows: {len(grid)}; --cols: {len(grid)};">', end="")
    for row in range(len(grid)):
        for col in range(len(grid)):
            color = grid[row][col]['color']
            print(f'<div class="cell color-{color}" onclick="handleCellClick(this)"></div>', end="")
    print(f'</div>', end="")
    print()

def produce_grid(input_str = ""):
    if input_str:
        grid = encode_colors(input_str)
    else:
        grid = test()
        determine_colors(grid)
    if grid:
        print_color_grid_html(grid)
        print_answers(grid)

BOARDS = {
    "9/17": "1,1,1,1,1,1,2,1,1,1,1,1,2,2,1,3,3,3,3,3,2,1,3,4,4,4,3,5,1,3,3,3,3,3,5,1,1,1,6,7,5,5,1,1,6,6,7,7,7",
    "9/18": "0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,2,0,1,1,1,1,1,3,0,3,2,2,0,4,1,1,1,3,3,3,3,3,2,0,1,1,1,1,1,3,3,3,2,2,0,5,1,5,1,3,3,3,3,3,2,0,5,5,5,5,6,3,6,3,2,2,0,5,5,5,6,6,6,6,6,7,8,0,5,5,5,5,6,6,6,7,7,8,0,5,9,5,6,6,6,6,6,7,8,8,9,9,9,9,6,10,6,7,7,7,7",
    "9/19": "0,0,0,0,0,0,0,0,0,0,1,1,2,2,2,2,3,0,0,2,2,2,2,2,2,3,0,0,4,5,6,6,6,6,3,0,0,4,5,8,6,8,6,8,0,0,4,5,8,8,8,8,8,0,0,4,5,8,8,8,8,8,0,5,4,5,8,7,7,7,7,8,5,5,5,8,8,8,8,8,8",
    "9/20": "0,0,0,0,0,1,2,2,2,0,0,0,3,1,1,1,2,2,0,0,3,3,3,1,5,2,2,0,0,0,3,8,5,5,5,2,0,0,6,8,8,8,5,7,2,0,6,6,6,8,4,7,7,7,0,0,6,0,4,4,4,7,0,0,0,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0",
    "9/21": "2,2,2,2,2,2,2,2,2,2,2,2,5,5,5,2,0,2,2,2,2,3,5,9,9,9,0,0,0,0,2,3,5,5,5,9,0,0,0,0,2,3,5,9,9,9,1,1,1,0,2,3,5,5,5,9,1,6,6,6,3,3,3,9,9,9,1,1,1,6,3,7,3,7,8,7,1,6,6,6,3,7,3,7,8,7,1,1,1,6,3,7,7,7,7,7,4,6,6,6",
    "9/22": "0,0,0,0,0,0,1,1,1,0,2,2,2,2,2,2,2,1,2,2,3,2,3,2,3,2,2,2,3,3,3,3,3,3,3,4,2,2,7,3,6,6,5,4,4,2,7,7,6,6,5,5,5,4,2,2,7,8,6,8,5,8,4,8,2,2,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8",
    "9/23": "0,0,0,0,0,0,0,1,2,0,0,0,0,0,1,1,2,2,3,0,0,0,4,1,2,5,3,3,0,4,4,4,5,5,3,0,0,0,0,0,0,5,0,0,6,0,0,7,0,0,0,6,6,6,7,7,0,0,0,0,0,0,0,7",
    "9/24": "0,0,0,0,0,0,0,0,0,0,1,1,2,2,3,3,3,3,0,1,1,2,2,8,8,3,3,0,3,3,3,3,8,8,3,3,0,3,5,5,3,6,6,3,3,0,3,5,5,3,6,6,3,3,0,3,3,3,7,7,4,4,3,0,3,3,3,7,7,4,4,3,0,3,3,3,3,3,3,3,3"
}

def main():
    line_args = sys.argv
    print(line_args)
    if (len(line_args) < 2):
        print("No args.")
        return
    command = line_args[1]
    if command == "print":
        if len(line_args) < 3:
            print("print requires date arg")
            return
        date = line_args[2]
        produce_grid(BOARDS[date])

if __name__ == '__main__':
    main()