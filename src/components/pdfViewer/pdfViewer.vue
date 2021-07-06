<template>
  <div :style="styleObject" />
</template>

<script>
import PDFObject from 'pdfobject'
export default {
  props: {
    height: {
      type: String,
      default: '400px'
    },
    url: {
      type: String,
      default: ''
    },
    uri: {
      type: String,
      default: ''
    }
  },
  // props: ['height', 'url', 'uri'],
  data: function() {
    var vm = this
    var h = '400px'
    if (!vm.height) {
      // console.warn('Please specify viewer height, e.g. height="500px"')
    } else {
      h = vm.height
    }
    return {
      styleObject: {
        height: h
      },
      options: {
        fallbackLink: `<p> Unable To View PDFs.</p> <br> <p>Download attachment: <a href='${this.uri}'><button type='primary' icon='el-icon-download' size='small' > Download </button> </a></p>`,
        forceIframe: true
      }
    }
  },
  watch: {
    url: function(val) {
      var vm = this
      if (typeof this.url !== 'undefined') {
        PDFObject.embed(val, vm.$el, this.options)
      }
      // console.log(this.url)
    }
  },
  mounted: function() {
    if (typeof window.PDFObject === 'undefined') {
      console.error('VuePDFViewer Error: PDFObject not found. ' +
          'Get it here: https://pdfobject.com, please include js file.')
      return
    }
    if (typeof this.url === 'undefined') {
      // console.log(this.url)
      // console.error('VuePDFViewer Error: no file url provided')
      return
    }
    PDFObject.embed(this.url, this.$el, this.options)
  }
}
</script>

<style>
.pdfobject-container {
  width: 100%;
  margin: 1em 0;
}
.pdfobject {
  border: 1px solid #666;
}
</style>
