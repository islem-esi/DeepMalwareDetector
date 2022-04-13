from tensorflow.keras.models import load_model
import numpy as np
import gc
import os.path


def load_static(paths):
    gc.collect()
    loaded = []
    for path in paths:
        loaded.append(load_model(path))
    return loaded


def evaluate_g_encoder(row, columns, col_parts, models):
    encoded = []
    for i in range(8):
        sub_row = []
        enc = models[i+4]
        for cp in col_parts[i]:
            sub_row.append(row[columns.index(cp)])
        arr = np.zeros((1, len(sub_row)))
        arr[0] = np.array(sub_row)
        row_enc = enc.predict(arr)
        encoded.append(row_enc[0])
    arr_c = np.concatenate(encoded)
    arr_enc = np.zeros((1, arr_c.shape[0]))
    arr_enc[0] = arr_c
    gc.collect()
    return arr_enc


def evaluate_df_encoder(imports, models):
    enc = models[-1]
    arr = np.zeros((1, len(imports)))
    arr[0] = np.array(imports)
    row_enc = enc.predict(arr)
    return row_enc


def joined_prediction(predictions):
    count = 0
    for p in predictions:
        if p > 0.5:
            count += 1
    if count > 1:
        return np.mean([p for p in predictions if p > 0.5])
    elif np.mean(predictions) > 0.5:
        return np.mean([p for p in predictions if p > 0.5])
    else:
        return np.mean([p for p in predictions if p < 0.5])


def rectification(g_row, imports, sequence, imgs, grams_pre, imp_pre, seq_pre, cnn_pre):
    return 0

