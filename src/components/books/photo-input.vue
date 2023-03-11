<template>
  <div class="d-flex flex-row align-items-center" style="height: 100%;">
    <div class="card d-flex" style="width: 100%">
      <div class="card-body">
        <input type="file" accept="image/jpeg, image/gif, image/png" id="upload-file"  @change="onFileChange"/>
        <button @click.prevent="upload" class="btn btn-primary btn-block mt-4">Загрузить</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "upload-image",
  props: [
    'result',
    'sizes'
  ],
  data: function() {
    return {
      files: []
    }
  },
  methods: {
    onFileChange: function(e) {
      let files = e.target.files || e.dataTransfer.files;
      if (!files.length)
        return;
      this.createImage(files[0]);
    },
    createImage: function(file) {
      let reader = new FileReader();
      let vm = this;
      reader.onload = function(e) {
        vm.image = e.target.result;
      };
      reader.readAsDataURL(file);

    },
    upload: function(){
      let data = new FormData();
      let that = this;

      data.append('file', this.image);
      data.append('sizes', this.sizes);
      data.append('root', 'uploads/test');

      axios.post('/api/photo/upload-base64', data)
          .then(function(res) {
            let result_input = document.querySelector('input[name=' + that.result + ']');
            let data = res['data'];
            result_input.value = data['path'];
          });

    }
  }
}
</script>

<style lang="scss" scoped>

</style>