<template>
  <!-- 分配权限对话框 -->
  <el-dialog title="分配权限" :visible.sync="rightDialogVisible" width="50%">
    <el-tree
      :data="rightList"
      :props="rightProps"
      show-checkbox
      default-expand-all
      :default-checked-keys="treeDefaultKeys"
      node-key="id"
      ref="treeRef"
    ></el-tree>
    <span slot="footer" class="dialog-footer">
      <el-button @click="rightDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="allotRights">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      rightDialogVisible: false,
      rightList: null,
      currentId: '',
      rightProps: {
        children: 'children',
        label: 'authName'
      },
      treeDefaultKeys: []
    }
  },
  methods: {
    async allotRights() {
      const o = [...this.$refs.treeRef.getCheckedKeys(), ...this.$refs.treeRef.getHalfCheckedKeys()]
      const rids = o.join(',')
      const { data } = await this.$http.post(`roles/${this.currentId}/rights`, {
        rids: rids
      })
      if (data.meta.status !== 200) {
        return this.$message.error('添加用户权限失败')
      }
      this.$message.success('添加用户权限成功')
      this.$emit('falseDialogVisible')
      this.rightDialogVisible = false
    },
    getTreeDefaultKeys(data) {
      data.forEach(elem => {
        if (!elem.children) {
          this.treeDefaultKeys.push(elem.id)
        } else {
          this.getTreeDefaultKeys(elem.children)
        }
      })
    },
    async showRightDialig(val) {
      this.currentId = val.id
      val = [val]
      this.treeDefaultKeys = []
      this.getTreeDefaultKeys(val)
      this.rightDialogVisible = true
      const { data } = await this.$http.get('rights/' + 'tree')
      if (data.meta.status !== 200) {
        this.$message.warning('获取数据失败')
        this.rightDialogVisible = false
        return
      }
      this.rightList = data.data
    }
  }
}
</script>

<style lang="less" scoped>
</style>
