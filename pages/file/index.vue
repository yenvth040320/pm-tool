<template>
  <div id="app">
    <div class="control-section folder-upload">
      <div class="sample-container">
        <ejs-filemanager
          id="filemanager"
          :ajax-settings="ajaxSettings"
          :created="onCreated"
          :upload-settings="uploadSettings"
          :before-send="beforeSend"
          :before-download="beforeDownload"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { DetailsView, NavigationPane, Toolbar } from '@syncfusion/ej2-vue-filemanager'
import { DropDownButton } from '@syncfusion/ej2-splitbuttons'
import { API_BASE_URL } from '~/constants'
export default {
  provide: {
    filemanager: [DetailsView, NavigationPane, Toolbar]
  },
  data() {
    return {
      view: 'Details',
      allowMultiSelection: true,
      allowDragAndDrop: true,
      navigationPaneSettings: { maxWidth: '850px', minWidth: '140px', visible: true },
      showFileExtension: false,
      showThumbnail: false,
      showHiddenItems: true,
      API_BASE_URL,
      uploadSettings: { autoUpload: false, directoryupload: true },
      ajaxSettings: {
        url: API_BASE_URL + `/flowFile/list-file/${this.$store.state.project.id}`,
        getImageUrl: API_BASE_URL + `/flowFile/get-img?projectId=${this.$store.state.project.id}`,
        uploadUrl: API_BASE_URL + `/flowFile/upload/${this.$store.state.project.id}`,
        downloadUrl: API_BASE_URL + `/flowFile/download/${this.$store.state.project.id}`
      },
      projectId: this.$store.state.project.id
    }
  },

  methods: {
    onCreated(args) {
      const customBtn = document.getElementById('filemanager_tb_upload')
      customBtn.onclick = e => {
        e.stopPropagation()
      }
      // DropDownButton items definition
      const items = [{ text: 'Folder' }, { text: 'Files' }]
      const drpDownBtn = new DropDownButton({
        items,
        select: args => {
          const fileObj = document.getElementById('filemanager').ej2_instances[0]
          if (args.item.text === 'Folder') {
            fileObj.uploadSettings.directoryUpload = true
          } else {
            fileObj.uploadSettings.directoryUpload = false
          }
          setTimeout(function() {
            const uploadBtn = document.querySelector('.e-file-select-wrap button')
            uploadBtn.click()
          }, 100)
        }
      }, '#filemanager_tb_upload'
      )
      console.log(drpDownBtn)
    },

    beforeSend(args) {
      const projectId = this.projectId.toString()
      args.ajaxSettings.beforeSend = function(xhr) {
        xhr.httpRequest.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('authToken') || ''}`)
        xhr.httpRequest.setRequestHeader('Project', projectId)
      }
    },

    beforeDownload(args) {
      const projectId = this.projectId.toString()
      document.cookie = `project=${projectId};`
      args.ajaxSettings.beforeSend = function(xhr) {
        xhr.httpRequest.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('authToken') || ''}`)
        xhr.httpRequest.setRequestHeader('Project', projectId)
      }
    }
  }
}

</script>

<style>
@import "@syncfusion/ej2-base/styles/material.css";
@import "@syncfusion/ej2-icons/styles/material.css";
@import "@syncfusion/ej2-inputs/styles/material.css";
@import "@syncfusion/ej2-popups/styles/material.css";
@import "@syncfusion/ej2-buttons/styles/material.css";
@import "@syncfusion/ej2-splitbuttons/styles/material.css";
@import "@syncfusion/ej2-navigations/styles/material.css";
@import "@syncfusion/ej2-layouts/styles/material.css";
@import "@syncfusion/ej2-grids/styles/material.css";
@import "@syncfusion/ej2-vue-filemanager/styles/material.css";
</style>
