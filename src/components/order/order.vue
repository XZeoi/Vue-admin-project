<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col :span="8">
            <!-- 订单查询的后台API有问题，查询没反应 -->
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getOrderList">
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="btn1"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 订单列表区域 -->
      <el-table :data="orderList" style="width: 100%" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="order_number" label="订单编号"></el-table-column>
        <el-table-column
          prop="order_price"
          label="订单价格"
          width="70px"
        ></el-table-column>
        <el-table-column prop="order_pay" label="是否付款" width="80px">
          <template v-slot="scope">
            <el-tag type="danger" v-if="scope.row.order_pay === '0'"
              >未付款</el-tag
            >
            <el-tag type="success" v-else>已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="is_send"
          label="是否发货"
          width="70px"
        ></el-table-column>
        <el-table-column prop="create_time" label="下单时间" width="170px">
          <template v-slot="scope">{{
            scope.row.create_time | dateFormat
          }}</template>
        </el-table-column>
        <el-table-column label="操作" width="120px">
          <template v-slot="">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editBtn"
            ></el-button>
            <el-button
              type="success"
              icon="el-icon-location-outline"
              size="mini"
              @click="showProgressBox"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 页码区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 20, 30]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>
    </el-card>

    <!-- 修改地址对话框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editFormClosed"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader
            :options="cityData"
            v-model="editForm.address1"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="editForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sendBtn">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 展示物流进度的对话框 -->
    <el-dialog
      title="物流进度"
      :visible.sync="progressVisible"
      width="50%"
      @close="editFormClosed"
    >
          <el-timeline>
            <el-timeline-item
              v-for="(activity, index) in progressInfo"
              :key="index"
              :timestamp="activity.time"
            >
              {{ activity.context }}
            </el-timeline-item>
          </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import citydata from "./citydata";
import cityData from "./citydata";

export default {
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      orderList: [],
      total: 0,

      editDialogVisible: false,
      editForm: {
        address1: [],
        address2: "",
      },
      editFormRules: {
        address1: [
          {
            required: true,
            message: "请选择所在的省市区/县！",
            trigger: "blur",
          },
        ],
        address2: [
          { required: true, message: "请填写详细地址！", trigger: "blur" },
        ],
      },
      cityData,

      progressVisible: false,
      progressInfo: [],
    };
  },
  created() {
    this.getOrderList();
  },
  methods: {
    async getOrderList() {
      const { data: res } = await this.$http.get("orders", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200) {
        return this.$message.error("订单列表获取失败！");
      }
      this.orderList = res.data.goods;
      this.total = res.data.total;
      console.log(this.orderList);
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getOrderList();
    },
    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum;
      this.getOrderList();
    },
    editBtn() {
      this.editDialogVisible = true;
    },
    editFormClosed() {
      this.$refs.editFormRef.resetFields();
    },
    sendBtn() {
      this.$refs.editFormRef.validate((valid) => {
        if (!valid) {
          return this.$message.error("请完成地址修改内容！");
        }
        // 由于后台接口没写，此处发送功能暂停编写（待定）
        // -----------------------------------------------------
        // this.$http.
        // -----------------------------------------------------
        // this.editDialogVisible = false
      });
    },
    async showProgressBox() {
      const { data: res } = await this.$http.get("/kuaidi/1106975712662");
      if (res.meta.status !== 200) {
        return this.$message.error("查询物流信息失败！");
      }
      this.progressInfo = res.data;
      this.progressVisible = true;
    },
    btn1() {
        console.log('查询')
        this.getOrderList()
    }
  },
};
</script>

<style scoped>
.el-cascader {
  width: 100%;
}
</style>