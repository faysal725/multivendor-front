<script setup>
import { onMounted } from "vue";
import { create, registerPlugin } from "filepond";
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
const props = defineProps({
  id: {
    type: String,
    default: 'filepod_' + Math.floor(Math.random() * 100) + 1
  },
  labelIdle: {
    default: 'Clique ou arraste seus arquivos aqui...',
    type: String
  },
  key: {
    default: 'file',
    type: String
  },
  multiple: {
    default: false,
    type: Boolean
  }

})
var uploadedFiles = [];
const emit = defineEmits(['update:modelValue'])
registerPlugin(
  FilePondPluginFileValidateType,
  FilePondPluginFileValidateSize,
  FilePondPluginImagePreview,
  FilePondPluginImageExifOrientation
)
const { backendUrl } = useRuntimeConfig().public;


onMounted(() => {
  const fileInput = document.querySelector('#' + props.id);
  const pond = create(fileInput, {
    storeAsFile: true,
    dropOnPage: true,
    allowMultiple: props.multiple,
    credits: null,
    labelIdle: props.labelIdle,
    labelFileTypeNotAllowed: 'Drop Image of Browse'
  });

  pond.setOptions({
    server: {
      process: (fieldName, file, metadata, load, error, progress, abort, transfer, options) => {
        // fieldName is the name of the input field
        // file is the actual file object to send
        
        const formData = new FormData();
        formData.append(props.key, file);
        const request = new XMLHttpRequest();
        request.open('POST', backendUrl + '/api/v1/upload/' + props.key);

        // Should call the progress method to update the progress to 100% before calling load
        // Setting computable to false switches the loading indicator to infinite mode
        request.upload.onprogress = (e) => {
          progress(e.lengthComputable, e.loaded, e.total);
        };

        // Should call the load method when done and pass the returned server file id
        // this server file id is then used later on when reverting or restoring a file
        // so your server knows which file to return without exposing that info to the client
        request.onload = function () {
          if (request.status >= 200 && request.status < 300) {
            // the load method accepts either a string (id) or an object
            var value;
            uploadedFiles.push(request.responseText)
            if(uploadedFiles.length > 1){
              value = uploadedFiles;
            }else{
              value = uploadedFiles[0];
            }
            emit(
              'update:modelValue',
              value
            )
            load(request.responseText);
          } else {
            // Can call the error method if something is wrong, should exit after
            error('oh no');
          }
        };

        request.send(formData);

        

        // Should expose an abort method so the request can be cancelled
        return {
          abort: () => {
            // This function is entered if the user has tapped the cancel button
            request.abort();

            // Let FilePond know the request has been cancelled
            abort();
          },
        };
      },
    },
  });
})
</script>

<template>
  <input :id="id" type="file">
</template>

<style scoped></style>