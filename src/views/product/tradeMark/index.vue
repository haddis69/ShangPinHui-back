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
          <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateTradeMark(row)">修改</el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteTradeMark(row)"
          >删除</el-button>
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
    <el-dialog :title="tmForm.id ?'修改品牌':'添加品牌'" :visible.sync="dialogFormVisible">
      <!-- 表单数据收集到tmForm身上，将来表单验证也需要这个字段 -->
      <el-form style="width:80%;" :model="tmForm" :rules="rules" ref="ruleform">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input autocomplete="off" v-model="tmForm.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTradeMark">确 定</el-button>
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
      //品牌信息字段
      tmForm: {
        tmName: "",
        logoUrl: ""
      },
      //验证规则
      rules: {
        tmName: [
          { required: true, message: "请输入品牌名称", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "长度在 2到 10 个字符",
            trigger: "change"
          }
        ],
        logoUrl: [{ required: true, message: "请选择品牌图片" }]
      }
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
      //点击添加的时候置空tmform，否则还有上次的数据
      this.tmForm = { tmName: "", logoUrl: "" };
    },
    //修改
    updateTradeMark(row) {
      //row就是点击的品牌的信息，这是element-ui的内置api
      this.dialogFormVisible = true;
      //将已有的品牌信息赋给tmForm,里面带上了id,由于tmForm和对话框双向绑定，对话框里也自然有信息
      //这里要用浅拷贝，tmForm和表单中指向的对象都是一个对象，即为服务器返回的数据
      //所以要避免避免tmForm直接值就是服务器返回的数据
      //否则无论是否修改，页面都会变
      this.tmForm = { ...row };
    },
    handleAvatarSuccess(res, file) {
      //res是上传成功之后返回给前端的数据，里面data就是真实的图片地址而不是本地地址
      //file更加全面，不过更多用到的是res
      //收集表单数据准备给服务器
      this.tmForm.logoUrl = res.data;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    addOrUpdateTradeMark() {
      //success返回的是成功与失败，if(success)表示成功
      this.$refs.ruleform.validate(async success => {
        if (success) {
          this.dialogFormVisible = false;
          let result = await this.$API.trademark.reqAddOrUpdateTradeMark(
            this.tmForm
          );
          if (result.code === 200) {
            this.$message({
              type: "success",
              message: this.tmForm.id ? "修改品牌成功" : "添加品牌成功"
            });
            //重新展示页面
            this.getPageList();
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    deleteTradeMark(row) {
      this.$confirm(`你确认删除${row.tmName}`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          //当用户点击确定按钮的时候会触发
          //向服务器发请求
          let result = await this.$API.trademark.reqDeleteTradeMark(row.id);
          //如果删除成功
          if (result.code == 200) {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            //再次获取品牌列表数据
            this.getPageList();
          }
        })
        .catch(() => {
          //用户点击取消按钮
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
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
  border-color: #409eff;
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
