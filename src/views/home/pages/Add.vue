<template>
  <div class="add">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert title="添加商品信息" class="margin_bottom" type="info" show-icon :closable="false"> </el-alert>
      <!-- 步骤条 -->
      <el-steps :space="200" :active="tabsData.active - 0" finish-status="success" align-center>
        <el-step v-for="item in tabsData.title" :key="item.id" :title="item.title"></el-step>
      </el-steps>
      <!-- form -->
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position="top" label-width="100px">
        <!-- 标签页 -->
        <el-tabs tab-position="left" v-model="tabsData.active" :before-leave="tabsLeave" @tab-click="tabsClcik">
          <el-tab-pane name="0" label="基本信息">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="ruleForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model.number="ruleForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model.number="ruleForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model.number="ruleForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类">
              <el-cascader
                v-model="cascader.cascaderValue"
                :options="cascader.cascaderOptions"
                :props="cascader.cascaderProps"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane name="1" label="商品参数">
            <el-form-item v-for="item in goodsList.many" :key="item.attr_id" :label="item.attr_name">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox v-for="(item1, index) in goodsParameter" :key="index" :label="item1"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane name="2" label="商品属性">
            <el-form-item v-for="item in goodsList.only" :key="item.attr_id" :label="item.attr_name">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane class="table_plan" name="3" label="商品图片">
            <el-upload
              action="http://127.0.0.1:8888/api/private/v1/upload"
              :headers="uploadHeaders"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              list-type="picture"
            >
              <div class="button_right">
                <el-button size="small" type="primary">点击上传</el-button>
              </div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane name="4" label="商品内容">
            <quill-editor
              ref="myQuillEditor"
              v-model="ruleForm.goods_introduce"
              @blur="onEditorBlur($event)"
              @focus="onEditorFocus($event)"
              @ready="onEditorReady($event)"
              class="quill_editor"
            />
            <div class="button_right">
              <el-button type="primary" @click="addFormData">提交数据</el-button>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览对话框 -->
    <el-dialog title="图片预览" :visible.sync="imgDialogVisible" width="50%">
      <img :src="imgUrl" class="dialog_img" alt="" />
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tabsData: {
        title: [
          { id: 0, title: '基本信息' },
          { id: 1, title: '商品参数' },
          { id: 2, title: '商品属性' },
          { id: 3, title: '商品图片' },
          { id: 4, title: '商品内容' },
          { id: 5, title: '完成' }
        ],
        active: '0'
      },
      ruleForm: {
        goods_name: '',
        goods_cat: '',
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        goods_introduce: '',
        pics: [],
        attrs: []
      },
      rules: {
        goods_name: [
          { required: true, message: '请输入商品信息', trigger: 'blur' },
          {
            min: 2,
            max: 20,
            message: '长度在 2 到 20 个字符',
            trigger: 'blur'
          }
        ],
        goods_price: [
          { required: true, message: '价格不能为空' },
          { type: 'number', message: '价格必须为数字值' }
        ],
        goods_weight: [
          { required: true, message: '重量不能为空' },
          { type: 'number', message: '重量必须为数字值' }
        ],
        goods_number: [
          { required: true, message: '数量不能为空' },
          { type: 'number', message: '数量必须为数字值' }
        ]
      },
      // 级联选择器数据
      cascader: {
        cascaderValue: [],
        cascaderOptions: [],
        cascaderOpen: false,
        currentId: '',
        currentValue: [],
        cascaderProps: {
          expandTrigger: 'hover',
          value: 'cat_id',
          label: 'cat_name',
          children: 'children'
        }
      },
      goodsList: {
        many: [],
        only: []
      },
      goodsParameter: [],
      uploadHeaders: {
        Authorization: sessionStorage.getItem('token')
      },
      imgDialogVisible: false,
      imgUrl: ''
    }
  },
  methods: {
    tabsLeave(activeName, oldActiveName) {
      if (oldActiveName === 0 && this.cascader.cascaderOpen === false) return false
    },
    async tabsClcik() {
      // active=1时请求商品参数
      if (this.tabsData.active === '1') {
        const { data } = await this.$http.get(`categories/${this.cascader.currentId}/attributes`, {
          params: { sel: 'many' }
        })
        data.data.forEach(item => {
          item.attr_vals = item.attr_vals.split(' ')
        })
        this.goodsList.many = data.data
        data.data.forEach(item => {
          this.goodsParameter = item.attr_vals
        })
      }
      // active=2时请求商品属性
      if (this.tabsData.active === '2') {
        const { data } = await this.$http.get(`categories/${this.cascader.currentId}/attributes`, {
          params: { sel: 'only' }
        })
        this.goodsList.only = data.data
      }
    },
    handleChange(value) {
      if (value.length !== 3) {
        this.cascader.cascaderValue = []
      } else {
        this.cascader.cascaderOpen = true
        this.cascader.currentValue = value
        this.cascader.currentId = value[value.length - 1]
      }
    },
    async showAddDialog() {
      const { data } = await this.$http.get('categories', {
        params: { type: 3 }
      })
      this.cascader.cascaderOptions = data.data
    },
    handleRemove(file) {
      const index = this.ruleForm.pics.findIndex(item => {
        return item.pic === file.response.data.tmp_path
      })
      this.ruleForm.pics.splice(index, 1)
    },
    handlePreview(file) {
      this.imgUrl = file.response.data.url
      this.imgDialogVisible = true
    },
    handleSuccess(response) {
      const pic = { pic: response.data.tmp_path }
      this.ruleForm.pics.push(pic)
    },
    addFormData() {
      this.$refs.ruleForm.validate(async val => {
        this.ruleForm.goods_cat = this.cascader.currentValue.join(',')
        if (!val) return this.$message.error('表单数据验证失败')
        const { data } = await this.$http.post('goods', this.ruleForm)
        if (data.meta.status !== 201) return this.$message.error(data.meta.msg)
        this.$message.success(data.meta.msg)
        this.$refs.ruleForm.resetFields()
        this.$router.push('/goods')
      })
    },
    // 富文本事件
    onEditorBlur(quill) {
      console.log('editor blur!', quill)
    },
    onEditorFocus(quill) {
      console.log('editor focus!', quill)
    },
    onEditorReady(quill) {
      console.log('editor ready!', quill)
    },
    onEditorChange({ quill, html, text }) {
      console.log('editor change!', quill, html, text)
      this.content = html
    }
  },
  created() {
    this.showAddDialog()
  }
}
</script>

<style lang='less' scoped>
.dialog_img {
  width: 100%;
}
.table_plan ::v-deep .el-upload {
  width: 100%;
}
.button_right {
  display: flex;
  flex-direction: row-reverse;
  width: 100%;
  .el-button {
    margin-top: 20px;
    margin-right: 20px;
  }
}
.quill_editor ::v-deep {
  .ql-editor {
    height: 300px !important;
  }
  .ql-toolbar.ql-snow {
    text-align: left;
  }
}
</style>
