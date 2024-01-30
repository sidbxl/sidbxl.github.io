Dropzone.autoDiscover = false;
$(document).ready(function() {
    // Turn the drop zone into a Dropzone
    var myDropzone = new Dropzone('#drop_zone', {
        url: function() {}, // Dummy function to prevent upload
        acceptedFiles: 'image/*', // Only accept image files
        autoProcessQueue: false, // Don't upload the files immediately
    });
    
    // When a file is added, convert and download it
    myDropzone.on('addedfile', function(file) {
        var outputFormat = document.getElementById('output_format').value;
        convertAndDownload(file, outputFormat);
    });

    var alertBox = document.getElementById('alertbox');

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
        alertBox.classList.add('alert-success');
        alertBox.innerHTML = '<p class="text-center">Fichier(s) converti(s) et téléchargé(s) !</p>';
    }
});