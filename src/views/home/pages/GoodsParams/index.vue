<template>
  <div class="params">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert title="注意：只允许为第三极分类设置相关参数" type="warning" show-icon> </el-alert>
      <div class="header">
        <span>选择商品分类：</span>
        <el-cascader
          v-model="cateValue"
          :options="cateOptions"
          :props="cateProps"
          @change="cascaderHandleChange"
        ></el-cascader>
      </div>
      <!-- 标签页 -->
      <el-tabs v-model="tabsActiveName" @tab-click="tabsHandleClick">
        <el-tab-pane label="动态参数" name="many"
          ><el-button type="primary" :disabled="buttonIsShow" @click="isAddDialogVisible">添加参数</el-button>
          <el-table :data="ParamsManyData" style="width: 100%">
            <el-table-column type="index"> </el-table-column>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  type="success"
                  @close="handleClose(scope, item)"
                >
                  {{ item }}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope)"
                  @blur="handleInputConfirm(scope)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope)">+ 添加元素</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="attr_name" label="参数名称"> </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" @click="isChangeDialogVisible(scope.row)">修改</el-button>
                <el-button type="danger" icon="el-icon-delete" @click="removeParams(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only"
          ><el-button type="primary" :disabled="buttonIsShow" @click="isAddDialogVisible">添加参数</el-button>
          <el-table :data="ParamsOnlyData" style="width: 100%">
            <el-table-column type="index"> </el-table-column>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  type="success"
                  @close="handleClose(scope)"
                >
                  {{ item }}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope)"
                  @blur="handleInputConfirm(scope)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope)">+ 添加元素</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="attr_name" label="参数名称"> </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" @click="isChangeDialogVisible(scope.row)">修改</el-button>
                <el-button type="danger" icon="el-icon-delete" @click="removeParams(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数对话框 -->
    <el-dialog
      :title="'提示：' + dialogTital"
      :visible.sync="addDialogVisible"
      @close="$refs.addrRuleFormRef.resetFields()"
      width="50%"
    >
      <el-form :model="addrRuleForm" :rules="addRules" ref="addrRuleFormRef" label-width="100px">
        <el-form-item label="参数名称" prop="attr_name">
          <el-input v-model="addrRuleForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="getAddParams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑参数对话框 -->
    <el-dialog
      :title="'提示：' + changeDialogTital"
      :visible.sync="changeDialogVisible"
      @close="$refs.changerRuleFormRef.resetFields()"
      width="50%"
    >
      <el-form :model="changerRuleForm" :rules="changeRules" ref="changerRuleFormRef" label-width="100px">
        <el-form-item label="参数名称" prop="attr_name">
          <el-input v-model="changerRuleForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="changeDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="getChangeParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cateProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      cateOptions: [],
      cateValue: [],
      tabsActiveName: 'many',
      buttonIsShow: true,
      ParamsManyData: [],
      ParamsOnlyData: [],
      getId: '',
      getTabsActiveName: true,
      // addDialog
      addDialogVisible: false,
      addrRuleForm: {
        attr_name: ''
      },
      addRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ]
      },
      // changeDialog
      changeDialogVisible: false,
      currentlist: {},
      changerRuleForm: {
        attr_name: ''
      },
      changeRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ]
      },
      inputValue: ''
    }
  },
  methods: {
    // 初始化获取页面信息
    async getCateData() {
      const { data } = await this.$http.get('categories')
      if (data.meta.status !== 200) return this.$message.error(data.meta.msg)
      data.data.forEach((item, index) => {
        const o = [].concat.apply([], item.children)
        if (!item.children) {
          data.data.splice(index, 1)
        }
        o.forEach((item2, index2) => {
          if (!item2.children) {
            data.data[index].children.splice(index2, 1)
          }
        })
      })
      this.cateOptions = data.data
    },
    // cascader事件
    cascaderHandleChange(val) {
      if (val.length !== 3) {
        this.cateValue = []
        this.buttonIsShow = true
        this.ParamsManyData = []
        this.ParamsOnlyData = []
        return
      }
      this.buttonIsShow = false
      this.getId = val[2]
    },
    // tab事件
    tabsHandleClick(tab, event) {},
    // 获取商品分类数据
    async getCategoriesData() {
      const { data } = await this.$http.get(`categories/${this.getId}/attributes`, {
        params: {
          sel: this.tabsActiveName
        }
      })
      if (data.meta.status !== 200) return this.$message.error('数据获取失败')
      data.data.forEach(item => {
        if (!item.attr_vals.length) {
          item.attr_vals = []
        } else {
          item.attr_vals = item.attr_vals.split(' ')
        }
        item.inputVisible = false
      })
      if (this.tabsActiveName === 'many') {
        this.ParamsManyData = data.data
      } else {
        this.ParamsOnlyData = data.data
      }
    },
    // addDialog
    isAddDialogVisible() {
      this.addDialogVisible = true
    },
    // 添加动静态参数
    getAddParams() {
      this.$refs.addrRuleFormRef.validate(async val => {
        if (val) {
          this.addrRuleForm.attr_sel = this.tabsActiveName
          const { data } = await this.$http.post(`categories/${this.getId}/attributes`, this.addrRuleForm)
          if (data.meta.status !== 201) return this.$message.error('数据添加失败')
          this.$message.success('数据添加成功')
          this.addDialogVisible = false
          this.getCategoriesData()
        }
      })
    },
    // 根据 ID 查询参数
    async isChangeDialogVisible(val) {
      const id = val.attr_id
      this.currentlist = val
      const { data } = await this.$http.get(`categories/${this.getId}/attributes/${id}`, {
        params: { attr_sel: this.tabsActiveName }
      })
      if (data.meta.status !== 200) return this.$message.error('数据添加失败')
      this.changeDialogVisible = true
      this.changerRuleForm = data.data
    },
    //  编辑提交参数
    getChangeParams() {
      this.$refs.changerRuleFormRef.validate(val => {
        if (val) {
          const id = this.changerRuleForm.attr_id
          this.getChangeaArgument(id)
        }
      })
    },
    // 编辑提交参数
    async getChangeaArgument(id, callback) {
      const { data } = await this.$http.put(`categories/${this.getId}/attributes/${id}`, this.changerRuleForm)
      if (data.meta.status !== 200) return this.$message.error(data.meta.msg)
      this.$message.success(data.meta.msg)
      if (callback) callback()
      this.currentlist.attr_name = this.changerRuleForm.attr_name
      this.changerRuleForm = {}
      this.changeDialogVisible = false
      //  this.getCategoriesData()
    },
    // 删除参数
    async removeParams(val) {
      const res = await this.$confirm('此操作将永久删除该属性, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (res !== 'confirm') return false
      const id = val.attr_id
      const { data } = await this.$http.delete(`categories/${this.getId}/attributes/${id}`)
      if (data.meta.status !== 200) return this.$message.error(data.meta.msg)
      this.$message.success(data.meta.msg)
      this.getCategoriesData()
    },
    // tag标签关闭时删除值
    handleClose(val, tag) {
      const vals = [...val.row.attr_vals]
      vals.splice(val.row.attr_vals.indexOf(tag), 1)
      const id = val.row.attr_id
      this.changerRuleForm.attr_vals = vals.join(' ')
      this.changerRuleForm.attr_sel = val.row.attr_sel
      this.changerRuleForm.attr_name = val.row.attr_name
      this.getChangeaArgument(id, () => {
        val.row.attr_vals = vals
      })
    },
    showInput(val) {
      val.row.inputVisible = true
      // $nextTick的作用是inputVisible为true的时候input可能还没有加载出来
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    handleInputConfirm(val) {
      const inputValue = this.inputValue
      if (inputValue) {
        const vals = val.row.attr_vals.join(' ') + ' ' + inputValue
        const id = val.row.attr_id
        this.changerRuleForm.attr_vals = vals
        this.changerRuleForm.attr_sel = val.row.attr_sel
        this.changerRuleForm.attr_name = val.row.attr_name
        this.getChangeaArgument(id, () => {
          val.row.attr_vals.push(inputValue)
        })
      }
      val.row.inputVisible = false
      this.inputValue = ''
    }
  },
  computed: {
    dialogTital() {
      if (this.tabsActiveName === 'many') return '添加动态参数'
      return '添加静态参数'
    },
    changeDialogTital() {
      if (this.tabsActiveName === 'many') return '修改动态参数'
      return '修改静态参数'
    }
  },
  created() {
    this.getCateData()
  },
  watch: {
    getId() {
      this.getCategoriesData()
      this.getTabsActiveName = true
    },
    tabsActiveName() {
      if (this.getId && this.getTabsActiveName) {
        this.getCategoriesData()
        this.getTabsActiveName = false
      }
    }
  }
}
</script>

<style scoped>
.el-alert {
  margin-bottom: 15px;
}
.el-tag {
  margin: 0 10px;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
