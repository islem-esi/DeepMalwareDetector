function update_columns(columns) {
    $("#columns").html("")
    columns.forEach(add_col);
    function add_col(value) {
        $("#columns").append(`<th>${value.substring(0,5)}</th>`);
    }
}

function update_columns_c(columns) {
    $("#columns_c").html("")
    columns.forEach(add_col);
    function add_col(value) {
        $("#columns_c").append(`<th>${value.substring(0,5)}</th>`);
    }
}

function delete_rows() {
    $('#raw_body').html("");
}


function delete_rows_c() {
    $('#enc_body').html("");
}


function add_row(row) {
    let tr = $("<tr class='justify-content-center'></tr>");
    row.forEach(add_th);
    $('#raw_body').append(tr);

    function add_th(value) {
        tr.append($("<th style='text-align: center;'></th>").text(value))
    }
}

function add_row_enc(row) {
    let tr = $("<tr class='justify-content-center'></tr>");
    row.forEach(add_th);
    $('#enc_body').append(tr);

    function add_th(value) {
        tr.append($("<th style='text-align: center;'></th>").text(value))
    }
}


function load_raw_data(number=0, size=7, columns=0, file="headers.csv") {
    $.ajax(
        {
            type: 'POST',
            cache: false,
            data : {
                chunk_number : number,
                chunk_size : size,
                columns : columns,
                file : file
            },
            url: '/dataset/fill_raw_tables',
            dataType : "json",
            success : function (data) {
                console.log(data);
                update_columns(data.columns);
                delete_rows();
                 for(let i = number*size; i < (number+1)*size; i++){
                    add_row(data[i])
                }

            },
            error : function (jqXHR) {
                alert("error: " + jqXHR.status);
            }
        }
    )
}


function load_enc_data(number=0, size=7, columns=0, file="headers.csv") {
    $.ajax(
        {
            type: 'POST',
            cache: false,
            data : {
                chunk_number : number,
                chunk_size : size,
                columns : columns,
                file : file
            },
            url: '/dataset/fill_enc_tables',
            dataType : "json",
            success : function (data) {
                console.log(data);
                update_columns_c(data.columns);
                delete_rows_c();
                 for(let i = number*size; i < (number+1)*size; i++){
                    add_row_enc(data[i])
                }

            },
            error : function (jqXHR) {
                alert("error: " + jqXHR.status);
            }
        }
    )
}
