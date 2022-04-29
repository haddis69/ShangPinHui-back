<template>
  <div>
    <el-button type="primary" icon="el-icon-plus" style="margin:10px 0px;" @click="showDialog">添加</el-button>
    <!-- data是表格的数据，只能是数组类型 -->
    <!-- border是表格的边框-->
    <!-- el-table-column是一列属性，label是标题，width是对应列的宽度，align是标题对齐方式 -->
    <!-- el-table是以列为单位而不是以行单位，一个 el-table-column是一列而不是一行 -->
    <!-- type index就可以展示序号 -->
    <!-- prop展示的是字段名,这里不用循环遍历,直接写字段名 -->
    <el-table style="width: 100%" border :data="list">
      <el-table-column prop="prop" label="序号" width="80px" align="center" type="index"></el-table-column>
      <el-table-column prop="tmName" label="品牌名称" width="width" align="center"></el-table-column>
      <el-table-column prop="logoUrl" label="品牌LOGO" width="width">
        <!-- 这里进行回传，row是上面的prop,$index是索引值，row，$index名字是固定的 -->
        <template slot-scope="{row}">
          <img :src="row.logoUrl" style="width:100px;height:100px;" />
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{row,$index}">
          <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateTradeMark">修改</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- current-page 当前第几页 total 数据总条数 page-size 每页展示条数 连续页码数 -->
    <!-- page-count的值是总页码数,减去2(首尾)是连续页码数 -->
    <el-pagination
      style="margin-top:20px;text-align:center"
      :current-page="page"
      :page-sizes="[3,5,10]"
      :page-size="limit"
      :page-count="7"
      layout=" prev, pager, next, jumper,->,sizes, total "
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    ></el-pagination>
    <!-- 对话框 -->
    <!-- visible.sync,.sync是控制子组件属性同步的 -->
    <!-- :model收集表单元素 -->
    <el-dialog title="添加品牌" :visible.sync="dialogFormVisible">
      <el-form style="width:80%;">
        <el-form-item label="品牌名称" label-width="100px">
          <el-input autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px">
          <el-upload
            class="avatar-uploader"
            action="https://jsonplaceholder.typicode.com/posts/"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "TradeMark",
  data() {
    return {
      //当前获取第几页
      page: 1,
      //一页几条
      limit: 3,
      //服务器给我们的总共数据的条数
      total: 0,
      //列表展示的数据
      list: [],
      //对话框是否可见或者隐藏
      dialogFormVisible: false,
      //每个label宽度
      formLabelWidth: "100px",
      imageUrl: ''
    };
  },
  mounted() {
    //获取列表数据的方法
    this.getPageList();
  },
  methods: {
    //获取列表数据的数据
    async getPageList() {
      const { page, limit } = this;
      //request({url:`/admin/product/baseTrademark/${page}/${limit}`,method:'get'})
      let result = await this.$API.trademark.reqTradeMarkList(page, limit);
      if (result.code === 200) {
        this.total = result.data.total;
        this.list = result.data.records;
      }
    },
    //回调函数里可以传入点击的页码数
    handleCurrentChange(pager) {
      this.page = pager;
      this.getPageList();
    },
    //传入的是改变的每页长度
    handleSizeChange(limit) {
      this.limit = limit;
      this.getPageList();
    },
    //添加
    showDialog() {
      this.dialogFormVisible = true;
    },
    //修改
    updateTradeMark() {
      this.dialogFormVisible = true;
    },
     handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      }
  }
};
</script>
<style scoped>
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
