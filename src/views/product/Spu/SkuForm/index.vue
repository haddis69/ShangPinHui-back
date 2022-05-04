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
        <el-table style="width: 100%" border :data="spuImageList" @selection-change="handleSelectChange">
          <el-table-column prop="prop" type="selection" width="80"></el-table-column>
          <el-table-column prop="prop" label="图片" width="width">
            <template slot-scope="{row}">
              <img :src="row.imgUrl" style="width:100px;height:100px;"/>
            </template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称" width="width"></el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{row}">
              <el-button type="primary" v-if="row.isDefault==0" @click="changeDefault(row)">设置默认</el-button>
              <el-button v-else>默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
          <el-button type="primary" @click="save">保存</el-button>
          <el-button @click="cancel">取消</el-button>
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
        spuImageList: [
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
      spu:{},
      //收集选中图片信息的字段,目前缺少isDefault字段
      imgList:[]
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
          let list = result.data;
          list.forEach((item)=>{
            item.isDefault=0;
          })
          this.spuImageList=list;
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
    },
    //表格复选框按钮事件
    handleSelectChange(params){
      //注入的params可以获取到选中的row(这里是spuImageList中选中的每一项)
      //如果同时选中多个就会生成数组，但是由于spuImageList每一项是没有是否默认这个属性的，但是服务器需要isDefault
      this.imgList=params;
    },
    //切换是否默认,设置默认图片信息，收集这个信息字段
    changeDefault(row){
      this.spuImageList.forEach((item)=>{
        item.isDefault=0;
      })
      row.isDefault=1;
      //收集skuInfo.skuDefaultImg字段
      this.skuInfo.skuDefaultImg = row.imgUrl;
    },
    //点击取消跳回首页
    cancel(){
      this.$emit('changeScene',0);
      Object.assign(this._data,this.$options.data());
    },
    //发请求，保存数据
    async save(){
      //整理参数
      const {attrInfoList,skuInfo,spuSaleAttrList,imgList}=this;
      let arr=[];
      attrInfoList.forEach((item)=>{
        //如果这个属性被选择了，item(v-for的attr属性)就会有attrIdAndValueId这个字段
        if(item.attrIdAndValueId){
          const [attrId,valueId] = item.attrIdAndValueId.split(':');
          let obj={
            attrId,
            valueId
          }
          arr.push(obj);
        }
      })
      //将整理好的数据赋值skuInfo的skuAttrValueList字段
      skuInfo.skuAttrValueList=arr;
      //同理 整理销售属性,这次用reduce方法
      skuInfo.skuSaleAttrValueList = spuSaleAttrList.reduce((prev,item)=>{
        if(item.attrIdAndValueId){
          const [saleAttrId,saleAttrValueId] =item.attrIdAndValueId.split(':');
          prev.push({
            saleAttrId,
            saleAttrValueId
          });
          return prev;
        }
      },[])
      //整理图片 把之前收集好的imgList字段扔到skuInfo的spuImageList里
      skuInfo.spuImageList = imgList.map(item=>{
        return {
          imgName:item.imgName,
          imgUrl:item.imgUrl,
          isDefault:item.isDefault,
          //spuImgId是服务器要的字段，这里收集item.id或者item.spuId都可以
          spuImgId:item.id
        }
      })
      //发请求
      let result = await this.$API.spu.reqAddSku(skuInfo);
      if(result.code===200){
        this.$message({
          type:'success',
          message:'添加SKU成功'
        })
        this.$emit('changeScene',0);
      }
    }
  }
};
</script>
<style>
</style>
