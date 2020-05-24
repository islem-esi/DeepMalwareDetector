import pandas as pd
import json
import csv
import os.path

original_path = 'dataset\\DataSetFiles\\CSVFiles\\original'
enc_path = 'dataset\\DataSetFiles\\CSVFiles\\encoded'
headers = 'headers.csv'
grams = '4-grams.csv'
strings = 'strings.csv'
opcodes = 'opcodes.csv'
functions = 'functions.csv'
dlls = 'dlls.csv'


def read_chunk(chunk_number, chunk_size, columns, file):
    c_size = 20
    rows = {}
    chunk_number = int(chunk_number)
    chunk_size = int(chunk_size)
    columns = int(columns)
    with open(os.path.join(original_path, file), 'r') as fls:
        csv_reader = csv.reader(fls)
        names = next(csv_reader)
        c_size = min(len(names), 1000)
        for i in range(chunk_size*chunk_number):
            temp = next(csv_reader)
        for i in range(chunk_number*chunk_size, (chunk_number+1)*chunk_size, 1):
            rows[i] = next(csv_reader)[columns*c_size:(columns+1)*c_size]
            rows['columns'] = names[columns*c_size:(columns+1)*c_size]
    return rows

def read_chunk_c(chunk_number, chunk_size, columns, file):
    rows = {}
    chunk_number = int(chunk_number)
    chunk_size = int(chunk_size)
    columns = int(columns)
    with open(os.path.join(enc_path, file), 'r') as fls:
        csv_reader = csv.reader(fls)
        names = next(csv_reader)
        c_size = min(len(names), 1000)
        for i in range(chunk_size*chunk_number):
            temp = next(csv_reader)
        for i in range(chunk_number*chunk_size, (chunk_number+1)*chunk_size, 1):
            rows[i] = next(csv_reader)[columns*c_size:(columns+1)*c_size]
            rows['columns'] = names[columns*c_size:(columns+1)*c_size]
    return rows


