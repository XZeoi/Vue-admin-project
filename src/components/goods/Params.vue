<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="#">商品管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 警告区域 -->
      <el-alert
        show-icon
        title="注意：只允许为第三级分类设置相关参数！"
        type="warning"
        :closable="false"
      ></el-alert>

      <!-- 选择商品分类区域 -->
      <el-row class="cat-opt">
        <el-col>
          <span>选择商品分类：</span>

          <!-- 选择商品分类的级联选择框 -->
          <el-cascader
            v-model="selectedCateKeys"
            :options="catelist"
            :props="cateProps"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>

      <!-- tab 页签区域 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 添加动态参数的面板 -->
        <el-tab-pane label="动态参数" name="many">
          <!-- 添加参数的按钮 -->
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDialogVisible = true"
            >添加参数</el-button
          >

          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" border stripe>
            <!-- 扩展 -->
            <el-table-column type="expand">
              <template v-slot="scope">
                <!-- 循环渲染tag标签 -->
                <el-tag
                  closable
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  @close="handleClose(i, scope.row)"
                >
                  {{ item }}
                </el-tag>
                <!-- 输入的文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!-- 添加按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row.attr_id)"
                >
                  修改</el-button
                >
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  @click="removeParams(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- 添加静态属性的面板 -->
        <el-tab-pane label="静态属性" name="only">
          <!-- 添加参数的按钮 -->
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDialogVisible = true"
            >添加属性</el-button
          >
          <!-- 静态属性表格 -->
          <el-table :data="onlyTableData" border stripe>
            <!-- 扩展 -->
            <el-table-column type="expand">
              <template v-slot="scope">
                <!-- 循环渲染tag标签 -->
                <el-tag
                  closable
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  @close="handleClose(i, scope.row)"
                >
                  {{ item }}
                </el-tag>
                <!-- 输入的文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!-- 添加按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column
              label="属性名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row.attr_id)"
                >
                  修改</el-button
                >
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  @click="removeParams(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加动态/静态参数对话框 -->
    <el-dialog
      :title="'添加' + tittleText"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <!-- 添加参数的对话框 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item :label="tittleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改动态/静态参数对话框 -->
    <el-dialog
      :title="'修改' + tittleText"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <!-- 添加参数的对话框 -->
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item :label="tittleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //商品分类列表
      catelist: [],
      //级联选择框信息配置
      cateProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      //级联选择框双向绑定的数据组
      selectedCateKeys: [],
      // 被激活的页签的名称
      activeName: "many",
      // 动态参数的数据
      manyTableData: [],
      // 静态属性的数据
      onlyTableData: [],
      // 控制对话框显示
      addDialogVisible: false,
      //添加参数的表单数据对象
      addForm: {
        attr_name: "",
      },
      //添加表单的验证规则对象
      addFormRules: {
        attr_name: [
          {
            required: true,
            message: "请输入参数名称",
            trigger: "blur",
          },
        ],
      },
      // 控制修改对话框显示与隐藏
      editDialogVisible: false,
      // 修改表单数据对象
      editForm: {},
      // 修改表单的验证规则对象
      editFormRules: {
        attr_name: [
          {
            required: true,
            message: "请输入参数名称",
            trigger: "blur",
          },
        ],
      },
    //   // 控制按钮与文本框的切换显示
    //   inputVisible: false,
    //   // 文本框中输入的内容
    //   inputValue: ''
    };
  },
  created() {
    this.getCateList();
  },
  computed: {
    //如果按钮需要被禁用，则返回true，否则返回false
    isBtnDisabled() {
      if (this.selectedCateKeys.length !== 3) {
        return true;
      }
      return false;
    },
    //当前选中的三级分类的ID
    cateId() {
      if (this.selectedCateKeys.length == 3) {
        return this.selectedCateKeys[2];
      }
      return null;
    },
    tittleText() {
      if (this.activeName === "many") {
        return "动态参数";
      }
      return "静态属性";
    },
  },
  methods: {
    //获取所有商品分类数据
    async getCateList() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品分类失败！");
      }
      this.catelist = res.data;
    },
    //级联选择框选中项改变时触发
    handleChange() {
      this.getParamsData();
    },
    // TAB 页签点击事件的处理函数
    handleTabClick() {
      this.getParamsData();
    },
    // 获取参数的列表数据
    async getParamsData() {
      //证明选中的不是三级分类
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = [];
        this.manyTableData = [];
        this.onlyTableData = [];
        return;
      }
      console.log(this.cateId);
      //证明选中的是三级分类
      // 根据所选分类的ID，和当前所处的面板，获取对应的参数
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: { sel: this.activeName },
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品分类参数失败！");
      }

      res.data.forEach((item) => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
        //新增一个控制文本框的显示与隐藏
        item.inputVisible = false;
        //新增一个文本框中输入的值
        item.inputValue = ''
      });

      if (this.activeName === "many") {
        this.manyTableData = res.data;
      } else {
        this.onlyTableData = res.data;
      }
    },
    // 监听添加对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    // 点击按钮，添加参数
    addParams() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          `categories/${this.cateId}/attributes`,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName,
          }
        );
        if (res.meta.status !== 201) {
          return this.$message.error("添加参数失败！");
        }
        this.getParamsData();
        this.$message.success("添加参数成功！");
        this.addDialogVisible = false;
      });
    },
    // 监听编辑对话框关闭，重置修改的表单
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    // 点击确认按钮，修改参数信息至服务器
    editParams() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
          {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeName,
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("修改信息失败！");
        }
        this.$message.success("修改信息成功！");
        this.getParamsData();
        this.editDialogVisible = false;
      });
    },
    //点击按钮，展示修改的对话框
    async showEditDialog(attr_id) {
      //查询当前参数的信息
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes/${attr_id}`,
        {
          params: { attr_sel: this.activeName },
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("获取参数信息失败");
      }
      this.editForm = res.data;
      this.editDialogVisible = true;
    },
    // 依据id删除对应的参数/属性
    async removeParams(id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该参数, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);

      // 用户取消了删除的操作
      if (confirmResult !== "confirm") {
        return this.$message.info("已取消删除！");
      }

      // 删除的业务逻辑
      const { data: res } = await this.$http.delete(
        `categories/${this.cateId}/attributes/${id}`
      );
      if (res.meta.status !== 200) {
        return this.$message.error("参数删除失败！");
      }
      this.getParamsData();
      this.$message.success("参数删除成功！");
    },
    // 文本框失去焦点或enter都会出发点的处理函数
    handleInputConfirm(row) {
        if(row.inputValue.trim().length === 0) {
            row.inputValue = '';
            row.inputVisible = false;
            return
        }
         //如果没有return，则证明输入的内容，需要左后续处理
         row.attr_vals.push(row.inputValue.trim());
         row.inputValue = '';
         row.inputVisible = false;
         //需要发起请求，保存这次操作
         this.saveAttrVals(row)
         
    },
    // 将对 attr_vals 的操作，保存到数据库
    async saveAttrVals(row) {
        //需要发起请求，保存这次操作（若只保存在本地，只要一刷新，就没了）
         const { data : res } = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
             attr_name: row.attr_name,
             attr_sel: row.attr_sel,
             attr_vals: row.attr_vals.join(' ')
         })
         if(res.meta.status !== 200) {
             return this.$message.error('标签修改失败！')
         }
         this.$message.success('标签修改成功！')
    },
    // 点击按钮，展示文本输入框
    showInput(row) {
        row.inputVisible = true;
        //让文本框自动获得焦点
        //  $nextTick 方法的作用，就是当页面上元素被重新渲染之后，才会指定回调函数中的代码
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
    },
    // 监听tag关闭事件，删除对应的参数可选项
    handleClose(i, row) {
        row.attr_vals.splice(i, 1);
        //需要发起请求，保存这次操作
        this.saveAttrVals(row)
    }
  },
};
</script>

<style scoped lang="less">
.cat-opt {
  margin: 15px;
}

.el-tag {
  margin: 10px;
}

.input-new-tag {
    width: 120px;
}
</style>