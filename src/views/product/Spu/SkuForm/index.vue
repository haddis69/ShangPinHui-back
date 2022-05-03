<template>
  <div>
    <el-form ref="form" label-width="80px">
      <el-form-item label="SKU名称">{{spu.spuName}}</el-form-item>
      <el-form-item label="SKU名称">
        <el-input placeholder="请输入SKU名称" v-model="skuInfo.skuName"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input placeholder="请输入价格" v-model="skuInfo.price" type="number"></el-input>
      </el-form-item>
      <el-form-item label="重量(千克)">
        <el-input placeholder="请输入重量" v-model="skuInfo.weight"></el-input>
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input type="textarea" rows="4" v-model="skuInfo.skuDesc"></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form :inline="true" ref="form" label-width="80px">
          <el-form-item :label="attr.attrName" v-for="(attr) in attrInfoList" :key="attr.id">
            <!-- attrIdAndValueId无需特意声明一个字段 -->
            <el-select placeholder="请选择" v-model="attr.attrIdAndValueId">
              <!-- 收集下拉框的id以及选项的值的id就可以知道用户选择的字段，服务器要这两个id就够了 -->
              <el-option :label="attrValue.valueName" :value="`${attr.id}:${attrValue.id}`" v-for="(attrValue) in attr.attrValueList" :key="attrValue.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form :inline="true" ref="form" label-width="80px">
          <el-form-item :label="spuSaleAttr.saleAttrName" v-for="(spuSaleAttr) in spuSaleAttrList" :key="spuSaleAttr.id">
            <el-select placeholder="请选择" v-model="spuSaleAttr.attrIdAndValueId">
              <el-option :value="`${spuSaleAttr.id}:${spuSaleAttrValue.id}`" :label="spuSaleAttrValue.saleAttrValueName" v-for="(spuSaleAttrValue) in spuSaleAttr.spuSaleAttrValueList" :key="spuSaleAttrValue.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表">
        <el-table style="width: 100%" border>
          <el-table-column prop="prop" type="selection" label="label" width="80"></el-table-column>
          <el-table-column prop="prop" label="图片" width="width"></el-table-column>
          <el-table-column prop="prop" label="名称" width="width"></el-table-column>
          <el-table-column prop="prop" label="操作" width="width"></el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
          <el-button type="primary">保存</el-button>
          <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: "SkuForm",
  data() {
    return {
      //存储图片信息
      spuImageList:[],
      //销售属性
      spuSaleAttrList:[],
      // 平台属性
      attrInfoList:[],
      skuInfo: {
        //第一类收集的数据：父组件给的数据
        category3Id: 0,
        spuId: 0,
        tmId: 0,
        //第二类：需要通过数据双向绑定v-model收集
        skuName: "",
        price: 0,
        weight: "",
        skuDesc: "",
        //第三类：需要自己书写代码
        //默认图片
        skuDefaultImg: "",
        //收集图片的字段
        skuImageList: [
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   isDefault: "string",
          //   skuId: 0,
          //   spuImgId: 0,
          // },
        ],
        //平台属性
        skuAttrValueList: [
          // {
          //   attrId: 0,
          //   valueId: 0,
          // },
        ],
        //销售属性
        skuSaleAttrValueList: [
          // {
          //   id: 0,
          //   saleAttrId: 0,
          //   saleAttrName: "string",
          //   saleAttrValueId: 0,
          //   saleAttrValueName: "string",
          //   skuId: 0,
          //   spuId: 0,
          // },
        ],
      },
      //父组件传过来的spu,里面有很多spu的有用的信息
      spu:{}
    }
  },
  methods:{
    //获取skuForm的数据
    async getData(category1Id,category2Id,spu){
        //收集第一类要收集的数据：父组件给的数据
        this.skuInfo.category3Id=spu.category3Id;
        this.skuInfo.spuId=spu.id;
        this.skuInfo.tmId=spu.tmId;
        this.spu=spu;
        //获取图片的数据
        let result = await this.$API.sku.reqSpuImageList(spu.id);
        if(result.code===200){
          this.spuImageList=result.data;
        }
        //获取销售属性的数据
        let result1 = await this.$API.sku.reqSpuSaleAttrList(spu.id);
        if(result1.code===200){
          this.spuSaleAttrList=result1.data;
        }
        //获取平台属性接口
        let result2 = await this.$API.sku.reqAttrList(category1Id,category2Id,spu.category3Id);
        if(result2.code===200){
          this.attrInfoList=result2.data;
        }
    }
  }
};
</script>
<style>
</style>
