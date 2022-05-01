<template>
  <div>
    <el-card style="margin: 20px 0">
      <CategorySelect @getCategoryId="getCategoryId" :show="!show"></CategorySelect>
    </el-card>
    <el-card>
      <!-- 这里将有3部分进行切换 -->
      <div>
        <!-- 展示spu列表 -->
        <el-button type="primary" icon="el-icon-plus">添加spu</el-button>
        <el-table style="width: 100%" border>
          <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
          <el-table-column prop="prop" label="spu名称" width="width"></el-table-column>
          <el-table-column prop="prop" label="spu描述" width="width"></el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{row,$index}">
              <el-button type="success" icon="el-icon-plus" size="mini"></el-button>
              <el-button type="warning" icon="el-icon-edit" size="mini"></el-button>
              <el-button type="info" icon="el-icon-info" size="mini"></el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
            </template>
          </el-table-column>
        </el-table>
          <!-- @size-change="handleSizeChange"
          @current-change="handleCurrentChange" -->
        <el-pagination
          style="textAlign:center;"
          :current-page="6"
          :page-sizes="[3, 5, 10]"
          :page-size="3"
          layout="prev, pager, next, jumper,->,sizes,total "
          :total="23">
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>
<script>
export default {
  name: "Spu",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      show: true
    };
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
    getSpuList() {
      alert(123);
    }
  }
};
</script>
<style scoped></style>
