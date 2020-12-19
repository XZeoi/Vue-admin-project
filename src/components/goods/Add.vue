<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 提示区域 -->
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon
        :closable="false"
      ></el-alert>

      <!-- 步骤条区域 -->
      <!-- -0 操作实现字符串转化为数值 -->
      <el-steps
        :space="200"
        :active="activeIndex - 0"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- 标签区域 -->
      <!-- 因为添加商品信息是包括下面所有的内容，因此需要将在外面包裹一个表单 -->
      <!-- el-tab-pane 只能放在el-tabs 中，所以要将表单放在el-tabs外面 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs v-model="activeIndex" tab-position="left" :before-leave="beforeTabLeave" @tab-click="tabClicked">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <!-- 级联选择框 -->
              <el-cascader
                v-model="addForm.goods_cat"
                :options="catelist"
                :props="cateProps"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!-- 渲染表单的item项 -->
            <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
              <!-- 复选框组 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox border :label="cb" v-for="(cb, i) in item.attr_vals" :key="i"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- 上传商品图片 -->
              <!-- action 图片上传至后台API的地址 -->
            <el-upload
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="handleSuccess"
              >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器区域 -->
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <!-- 添加商品按钮区域 -->
            <el-button type="primary" class="btnAdd" @click="add">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>


    <!-- 图片预览对话框 -->
    <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
      <img :src="previewPicURL" alt="">
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  data() {
    return {
      activeIndex: "0",
      //添加商品的表单数据对象
      addForm: {
        goods_name: "",
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // 商品所属的分类数组
        goods_cat: [],
        //图片的数组
        pics: [],
        //商品的详情描述
        goods_introduce: '',
        attrs: []
      },
      //表单规则
      addFormRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" },
        ],
        goods_cat: [
          { required: true, message: "请选择商品分类", trigger: "blur" },
        ]
      },
      //商品分类数据列表
      catelist: [],
      //级联选择框的配置信息
      //  label 你看到的名称； value 你选中的属性，这里用cat_id表示选中的；children 指定哪个属性来执行父子属性的嵌套
      cateProps: { 
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        children: 'children' 
      },
      //动态参数列表数据
      manyTableData: [],
      //静态属性列表数据
      onlyTableData: [],
      // 上传图片的后台API地址
      uploadURL: 'http://www.ysqorz.top:8888/api/private/v1/upload',
      //图片上传组件的headers请求头对象
      //  因为el-upload组件内部自己封装了Axios，所以请求头需要另行设置，在main.js设置的请求头在这里无效，需手动设置
      headerObj: {
        Authorization : window.sessionStorage.getItem('token')
      },
      //预览照片的绝对地址
      previewPicURL: '',
      //预览照片的对话框显示与隐藏
      previewVisible: false
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200) {
        return this.$message.error("商品分类列表获取失败！");
      }
      this.catelist = res.data;
    },
    // 级联选择器选中项变化
    handleChange() {
      if(this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
    },
    //TAB 的钩子函数，在切换标签时被触发 返回false会组织标签切换
    //  这里要实现基本信息标签切换到其它标签时，前提是需要基本信息标签中的商品分类已被选择才可以进行切换的功能
    beforeTabLeave(activeName,oldActiveName) {
      if(oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类！')
        return false
      }
    },
    //
    async tabClicked() {
      console.log('test')
      if(this.activeIndex === '1') {
        //当点击到商品参数标签时，拿到商品参数列表信息
        const { data : res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
          params: { sel: 'many'}
        })

        if(res.meta.status !== 200) {
          return this.$message.error('获取动态参数列表失败')
        }
        res.data.forEach(item => {
          // item.attr_vals = item.attr_vals.length ? item.attr_vals.split(' ') : '' 
          item.attr_vals = item.attr_vals.length ? item.attr_vals.split(',') : '' 
        })
        this.manyTableData = res.data
        console.log(this.manyTableData)
      } else if(this.activeIndex === '2') {
        //当点击到商品属性标签时，拿到商品属性列表信息
        const { data : res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
          params: { sel: 'only'}
        })
        if(res.meta.status !== 200) {
          return this.$message.error('静态属性获取失败！')
        } 
        this.onlyTableData = res.data
      }
    },
    //点击图片时，触发“处理图片预览效果”
    handlePreview(file) {
      console.log(file)
      this.previewPicURL = file.response.data.url
      this.previewVisible = true
    },
    //当点击X号时会触发，处理移除图片的操作
    handleRemove(file) {
      // 1、获取将要删除的图片的临时路径
      const filePath = file.response.data.tmp_path
      // 2、从pics数组中，找到这个图片对应的索引值
      const i = this.addForm.pics.findIndex(x => x.pic === filePath )
      // 3、调用数组的splice方法，把图片信息对象，从pics数组中移除
      this.addForm.pics.splice(i, 1)
    },
    //  监听图片上传成功的事件
    handleSuccess(res) {
      //1、先拼接得到一个图片信息对象
      const picInfo = { pic: res.data.tmp_path}
      //2、再将图片信息对象，push到pics数组中
      this.addForm.pics.push(picInfo)
    },
    // 添加商品
    add() {
      this.$refs.addFormRef.validate(async valid=>{
        if(!valid) {
          return this.$message.error('请填写必要的表单项！')
        }
        //执行添加的业务逻辑
        //1、goods_cat提交前转为字符串的处理
            //深拷贝，为后面转化为字符串作准备
            //若不深拷贝，后面的字符串和前面表单中商品分类的双向绑定的数组发生冲突
        const form = _.cloneDeep(this.addForm)
        form.goods_cat = form.goods_cat.join(',')
        
        //2、attrs提交前，分别针对参数和属性，进行处理
            //处理动态参数
        this.manyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_vals: item.attr_vals.join(' ')
          }
          this.addForm.attrs.push(newInfo)
        })
            //处理静态属性
        this.onlyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_vals: item.attr_vals
          }
          this.addForm.attrs.push(newInfo)
        })

        form.attrs = this.addForm.attrs

        //发起请求，添加商品
        //  商品名称，必须是唯一的
        const { data : res } = await this.$http.post('goods', form)
        if(res.meta.status !== 201) {
          return this.$message.error('商品添加失败！')
        }
        this.$message.success('商品添加成功！')
        this.$router.push('/goods')
      })
    }
  },
  computed: {
    cateId() {
      if(this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  }
};
</script>

<style scoped>
.el-checkbox {
  margin: 0 10px 0 0 !important;
}

.btnAdd {
  margin-top: 15px;
}
</style>