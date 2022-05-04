<template>
  <div>
    <el-table style="width: 100%" border :data="records">
      <el-table-column type="index" label="序号" align="center" width="80"></el-table-column>
      <el-table-column prop="skuName" label="名称" width="width"></el-table-column>
      <el-table-column prop="skuDesc" label="描述" width="width"></el-table-column>
      <el-table-column label="默认图片" width="110">
        <template slot-scope="{row}">
          <img :src="row.skuDefaultImg" style="width:80px;height:80px;" />
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="重量" width="80"></el-table-column>
      <el-table-column prop="price" label="价格" width="80"></el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{row}">
          <el-button
            type="success"
            icon="el-icon-sort-down"
            size="mini"
            v-if="row.isSale==0"
            @click="sale(row)"
          ></el-button>
          <el-button
            type="success"
            icon="el-icon-sort-up"
            size="mini"
            v-else
            @click="cancelSale(row)"
          ></el-button>
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="$message('正在开发中！')"></el-button>
          <el-button type="info" icon="el-icon-info" size="mini"></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="textAlign:center;"
      :current-page="page"
      :page-sizes="[3, 5, 10]"
      :page-size="limit"
      layout="prev, pager, next, jumper,->,sizes,total"
      :total="total"
      @current-change="getSpuList"
      @size-change="handleSizeChange"
    ></el-pagination>
  </div>
</template>
<script>
export default {
  name: "Sku",
  data() {
    return {
      //当前第几页
      page:1,
      //当前页面的数据条数
      limit:10,
      //sku列表的数组
      records:[],
      //分页器一共展示多少条数据
      total:0
    }
  },
  mounted() {
    this.getSpuList();
  },
  methods:{
    //获取sku列表的方法
    //由于这个函数作为了页码变化的回调，括号里能拿到点击的page的值
    async getSpuList(pages=1){
      this.page=pages;
      const {page,limit}=this;
      let result = await this.$API.sku.reqSkuList(page,limit);
      if(result.code===200){
        this.records=result.data.records;
        this.total=result.data.total;
      }
    },
    //每页数据条数变化
    handleSizeChange(limit){
      this.limit=limit;
      this.getSpuList();
    },
    //上架
    async sale(row){
      let result = await this.$API.sku.reqSale(row.id);
      if(result.code===200){
        row.isSale=1;
        this.$message({
          type:'success',
          message:'上架成功'
        })
      }
    },
    //下架
    async cancelSale(row){
      let result = await this.$API.sku.reqCancel(row.id);
      if(result.code===200){
        row.isSale=0;
        this.$message({
          type:'success',
          message:'下架成功'
        })
      }
    }
  }
};
</script>
<style scoped>
</style>
