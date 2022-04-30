<template>
  <div>
    <el-card style="margin: 20px 0px">
      <CategorySelect @getCategoryId="getCategoryId"></CategorySelect>
    </el-card>
    <el-card>
      <div v-show="isShowTable">
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3Id"
          @click="addAttr"
          >添加属性</el-button
        >
        <el-table style="width: 100%" border :data="attrList">
          <el-table-column
            type="index"
            align="center"
            label="序号"
            width="80"
          ></el-table-column>
          <el-table-column
            prop="attrName"
            label="属性名称"
            width="150"
          ></el-table-column>
          <el-table-column prop="prop" label="属性值列表" width="width">
            <template slot-scope="{ row, $index }">
              <el-tag
                type="success"
                v-for="(attrValue, index) in row.attrValueList"
                :key="attrValue.id"
                style="margin: 0 20px"
                >{{ attrValue.valueName }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="150">
            <template slot-scope="{ row, $index }">
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                @click="updateAttr(row)"
              ></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 添加或修改属性 -->
      <div v-show="!isShowTable">
        <el-form :inline="true" ref="form" label-width="80px" :model="attrInfo">
          <el-form-item label="属性名">
            <el-input placeholder="请输入属性名" v-model="attrInfo.attrName"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" icon="el-icon-plus" @click="addAttrValue" :disabled="!attrInfo.attrName">添加属性值</el-button>
        <el-button @click="isShowTable = true">取消</el-button>
        <el-table style="width: 100%; margin: 20px 0" border :data="attrInfo.attrValueList">
          <el-table-column
            type="index"
            align="center"
            label="序号"
            width="80"
          ></el-table-column>
          <el-table-column
            prop="prop"
            label="属性值名称"
            width="width"
          >
            <template slot-scope="{row,$index}">
              <el-input placeholder="请输入属性值名称" v-model="row.valueName" size="mini"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="prop"
            label="操作"
            width="width"
          >
          <template slot-scope="{row,$index}">
            <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
          </template>
          </el-table-column>
        </el-table>
        <el-button type="primary">保存</el-button>
        <el-button @click="isShowTable = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>
<script>
import cloneDeep from 'lodash/cloneDeep'
export default {
  name: "Attr",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      //接收平台属性的字段
      attrList: [],
      isShowTable:true,
      //收集新增属性或者修改属性使用的
      attrInfo:{
        attrName: "",   //属性名
        attrValueList: [],
        categoryId: 0,   //三级分类id
        categoryLevel:3   //分类等级
      }
    };
  },
  methods: {
    getCategoryId({ categoryId, level }) {
      if (level === 1) {
        this.category1Id = categoryId;
        this.category2Id = "";
        this.category3Id = "";
      } else if (level === 2) {
        this.category2Id = categoryId;
        this.category3Id = "";
      } else {
        this.category3Id = categoryId;
        this.getAttrList();
      }
    },
    async getAttrList() {
      const { category1Id, category2Id, category3Id } = this;
      let result = await this.$API.attr.reqAttrList(
        category1Id,
        category2Id,
        category3Id
      );
      if (result.code === 200) {
        this.attrList = result.data;
      }
    },
    //添加属性值
    addAttrValue(){
      //向属性值的数组里面添加元素
      //attrId：是你相应的属性的id，目前而言我们是添加属性的操作，还没有相应的属性的id，目前而言带给服务器的id为undefined
      //valueName:相应的属性值的名称
      //el-table是以列为单位，列的长度是数据的个数(长度)，push一个，表格就长度+1
      //这个过程是用作用于插槽配合row实现的
      this.attrInfo.attrValueList.push({
            attrId: undefined,
            valueName: ''
      })
    },
    //点击添加属性的按钮，把残存的输入框内容置空
    addAttr(){
      this.isShowTable=false;
      this.attrInfo={
        attrName: "",   //属性名
        attrValueList: [],
        categoryId: this.category3Id,   //三级分类id
        // 对象属性是无序的但是这里已经有category3Id了，可以收集categoryId这个字段了，后台服务器需要这个字段
        categoryLevel:3   //分类等级
      }
    },
    //修改属性的回调
    updateAttr(row){
      this.isShowTable=false;
      //将选中的这一行的属性值赋给attrInfo，本来attrInfo就是收集要修改或者添加属性的数据的字段
      //由于修改属性的表格和attrInfo是双向绑定的，这里赋值，跳转之后表格里就自动有了数据
      //但这里有个问题，row是一个对象类型的数据，代表这一行，attrInfo也是个对象，对象赋值就是指向同一块内存
      //由于属性表格和attrList也是双向绑定的，即使点击取消，row和attrInfo指向的还是同一块内存，值看起来也修改了
      //不能用浅拷贝，对象里面都数组，数组里面还有对象，要深拷贝
      this.attrInfo=cloneDeep(row);
    }
  },
};
</script>
<style scoped></style>
