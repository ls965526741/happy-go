// 图片剪切
<template>
  <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" :width="dialogWidth" append-to-body>
    <div class="cropper">
      <div class="content">
        <div class="wrap-cropper">
          <vue-cropper
            ref="cropper"
            autoCrop
            :img="cropperOption.img"
            centerBox
            :fixed="true"
            :fixedBox="true"
            :info="true"
            :autoCropWidth="autoCropWidth"
            :autoCropHeight="autoCropHeight"
            @realTime="realTime"
          />
        </div>
        <div class="wrap-review">
          <slot>
            <div class="review">
              <img :src="previews.url" :style="previews.img" />
            </div>
          </slot>
        </div>
      </div>
      <div class="foot">
        <div class="foot-left">
          <el-button type="primary" icon="el-icon-upload2" @click="selectImg">选择图片 </el-button>
          <el-button type="primary" icon="el-icon-plus" @click="$refs.cropper.changeScale(1)"></el-button>
          <el-button type="primary" icon="el-icon-minus" @click="$refs.cropper.changeScale(-1)"></el-button>
          <el-button type="primary" icon="el-icon-refresh-left" @click="$refs.cropper.rotateLeft()"></el-button>
          <el-button type="primary" icon="el-icon-refresh-right" @click="$refs.cropper.rotateRight()"></el-button>
        </div>
        <div class="foot-right">
          <el-button type="success" @click="getCropBlob">保存</el-button>
        </div>
      </div>
      <input
        v-show="false"
        ref="inputRef"
        accept="image/png, image/jpeg, image/gif, image/jpg"
        type="file"
        @change="inputChange"
      />
    </div>
  </el-dialog>
</template>

<script>
import { VueCropper } from 'vue-cropper'

export default {
  name: 'Cropper',
  components: {
    VueCropper
  },
  props: {
    dialogTitle: {
      type: String,
      required: false,
      default: '裁剪图片'
    },
    dialogWidth: {
      type: String,
      required: false,
      default: '680px'
    },
    autoCropWidth: {
      type: Number,
      required: false,
      default: 200
    },
    autoCropHeight: {
      type: Number,
      required: false,
      default: 200
    }
  },
  data() {
    return {
      dialogVisible: false,
      cropperOption: {
        img: ''
      },
      previews: {}
    }
  },
  methods: {
    show() {
      this.dialogVisible = true
    },
    hide() {
      this.dialogVisible = false
    },
    selectImg() {
      this.$refs.inputRef.click()
    },
    inputChange(e) {
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.onload = e => {
        let data
        if (typeof e.target.result === 'object') {
          data = window.URL.createObjectURL(new Blob([e.target.result]))
        } else {
          data = e.target.result
        }
        this.cropperOption.img = data
      }
      // 转化为base64
      reader.readAsDataURL(file)
    },
    realTime(data) {
      this.previews = data
      this.$emit('realTime', data)
    },
    getCropBlob() {
      this.$refs.cropper.getCropBlob(data => {
        this.$emit('getCropBlob', data)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.cropper {
  height: 400px;
  padding: 20px;

  .content {
    display: flex;

    .wrap-cropper {
      width: 350px;
      height: 350px;
    }

    .wrap-review {
      display: flex;
      flex: 1;
      align-items: center;
      justify-content: center;

      .review {
        width: 200px;
        height: 200px;
        overflow: hidden;
        border-radius: 50%;
        box-shadow: 0 0 4px #ccc;

        & img {
          width: 100%;
          height: 100%;
          min-width: 100%;
          min-height: 100%;
        }
      }
    }
  }

  .foot {
    display: flex;
    flex: 1;
    align-items: flex-end;
    height: 50px;

    .foot-left {
      display: flex;
      justify-content: space-between;
      width: 350px;
    }

    .foot-right {
      display: flex;
      flex: 1;
      justify-content: center;
    }
  }
}
</style>
