# happyGo 电商后台管理系统

### 技术栈

```js
vue2
vuex
less
axios
vue - router
element - ui
vue - cropper
vue - quill - editor
```

### 安装项目依赖

```js
npm install // 安装前端依赖
cd server
npm install // 安装后端依赖
```

### 运行项目

```js
npm run server //运行前端项目
cd server
npm start // 运行后端项目
```

### 功能实现

#### 用户登陆模块

- 登录、注册 -- 完成
- 登陆图片滑动验证 -- 完成
- 个人中心 -- 完成
- 编辑/上传头像 -- 完成
- 登出 -- 完成

#### 用户管理模块

- 用户列表的展示
- 添加用户
- 修改用户基本信息
- 修改用户状态
- 给用户分配角色
- 删除用户
- 用户名查找用户

#### 权限管理模块

##### 角色列表

- 展示角色列表
- 添加角色
- 修改角色基本信息
- 角色权限分配
- 删除角色

##### 权限列表

- 权限列表的展示

#### 商品管理模块

##### 商品列表

- 修改商品基本信息
- 删除商品基本信息

##### 添加商品

- 商品的基本信息
- 商品参数
- 商品属性
- 商品图片
- 使用 vue-quill-editor 对商品类容的编辑

##### 分类参数

- 添加动，静态参数
- 修改动，静态参数
- 删除动，静态参数
- 添加/删除动，静态参数元素

##### 商品分类

- 商品分类的表格展示
- 添加商品分类
- 编辑商品分类
- 删除商品分类

#### 订单管理模块

- 订单基本信息的展示
- 修改订单地址
- 根据订单编号查询订单 -- 未完成
- 订单物流进度的展示

#### 数据统计模块

- 借助 echarts 通过图形的形式展示数据

#### 权限管理模块

- 根据后端返回的权限值，如权限值不够不展示相关页面，或公共

#### 视口响应式模块

- 监听 resize 事件，窗口发生改变时动态渲染侧边栏状态

### 部分截图

#### 登陆页面

<img style="width:100%; margin-top:10px;" src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-e3306813-c467-4fe2-a5b0-4f80a8d3051e/e93ec038-4d56-47e4-bc29-ea23487ea08f.png" alt="">

<img style="width:100%; margin-top:10px;" src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-e3306813-c467-4fe2-a5b0-4f80a8d3051e/5a8470a8-b285-4021-8656-7082f1b8dbd3.png" alt="">

<img style="width:100%; margin-top:10px;" src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-e3306813-c467-4fe2-a5b0-4f80a8d3051e/5c437b11-8b8d-4845-b408-1ef0cbba405c.png" alt="">

<img style="width:100%; margin-top:10px;" src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-e3306813-c467-4fe2-a5b0-4f80a8d3051e/d423946e-ef77-4c13-9657-3831dbb3cec3.png" alt="">

#### 用户管理

<img style="width:100%; margin-top:10px;" src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-e3306813-c467-4fe2-a5b0-4f80a8d3051e/596979b4-e69f-4017-91be-003cf782b168.png" alt="">

#### 权限管理

##### 角色列表

<img style="width:100%; margin-top:10px;" src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-e3306813-c467-4fe2-a5b0-4f80a8d3051e/0aa7653a-7a55-406f-bc13-b6c9d061372a.png" alt="">

##### 权限列表

<img style="width:100%; margin-top:10px;" src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-e3306813-c467-4fe2-a5b0-4f80a8d3051e/2094f4c2-1aa3-4c64-937e-d0ed3dfb4e73.png" alt="">

#### 商品管理

##### 添加商品

<img style="width:100%; margin-top:10px;" src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-e3306813-c467-4fe2-a5b0-4f80a8d3051e/489e3943-5e4c-4821-8399-dccafc089618.png" alt="">

##### 商品列表

<img style="width:100%; margin-top:10px;" src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-e3306813-c467-4fe2-a5b0-4f80a8d3051e/07d78b06-641c-4ab9-9130-4d48b809bad9.png" alt="">

##### 商品参数

<img style="width:100%; margin-top:10px;" src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-e3306813-c467-4fe2-a5b0-4f80a8d3051e/798c0441-6432-4206-82a4-982689e5ec4a.png" alt="">

<img style="width:100%; margin-top:10px;" src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-e3306813-c467-4fe2-a5b0-4f80a8d3051e/5580378c-e2ef-4962-8dcf-03255c766949.png" alt="">

##### 商品分类

<img style="width:100%; margin-top:10px;" src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-e3306813-c467-4fe2-a5b0-4f80a8d3051e/02ddaef1-ac9f-4524-a094-714a2e4a27ed.png" alt="">

#### 订单管理

<img style="width:100%; margin-top:10px;" src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-e3306813-c467-4fe2-a5b0-4f80a8d3051e/b51516c4-aa20-4b2b-aaeb-e5656a55a173.png" alt="">

#### 数据统计

<img style="width:100%; margin-top:10px;" src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-e3306813-c467-4fe2-a5b0-4f80a8d3051e/b123a172-f06f-4a25-8d94-f2628c53b962.png" alt="">
