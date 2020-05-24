function choose_file() {
    let file_window = $('#file_window');
    file_window.trigger('click');
    file_window.change(function (e) {
        let input_file = e.target.files[0];
        $('#file_name').text(input_file.name);
        let form_data = new FormData();
        form_data.append('file', input_file);
        let loader = $("<div class=\"text-center\" style='padding-top: 50px'>\n" +
            "\t<a href=\"#\" class=\"btn btn-white is-loading is-loading-success is-loading-lg\">\n" +
            "\t\t\n" +
            "\t</a>\n" +
            "</div>");
        let text = $("<div class='text-default' style='padding-bottom: 50px; padding-top: 10px'><h5>Analyzing</h5></div>");
        let progress = $("<div class=\"progress-card\">\n" +
            "\t<div class=\"progress-status\">\n" +
            "\t\t<span class=\"text-muted\">Tasks Complete</span>\n" +
            "\t\t<span class=\"text-muted fw-bold\">  %</span>\n" +
            "\t</div>\n" +
            "\t<div class=\"progress\" style=\"height: 6px;\">\n" +
            "\t\t<div class=\"progress-bar bg-success\" role=\"progressbar\" style=\"width:70%\" aria-valuenow=\"70\" aria-valuemin=\"0\" aria-valuemax=\"100\" data-toggle=\"tooltip\" data-placement=\"top\" title=\"${p}\" data-original-title=\"%\" id='prog'></div>\n" +
            "\t</div>\n" +
            "</div>");
        let loader_holder = $("#loader_holder");
        loader_holder.html("");
        loader_holder.append(loader);
        loader_holder.append(text);
        loader_holder.append(progress);
        $.ajax({
            type: 'POST',
            url: '/scan/download',
            data: form_data,
            contentType: false,
            cache: false,
            processData: false,
            success: function(data) {
                console.log(data);
                if (data === 'done') {
                    console.log(data);
                    window.location.replace('/');
                }else{
                    $('#file_name').text(data);
                }
            }, error : function (jqXHR) {
                alert("error: " + jqXHR.status);
            }
        });
    })
}


