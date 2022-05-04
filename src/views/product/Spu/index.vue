<template>
  <div>
    <el-card style="margin: 20px 0">
      <CategorySelect @getCategoryId="getCategoryId" :show="scene != 0"></CategorySelect>
    </el-card>
    <el-card>
      <!-- 这里将有3部分进行切换 -->
      <!-- 展示spu列表 -->
      <div v-show="scene == 0">
        <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id" @click="addSpu">添加spu</el-button>
        <el-table style="width: 100%" border :data="records">
          <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
          <el-table-column prop="spuName" label="spu名称" width="width"></el-table-column>
          <el-table-column prop="description" label="spu描述" width="width"></el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row }">
              <!-- 自定义封装组件，虽然封装的名字是HintButton，但是这里可以写hint-button -->
              <hint-button
                type="success"
                icon="el-icon-plus"
                size="mini"
                title="添加sku"
                @click.native="addSku(row)"
              ></hint-button>
              <hint-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                title="修改spu"
                @click.native="updateSpu(row)"
              ></hint-button>
              <hint-button
                type="info"
                icon="el-icon-info"
                size="mini"
                title="查看当前所有spu类所有sku列表"
                @click.native="handlerCheckSku(row)"
              ></hint-button>
              <el-popconfirm title="这是一段内容确定删除吗？" @onConfirm="deleteSpu(row)">
                <hint-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  title="删除spu"
                  slot="reference"
                ></hint-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          style="textalign: center"
          :current-page="page"
          :page-sizes="[3, 5, 10]"
          :page-size="limit"
          layout="prev, pager, next, jumper,->,sizes,total "
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          :total="total"
        ></el-pagination>
      </div>
      <SpuForm v-show="scene == 1" @changeScene="changeScene" ref="spu"></SpuForm>
      <SkuForm v-show="scene == 2" ref="sku" @changeScene="changeScene"></SkuForm>
    </el-card>
    <el-dialog :title="`${spu.spuName}的sku列表`" :visible.sync="dialogTableVisible" :before-close="close">
      <el-table :data="skuList" style="width: 100%" border v-loading="loading">
        <el-table-column prop="skuName" label="名称" width="width"></el-table-column>
        <el-table-column prop="price" label="价格" width="width"></el-table-column>
        <el-table-column prop="weight" label="重量" width="width"></el-table-column>
        <el-table-column label="默认图片" width="width">
          <template slot-scope="{row}">
            <img :src="row.skuDefaultImg" style="width:100px;height:100px;"/>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
import SpuForm from "./SpuForm";
import SkuForm from "./SkuForm";
export default {
  name: "Spu",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      // 分页器默认页码
      page: 1,
      //每页数据条数
      limit: 3,
      //spu列表数据(发请求返回的)
      records: [],
      //分页器需要展示数据的条数
      total: 0,
      //场景,上面可以有三种状态的切换，这个值控制该展示哪个场景
      //0就是展示spu列表，1代表添加与修改spu，2代表添加sku
      scene: 0,
      //对话框默认隐藏
      dialogTableVisible: false,
      //声明一个spu对象,点击查看sku按钮的时候，对话框里的很多属性都用到了这个值
      spu: {},
      //存储sku的数据
      skuList: [],
      //加载指令所绑定的字段
      loading:true
    };
  },
  components: {
    SpuForm,
    SkuForm
  },
  methods: {
    //自定义事件，把子组件相应的id传递给父组件
    getCategoryId({ categoryId, level }) {
      //获取到一级，二级，三级分类的id
      //level是为了区分几级id
      if (level == 1) {
        this.category1Id = categoryId;
        //清除2,3级id
        this.category2Id = "";
        this.category3Id = "";
      } else if (level == 2) {
        this.category2Id = categoryId;
        this.category3Id = "";
      } else {
        this.category3Id = categoryId;
        this.getSpuList();
      }
    },
    //获取spu列表数据的方法
    async getSpuList() {
      //admin/product/{page}/{limit}   get   page limit category3Id
      const { page, limit, category3Id } = this;
      let result = await this.$API.spu.reqSpuList(page, limit, category3Id);
      if (result.code === 200) {
        this.records = result.data.records;
        this.total = result.data.total;
      }
    },
    //当前页码改变,page是element-ui封装好的传进来的点击的页码
    handleCurrentChange(page) {
      this.page = page;
      this.getSpuList();
    },
    //分页器的一页条数变化，选择的数字已经注入
    handleSizeChange(limit) {
      this.limit = limit;
      this.getSpuList();
    },
    //添加spu按钮的回调
    addSpu() {
      this.scene = 1;
      this.$refs.spu.addSpuData(this.category3Id);
    },
    //修改spu的回调
    updateSpu(row) {
      this.scene = 1;
      //spuform需要每次出现在页面的时候都发请求，但是不能在它的mounted里，因为我们用的是v-show
      //v-show控制的是显示与隐藏，它的组件的mounted只会触发一次，不能多次发请求
      //所以这里我们采用父组件操作子组件自定义事件的方法
      this.$refs.spu.initSpuData(row);
    },
    //自定义事件的回调,spuform传入参数0，切换场景
    changeScene(scene) {
      this.scene = scene;
      this.getSpuList();
    },
    //删除Spu
    async deleteSpu(row) {
      let result = await this.$API.spu.reqDeleteSpu(row.id);
      if (result.code == 200) {
        this.$message({ type: "success", message: "删除成功" });
        this.getSpuList();
      }
    },
    //添加sku
    addSku(row) {
      this.scene = 2;
      //点击的spu身上有spuId和category3Id,都在row里
      this.$refs.sku.getData(this.category1Id, this.category2Id, row);
    },
    //查看sku按钮的回调
    async handlerCheckSku(spu) {
      //保存点击的spu信息
      this.spu = spu;
      //控制对话框是否可见
      this.dialogTableVisible = true;
      //获取sku的列表进行展示
      let result = await this.$API.spu.reqSkuList(spu.id);
      if (result.code === 200) {
        this.skuList = result.data;
        //去除loading效果
        this.loading=false;
      }
    },
    //关闭对话框的回调
    close(done){
      //loading的两个小细节
      //1.loading只能使用一次
      //2.查看其它的sku会有回显
      //所以要在这里设置关闭对话框的优化
      this.loading=true;
      this.skuList=[];
      //注入的参数，关闭对话框
      done();
    }
  }
};
</script>
<style scoped></style>
