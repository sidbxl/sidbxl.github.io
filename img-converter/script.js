document.getElementById('drop_zone').addEventListener('dragover', function(e) {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
});

document.getElementById('drop_zone').addEventListener('drop', function(e) {
    e.preventDefault();
    e.stopPropagation();

    var outputFormat = document.getElementById('output_format').value;
    var files = e.dataTransfer.files;

    for (var i = 0; i < files.length; i++) {
        convertAndDownload(files[i], outputFormat);
    }
});

function convertAndDownload(file, outputFormat) {
    var reader = new FileReader();
    reader.onload = function(e) {
        var img = new Image();
        img.onload = function() {
            var canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            var ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            canvas.toBlob(function(blob) {
                var link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = file.name + '.' + outputFormat;
                link.click();
            }, 'image/' + outputFormat);
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

document.getElementById('convert_button').addEventListener('click', function() {
    alert('Please drop an image file into the drop zone.');
});