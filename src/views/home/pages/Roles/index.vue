<template>
  <div class="roles">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <el-button v-permission @click="$refs.addRolesDialog.showDialog()" type="primary">添加角色</el-button>
      <el-table :data="rolesList">
        <!-- 用户权限展开项 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              v-for="(item1, index1) in scope.row.children"
              :key="item1.id"
              :class="['bottom_solid', index1 === 0 ? 'top_solid' : '', 'felx_centen']"
            >
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row, item1.id)">{{ item1.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级权限 -->
              <el-col :span="19">
                <el-row
                  v-for="(item2, index2) in item1.children"
                  :key="item2.id"
                  :class="[, index2 !== 0 ? 'top_solid' : '', 'felx_centen']"
                >
                  <el-col :span="5">
                    <el-tag type="success" closable @close="removeRightById(scope.row, item2.id)">{{
                      item2.authName
                    }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限 -->
                  <el-col :span="19">
                    <span v-for="item3 in item2.children" :key="item3.id">
                      <el-tag type="warning" closable @close="removeRightById(scope.row, item3.id)">{{
                        item3.authName
                      }}</el-tag>
                    </span>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="角色名称" width="290">
          <template label="操作" slot-scope="scope">
            <el-button @click="$refs.putRolesDialog.show(scope.row)" size="mini" type="primary" icon="el-icon-edit"
              >编辑</el-button
            >
            <el-button @click="deleteRoles(scope.row.id)" size="mini" type="danger" icon="el-icon-delete"
              >删除</el-button
            >
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="$refs.rightsDialog.showRightDialig(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限对话框 -->
    <add-rights ref="rightsDialog" @falseDialogVisible="getRolesList"></add-rights>
    <!-- 添加角色对话框 -->
    <add-roles ref="addRolesDialog" @successAdd="getRolesList"></add-roles>
    <!-- 修改角色对话框 -->
    <put-roles ref="putRolesDialog" @successAdd="getRolesList"></put-roles>
  </div>
</template>

<script>
import AddRoles from './pages/AddRoles.vue'
import AddRights from './pages/AddRights.vue'
import PutRoles from './pages/PutRoles.vue'
export default {
  components: {
    AddRoles,
    AddRights,
    PutRoles
  },
  data() {
    return {
      addRolesList: {},
      rolesList: null
    }
  },
  methods: {
    async getRolesList() {
      const { data } = await this.$http.get('roles')
      if (data.meta.status !== 200) return this.$message.error(data.meta.msg)
      this.rolesList = data.data
    },
    // 删除用户权限
    async removeRightById(scope, rights) {
      const confirmRes = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmRes !== 'confirm') return this.$message.warning('取消删除用户权限')
      const { data } = await this.$http.delete(`roles/${scope.id}/rights/${rights}`)
      if (data.meta.status !== 200) return this.$message.error('删除数据失败')
      this.$message.success('数据删除成功')
      scope.children = data.data
    },
    // 删除角色
    deleteRoles(id) {
      this.$confirm('确定删除此角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data } = await this.$http.delete(`roles/${id}`)
          console.log(data)
          if (data.meta.status !== 200) return this.$message.error(data.meta.msg)
          this.getRolesList()
        })
        .catch(() => {})
    }
  },
  created() {
    this.getRolesList()
  }
}
</script>

<style scoped>
.bottom_solid {
  border-bottom: 1px solid #c0c4cc;
}
.top_solid {
  border-top: 1px solid #c0c4cc;
}
.el-tag {
  margin: 5px;
}
.felx_centen {
  display: flex;
  align-items: center;
}
</style>
