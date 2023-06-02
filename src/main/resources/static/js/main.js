'use strict';

const singleUploadForm = document.querySelector('#singleUploadForm');
const singleFileUploadInput = document.querySelector('#singleFileUploadInput');
const singleFileUploadError = document.querySelector('#singleFileUploadError');
const singleFileUploadSuccess = document.querySelector('#singleFileUploadSuccess');

const multipleUploadForm = document.querySelector('#multipleUploadForm');
const multipleFileUploadInput = document.querySelector('#multipleFileUploadInput');
const multipleFileUploadError = document.querySelector('#multipleFileUploadError');
const multipleFileUploadSuccess = document.querySelector('#multipleFileUploadSuccess');

function uploadSingleFile(file) {
    const formData = new FormData();
    formData.append("file", file);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/uploadFile");

    xhr.onload = function () {
        console.log(xhr.responseText);
        const response = JSON.parse(xhr.responseText);
        if (xhr.status === 200) {
            singleFileUploadError.style.display = "none";
            singleFileUploadSuccess.innerHTML = "<p>File Uploaded Successfully.</p><p>DownloadUrl : <a href='" + response.fileDownloadUri + "' target='_blank'>" + response.fileDownloadUri + "</a></p>";
            singleFileUploadSuccess.style.display = "block";
        } else {
            singleFileUploadSuccess.style.display = "none";
            singleFileUploadError.innerHTML = (response && response.message) || "Some Error Occurred";
        }
    }

    xhr.send(formData);
}

function uploadMultipleFiles(files) {
    const formData = new FormData();
    for (let index = 0; index < files.length; index++) {
        formData.append("files", files[index]);
    }

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/uploadMultipleFiles");

    xhr.onload = function () {
        console.log(xhr.responseText);
        const response = JSON.parse(xhr.responseText);
        if (xhr.status === 200) {
            multipleFileUploadError.style.display = "none";
            let content = "<p>All Files Uploaded Successfully</p>";
            for (let i = 0; i < response.length; i++) {
                content += "<p>DownloadUrl : <a href='" + response[i].fileDownloadUri + "' target='_blank'>" + response[i].fileDownloadUri + "</a></p>";
            }
            multipleFileUploadSuccess.innerHTML = content;
            multipleFileUploadSuccess.style.display = "block";
        } else {
            multipleFileUploadSuccess.style.display = "none";
            multipleFileUploadError.innerHTML = (response && response.message) || "Some Error Occurred";
        }
    }

    xhr.send(formData);
}

singleUploadForm.addEventListener('submit', function (event) {
    const files = singleFileUploadInput.files;
    if (files.length === 0) {
        singleFileUploadError.innerHTML = "Please select a file";
        singleFileUploadError.style.display = "block";
    }
    uploadSingleFile(files[0]);
    event.preventDefault();
}, true);

multipleUploadForm.addEventListener('submit', function (event) {
    const files = multipleFileUploadInput.files;
    if (files.length === 0) {
        multipleFileUploadError.innerHTML = "Please select at least one file";
        multipleFileUploadError.style.display = "block";
    }
    uploadMultipleFiles(files);
    event.preventDefault();
}, true);