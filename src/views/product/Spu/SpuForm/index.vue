<template>
  <div>
    <!-- item都会继承el-form的宽度 -->
    <el-form ref="form" label-width="80px" :model="spu">
      <el-form-item label="SPU名称">
        <el-input placeholder="SPU名称" v-model="spu.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select placeholder="请选择品牌" v-model="spu.tmId">
          <el-option
            :label="tradeMark.tmName"
            :value="tradeMark.id"
            v-for="(tradeMark, index) in tradeMarkList"
            :key="tradeMark.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input placeholder="SPU描述" type="textarea" rows="4" v-model="spu.description"></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :file-list="spuImageList"
          :on-preview="handlePictureCardPreview"
          :on-success="handlerSuccess"
          :on-remove="handleRemove"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt />
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select :placeholder="`还有${unSelectedSaleAttr.length}未选择`" v-model="attrIdAndAttrName">
          <el-option
            :label="unSelected.name"
            :value="`${unSelected.id}:${unSelected.name}`"
            v-for="(unSelected,index) in unSelectedSaleAttr"
            :key="unSelected.id"
          ></el-option>
        </el-select>
        <el-button
          type="primary"
          icon="el-icon-plus"
          style="margin-left: 10px"
          :disabled="!attrIdAndAttrName"
          @click="addSaleAttr"
        >添加销售属性</el-button>
        <el-table style="width: 100%" border :data="spu.spuSaleAttrList">
          <el-table-column type="index" align="center" label="序号" width="80"></el-table-column>
          <el-table-column prop="saleAttrName" label="属性名" width="width"></el-table-column>
          <el-table-column prop="prop" label="属性值名称列表" width="width">
            <template slot-scope="{ row, $index }">
              <el-tag
                :key="tag.id"
                v-for="(tag,index) in row.spuSaleAttrValueList"
                closable
                :disable-transitions="false"
                @close="row.spuSaleAttrValueList.splice(index,1)"
              >{{ tag.saleAttrValueName }}</el-tag>
              <!-- @keyup.enter.native="handleInputConfirm"
              @blur="handleInputConfirm"-->
              <el-input
                class="input-new-tag"
                v-if="row.inputVisible"
                v-model="row.inputValue"
                ref="saveTagInput"
                size="small"
                @blur="handleInputConfirm(row)"
              ></el-input>
              <!-- @click="showInput" -->
              <el-button v-else class="button-new-tag" size="small" @click="addSaleAttrValue(row)">添加</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{row,$index}">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="spu.spuSaleAttrList.splice($index,1)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: "SpuForm",
  data() {
    return {
      //放大预览图片需要的地址
      dialogImageUrl: "",
      // 是否展示对话框
      dialogVisible: false,
      //存储spu信息属性，双向绑定，用户修改之后要拿着这个值继续给服务器发请求修改
      //但是添加spu的时候也要用spu收集数据给服务器，添加的时候并没有发请求给服务器，进来的时候spu本该是空对象
      //所以更好的方式是spu不是空对象，而有各种添加属性需要的字段，各字段初始值为空
      //这也不耽误修改的时候服务器返回的值覆盖这个spu，同样也可以v-model双向绑定
      spu: {
        //三级分类的id
        category3Id: 0,
        //描述
        description: "",
        //spu名称
        spuName: "",
        //品牌的id
        tmId: "",
        //收集SPU图片的信息
        spuImageList: [
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   spuId: 0,
          // },
        ],
        //平台属性与属性值收集
        spuSaleAttrList: [
          // {
          //   baseSaleAttrId: 0,
          //   id: 0,
          //   saleAttrName: "string",
          //   spuId: 0,
          //   spuSaleAttrValueList: [
          //     {
          //       baseSaleAttrId: 0,
          //       id: 0,
          //       isChecked: "string",
          //       saleAttrName: "string",
          //       saleAttrValueName: "string",
          //       spuId: 0,
          //     },
          //   ],
          // },
        ]
      },
      //存储品牌信息
      tradeMarkList: [],
      //存储图片信息
      spuImageList: [],
      //销售属性列表,项目全部的属性(3个)
      saleAttrList: [],
      //未选择的销售属性的id
      attrIdAndAttrName: ""
    };
  },
  methods: {
    //删除图片的回调，这里需要收集数据
    //注入了两个参数 file是删除的那张图片  fileList是照片墙剩余的图片
    handleRemove(file, fileList) {
      //收集照片墙图片的数据，上传图片的时候服务器不需要name和url两个字段，那是给本地element-ui加载图片用的
      this.spuImageList = fileList;
    },
    handlePictureCardPreview(file) {
      //图片地址给对话框
      this.dialogImageUrl = file.url;
      //展示对话框
      this.dialogVisible = true;
    },
    //初始化spuForm的数据,什么时候触发这个函数是父组件那边通过ref得到的
    //row是父组件传过来的点击的哪行
    async initSpuData(spu) {
      //获取spu信息的数据
      let spuResult = await this.$API.spu.reqSpu(spu.id);
      if (spuResult.code === 200) {
        this.spu = spuResult.data;
      }
      //获取品牌信息
      let tradeMarkResult = await this.$API.spu.reqTradeMarkList();
      if (tradeMarkResult.code === 200) {
        this.tradeMarkList = tradeMarkResult.data;
      }
      //获取spu图片数据
      let spuImageResult = await this.$API.spu.reqSpuImageList(spu.id);
      if (spuImageResult.code === 200) {
        let listArr = spuImageResult.data;
        //由于照片墙显示图片的数据需要数组，数组里面的元素需要有name与url字段
        //需要把服务器返回的数据进行修改
        listArr.forEach(item => {
          item.name = item.imgName;
          item.url = item.imgUrl;
        });
        //把整理好的数据赋值给
        this.spuImageList = listArr;
      }
      //获取平台全部销售属性
      let saleResult = await this.$API.spu.reqBaseSaleAttrList();
      if (saleResult.code === 200) {
        this.saleAttrList = saleResult.data;
      }
    },
    //照片墙上传图片成功的回调，这里也要收集信息
    //注入三个参数，由于action指定了上传图片的服务器的地址
    //response是服务器给我们返回的对象信息，file是上传的那张图，fileList是上传之后的图片列表
    handlerSuccess(response, file, fileList) {
      this.spuImageList = fileList;
    },
    //点击添加属性按钮，把添加的属性名和id放进spu中，而且本身下面表格的长度(:data)就是和spu绑定的
    addSaleAttr() {
      //split返回数组，数组按照顺序解构赋值
      const [baseSaleAttrId, saleAttrName] = this.attrIdAndAttrName.split(":");
      let newSale = {
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: []
      };
      this.spu.spuSaleAttrList.push(newSale);
      //点击按钮，收集数据时候把下拉菜单置空
      this.attrIdAndAttrName=''
    },
    //添加属性值的回调
    addSaleAttrValue(row){
      //添加响应式数据控制输入框和按钮的切换
      this.$set(row,'inputVisible',true);
      //添加响应式数据控制输入值的双向绑定,初始值是个空串
      this.$set(row,'inputValue','')
    },
    handleInputConfirm(row){
      const {baseSaleAttrId,inputValue}=row;
      //新增不能为空
      if(inputValue.trim()==''){
        this.$message('属性不能为空');
        return;
      }
      //新增不能重复,every返回的是一个布尔值
      let result = row.spuSaleAttrValueList.every(item=>{
        return item.saleAttrValueName!=inputValue;
      })
      if(result==false){
        this.$message('属性不能重复');
        return;
      }
      let newAttrValue = {
        baseSaleAttrId,
        saleAttrValueName:inputValue
      }
      row.spuSaleAttrValueList.push(newAttrValue);
      //已经是响应式数据了，上面设置过了
      row.inputVisible=false;
    },
    //保存按钮回调，可能是添加或者修改
    async addOrUpdateSpu(){
      //整理参数
      //整理照片墙的数据，图片需要携带imgName和imgUrl字段给服务器，但是添加的图片是没有这两个字段的
      this.spu.spuImageList = this.spuImageList.map(item=>{
        return {
          imgName:item.name,
          imgUrl:item.response?item.response.data:item.url
        }
      })
      let result = await this.$API.spu.reqAddOrUpdateSpu(this.spu);
      if(result.code===200){
        this.$message({
          type:'success',
          message:'保存成功'
        })
        this.$emit('changeScene',0);
      }
      //清空数据，避免再进来的时候回显
      Object.assign(this._data,this.$options.data());
    },
    //添加SPU
    async addSpuData(category3Id){
      // category3Id在修改的时候是服务器返回给我们的，但是添加的时候应该收集一下
      this.spu.category3Id=category3Id;
      //获取品牌信息
      let tradeMarkResult = await this.$API.spu.reqTradeMarkList();
      if (tradeMarkResult.code === 200) {
        this.tradeMarkList = tradeMarkResult.data;
      }
      //获取平台全部销售属性
      let saleResult = await this.$API.spu.reqBaseSaleAttrList();
      if (saleResult.code === 200) {
        this.saleAttrList = saleResult.data;
      }
    },
    //取消按钮
    cancel(){
      this.$emit('changeScene', 0);
      //清空数据，避免再进来的时候回显
      //this._data是当前的响应式数据，this.$options是当前的配置对象，自然有data属性
      //而上方配置对象里的data都是初始值(空值)，后者覆盖前者
      //这种方法比把想清空的数据挨个清空方便得多
      Object.assign(this._data,this.$options.data());
    }
  },
  computed: {
    //还未选择的销售属性
    unSelectedSaleAttr() {
      //整个平台的属性 一共三个 在saleAttrList里
      //当前商品的属性 在spu.spuSaleAttrList里
      return this.saleAttrList.filter(item => {
        return this.spu.spuSaleAttrList.every(item1 => {
          return item1.saleAttrName !== item.name;
        });
      });
    }
  }
};
</script>
<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
