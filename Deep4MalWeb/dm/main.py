from flask import Flask, render_template, request, make_response, jsonify
import json
from .load_data import read_chunk, read_chunk_c
import os.path
import numpy as np
import csv
from .extract_features import imports_json, grams_extractor, grams_rf, grams_row, normalized_row, extract_imports, extract_sequence, extract_img
from .load_model import load_static, evaluate_df_encoder, evaluate_g_encoder, joined_prediction, rectification
import gc
import os
import timeit
import hashlib


app = Flask(__name__)
analysis_page = False
analysis = {}


# loading models
core_models = './dm/models/Core'
encoders = './dm/models/encoders'


paths = ['./dm/models/Core/cnn64.h5',
         os.path.join(core_models, 'func_dll_fnn.h5'),
         os.path.join(core_models, 'grams_fnn.h5'),
         os.path.join(core_models, 'sequencer.h5'),
         os.path.join(encoders, 'dllf_encoder_part_0.h5'),
         ]


import h5py     
with open("dm/models/file_should_exist.txt", 'w') as fse:
	fse.write("abs")
	
import pathlib	
print(os.path.abspath(os.getcwd()))
print(os.path.isfile('./dm/models/Core/cnn64.h5'))

models = load_static(paths)


@app.route('/')
def index():
    global analysis_page
    if analysis_page:
        return render_template('app/index.html', name='home')
    else:
        return render_template('app/scanpage.html')


@app.route('/dataset')
def dataset():
    with open('./dm/dataset/DescriptionFiles/DataSetHeader.json', 'r') as desc:
        dataset_desc = json.load(desc)
    return render_template('app/tables/datatables.html', description=dataset_desc)


@app.route('/model')
def model():
    return render_template('app/widgets.html')


@app.route('/learning_board')
def learning_board():
    return render_template('app/charts/charts.html')


@app.route('/dataset/fill_raw_tables', methods=['GET', 'POST'])
def fill_raw_tables():
    rows = read_chunk(request.form['chunk_number'], request.form['chunk_size'],
                      request.form['columns'], request.form['file'])
    resp = make_response(json.dumps(rows))
    resp.status_code = 200
    return resp


@app.route('/dataset/fill_enc_tables', methods=['GET', 'POST'])
def fill_enc_tables():
    rows = read_chunk_c(request.form['chunk_number'], request.form['chunk_size'],
                      request.form['columns'], request.form['file'])
    resp = make_response(json.dumps(rows))
    resp.status_code = 200
    return resp


@app.route('/scan/download', methods=['GET', 'POST'])
def download():
    start = timeit.timeit()
    file_name = request.files['file']
    seed = np.random.randint(1000000)
    file_name.save(os.path.join('./dm/transferedFiles', str(seed)))
    file_size = os.stat(os.path.join('./dm/transferedFiles', str(seed))).st_size

    # extract features

    # ###4grams
    original_path = './dm/dataset/DataSetFiles/CSVFiles/original'
    #with open(os.path.join(original_path, "4-grams.csv"), 'r') as grms:
    #    csv_reader = csv.reader(grms)
    #    columns = next(csv_reader)
    #del columns[0]
    #del columns[-1]
    with open("./dm/models/encoders/grams_columns_parts.json") as gcp:
    	columns_lst = json.load(gcp)
    	
    columns = []
    for cl in columns_lst:
    	columns += cl
    freq = grams_extractor(os.path.join('./dm/transferedFiles', str(seed)), columns)
    grams_freq = grams_rf(freq)
    row = grams_row(grams_freq, columns)
    norm_row_ = normalized_row(row)
    norm_row = []
    for nr in norm_row_:
        norm_row.append(nr[0])
    # ###Imports
    with open(os.path.join(original_path, 'dlls.csv'), 'r') as dlls:
        csv_reader = csv.reader(dlls)
        col_dlls = next(csv_reader)
    del col_dlls[0]
    del col_dlls[-1]
    with open(os.path.join(original_path, 'functions.csv'), 'r') as func:
        csv_reader = csv.reader(func)
        col_func = next(csv_reader)
    del col_func[0]
    del col_func[-1]
    imports = extract_imports(os.path.join('./dm/transferedFiles', str(seed)), col_dlls, col_func)

    # ###disassemble
    sequence = extract_sequence(os.path.join('./dm/transferedFiles', str(seed)))

    # ###images
    img_list = extract_img(os.path.join('./dm/transferedFiles', str(seed)))
    global analysis
    response = make_response()
    if norm_row is None or isinstance(norm_row, str):
        response.data = 'failed to extract features: 4grams'
        return response
    if imports is None or isinstance(imports, str):
        response.data = 'failed to extract features: imports'
        return response
    if sequence is None or isinstance(sequence, str):
        response.data = 'failed to extract features: sequence'
        return response
    if img_list is None or isinstance(img_list, str):
        response.data = 'failed to extract features: images'
        return response

    with open(os.path.join('./dm/models/encoders', 'grams_columns_parts.json'), 'r') as gcp:
        columns_parts = json.load(gcp)

    global models
    #encoded_grams = evaluate_g_encoder(norm_row, columns, columns_parts, models)
    encoded_imports = evaluate_df_encoder(imports, models)
    gc.collect()
    cnn_pre = models[0].predict(img_list)
    seq_pre = models[3].predict(sequence)
    #grams_pre = models[2].predict(encoded_grams)
    grams_pre = [[0.]]
    imp_pre = models[1].predict(encoded_imports)
    pre_prediction = joined_prediction([np.mean(cnn_pre), np.mean(seq_pre), grams_pre[0][0], imp_pre[0][0]])
    rect = rectification(norm_row, imports, sequence, img_list, grams_pre, imp_pre, seq_pre, cnn_pre)
    end = timeit.timeit()
    analysis['pre_prediction'] = float(pre_prediction)
    analysis['rectification'] = rect
    analysis['rectified'] = pre_prediction + rect
    analysis['grams'] = [x for x in norm_row]
    analysis['imports'] = str(imports_json(os.path.join('./dm/transferedFiles', str(seed))))
    analysis['file_size'] = file_size / 1000
    analysis['time'] = (end - start)
    sha256_hash = hashlib.sha256()
    with open(os.path.join('./dm/transferedFiles', str(seed)), "rb") as f:
        for byte_block in iter(lambda: f.read(16384), b""):
            sha256_hash.update(byte_block)
    analysis['hash'] = sha256_hash.hexdigest()
    with open('./dm/models/analysis.json', 'w') as ana:
        json.dump(analysis, ana)
    global analysis_page
    analysis_page = True
    response.data = 'done'
    return response


@app.route('/scan/results', methods=['GET', 'POST'])
def send_results():
    global analysis
    if analysis != {}:
        return analysis
    else:
        with open('./dm/models/analysis.json', 'r') as ana:
            analysis = json.load(ana)
        return analysis
