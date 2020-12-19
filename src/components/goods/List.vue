<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- table表格区域 -->
      <el-table :data="goodsList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称">{{goodsList.goods_name}}
        </el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="95px">{{goodsList.goods_price}}
        </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="70px">{{goodsList.goods_weight}}
        </el-table-column>
        <!-- <el-table-column prop="add_time" label="创建时间" width="140px">{{goodsList.add_time | dateFormat}} -->
            <!-- 为什么这里一定要一个作用域插槽拿到数据，而不是直接用上面的方式（得到NaN） -->
        <el-table-column prop="add_time" label="创建时间" width="140px">
            <template v-slot="scope">{{scope.row.add_time | dateFormat}}</template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
            <!-- 用作用域插槽的方式接收一下数据 -->
            <template v-slot="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeById(scope.row.goods_id)"></el-button>
            </template>
        </el-table-column>
      </el-table>

      <!-- 分页页码区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background>
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //getGoodsList()查询参数对象
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      //商品列表数据响应
      goodsList: [],
      //总数据条数
      total: 0
    };
  },
  created() {
    this.getGoodsList();
  },
  methods: {
    //更具分页获取对应的商品列表
    async getGoodsList() {
      const { data: res } = await this.$http.get("goods", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200) {
        return this.$message.error("商品列表数据获取失败！");
      }
      this.goodsList = res.data.goods;
      this.total = res.data.total;
      console.log(res.data)
      this.$message.success('商品列表数据获取成功！')
    },
    //页数改变时被触发，获得当前页数newSize
    handleSizeChange(newSize) {
        //拿到最新的页数newSize
        this.queryInfo.pagesize = newSize
        //获得最新页数后，重新向服务器发请求刷新数据
        this.getGoodsList()
    },
    handleCurrentChange(newNum) {
        this.queryInfo.pagenum = newNum
        this.getGoodsList()
    },
    async removeById(id) {
        const confirmResult = await this.$confirm('此操作将永久删除该商品，是否继续？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).catch(err => err)

        if(confirmResult !== 'confirm') {
            return this.$message.info('已经取消删除！')
        }

        const { data : res } = await this.$http.delete(`goods/${id}`)
        if(res.meta.status !== 200) {
            return this.$message.error('删除失败！')  
        }
        this.$message.success('删除成功！')
        this.getGoodsList()
    },
    goAddPage() {
        this.$router.push('/goods/add')
    }
  },
};
</script>

<style scoped>
</style>