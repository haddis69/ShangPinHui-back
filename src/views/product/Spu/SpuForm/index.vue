<template>
  <div>
    <!-- item都会继承el-form的宽度 -->
    <el-form ref="form" label-width="80px">
      <el-form-item label="SPU名称">
        <el-input placeholder="SPU名称"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select placeholder="请选择品牌" value>
          <el-option label="label" value="value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input placeholder="SPU描述" type="textarea" rows="4"></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <el-upload
          action="https://jsonplaceholder.typicode.com/posts/"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt />
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select placeholder="还有3未选择" value>
          <el-option label="label" value="value"></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-plus" style="margin-left:10px;">添加销售属性</el-button>
        <el-table style="width: 100%" border>
          <el-table-column type="index" align="center" label="序号" width="80"></el-table-column>
          <el-table-column prop="prop" label="属性名" width="width"></el-table-column>
          <el-table-column prop="prop" label="属性值名称列表" width="width"></el-table-column>
          <el-table-column prop="prop" label="操作" width="width"></el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
          <el-button type="primary">保存</el-button>
          <el-button @click="$emit('changeScene',0)">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: "SpuForm",
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      //存储spu信息属性
      spu:{},
      //存储品牌信息
      tradeMarkList:[],
      //存储图片信息
      spuImageList:[],
      //销售属性列表
      saleAttrList:[]
    };
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //初始化spuForm的数据,什么时候触发这个函数是父组件那边通过ref得到的
    //row是父组件传过来的点击的哪行
    async initSpuData(spu){
        //获取spu信息的数据
        let spuResult = await this.$API.spu.reqSpu(spu.id);
        if(spuResult.code===200){
          this.spu=spuResult.data;
        }
        //获取品牌信息
        let tradeMarkResult = await this.$API.spu.reqTradeMarkList();
        if(tradeMarkResult.code===200){
          this.tradeMarkList=tradeMarkResult.data;
        }
        //获取spu图片数据
        let spuImageResult = await this.$API.spu.reqSpuImageList(spu.id);
        if(spuImageResult.code===200){
          this.spuImageList=spuImageResult.data;
        }
        //获取平台全部销售属性
        let saleResult = await this.$API.spu.reqBaseSaleAttrList();
        if(saleResult.code===200){
          this.saleAttrList=saleResult.data;
        }
    }
  }
};
</script>
<style></style>
