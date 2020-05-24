function get_scan_results(results) {
     $.ajax(
        {
            type: 'POST',
            cache: false,
            data : {
                request : 'scan'
            },
            url: '/scan/results',
            dataType : "json",
            success : function (data) {
                Circles.create({
                    id:'circles-1',
                    radius:45,
                    value:Math.round(data.pre_prediction*100)/100 *100,
                    maxValue:100,
                    width:7,
                    text: Math.round(data.pre_prediction*100)/100 *100 + '%',
                    colors: get_color(parseFloat(data.pre_prediction)),
                    duration:500,
                    wrpClass:'circles-wrp',
                    textClass:'circles-text',
                    styleWrapper:true,
                    styleText:true
                });
                Circles.create({
                    id:'circles-2',
                    radius:45,
                    value:Math.round(data.rectification*100)/100 *100,
                    maxValue:100,
                    width:7,
                    text: Math.round(data.rectification*100)/100 *100+ '%',
                    colors:['#f1f1f1', '#2c91b9'],
                    duration:500,
                    wrpClass:'circles-wrp',
                    textClass:'circles-text',
                    styleWrapper:true,
                    styleText:true
                });
                Circles.create({
                    id:'circles-3',
                    radius:45,
                    value:Math.round(data.rectified*100)/100 *100,
                    maxValue:100,
                    width:7,
                    text: Math.round(data.rectified*100)/100 *100+'%',
                    colors: get_color(parseFloat(data.rectified)),
                    duration:500,
                    wrpClass:'circles-wrp',
                    textClass:'circles-text',
                    styleWrapper:true,
                    styleText:true
                });

                let score = parseFloat(data.rectified);
                if (score < 0.5){
                    $("#infection").html("Clear");
                }else{
                    $("#infection").html("Infected");
                }

                $("#sha256").html("<h6 class=\"fw-bold text-uppercase text-default op-8\" >"+data.hash+"</h6>");
                $("#time").text(data.time + 's');
                $("#file_size").text(data.file_size + 'KB');

                for(let i = 0; i<data.grams.length;i++){
                    results[i] = data.grams[i];
                }
                var str_replaced = data.imports.replace(/'/g, '"');
                var obj = JSON.parse(str_replaced);
                var str = JSON.stringify(obj, undefined, 4);
                output(syntaxHighlight(str));
            },
            error : function (jqXHR) {
                alert("error: " + jqXHR.status);
                $("#scp").append("<script>" +
                    "                var x = [];\n" +
                    "                for (var i = 0; i < 500; i ++) {\n" +
                    "                    x[i] = Math.random();\n" +
                    "                }\n" +
                    "\n" +
                    "                var trace = {\n" +
                    "                    x: x,\n" +
                    "                    type: 'histogram',\n" +
                    "                  };\n" +
                    "                var datax = [trace];\n" +
                    "                Plotly.newPlot('MyDiv', datax);" +
                    "</script>");
            }
        }
    );
}


function get_color(score) {
    if(score>0.5){
        return ['#f1f1f1', '#F25961'];
    }else if(score<0.5){
        return ['#f1f1f1', '#2BB930'];
    }
}

function output(inp) {
    $("#dlls_div").append($("<pre></pre>").html(inp))
}


function syntaxHighlight(json) {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}


function show_feature(e) {
    e.preventDefault();
    let id = $(`#${e.target.id}`).html();
    if(id == '4-grams'){
        $('#grams_f').attr('style', 'display: inline');
        $('#dlls_div').attr('style', 'display: none');
    }else if(id == 'dlls'){
        //var obj = {a:1, 'b':'foo', c:[false,'false',null, 'null', {d:{e:1.3e5,f:'1.3e5'}}]};
        //var str = JSON.stringify(obj, undefined, 4);
        //output(syntaxHighlight(str));
        $('#grams_f').attr('style', 'display: none');
        $('#dlls_div').attr('style', 'display: block');
    }else if(id == 'iamges'){

    }else if(id == 'sequene'){

    }
}