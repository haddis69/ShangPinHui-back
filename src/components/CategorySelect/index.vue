<template lang="">
  <div>
    <el-form :inline="true" class="demo-form-inline" :model="cform">
      <el-form-item label="一级分类">
        <el-select placeholder="请选择" v-model="cform.category1Id"  @change="handler1" :disabled="show">
          <el-option :label="c1.name" :value="c1.id" v-for="(c1,index) in list1" :key="c1.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select placeholder="请选择" v-model="cform.category2Id"  @change="handler2" :disabled="show">
          <el-option :label="c2.name" :value="c2.id" v-for="(c2,index) in list2" :key="c2.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select placeholder="请选择" v-model="cform.category3Id"  @change="handler3" :disabled="show">
          <el-option :label="c3.name" :value="c3.id" v-for="(c3,index) in list3" :key="c3.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: "CategorySelect",
  data() {
    return {
      //一级分类
      list1: [],
      //二级分类
      list2: [],
      //三级分类
      list3:[],
      //收集相应的分类id
      cform: {
        category1Id: "",
        category2Id: "",
        category3Id: ""
      }
    }
  },
  props:['show'],
  //组件挂载完毕就要获取一级分类的数据
  mounted() {
    this.getCategory1List();
  },
  methods: {
    async getCategory1List() {
      let result = await this.$API.attr.reqCategory1List();
      if (result.code === 200) {
        this.list1 = result.data;
      }
    },
    //一级分类变化
    async handler1() {
      //清除数据
      this.list2=[];
      this.list3=[];
      this.cform.category2Id='';
      this.cform.category3Id='';
      const { category1Id } = this.cform;
       this.$emit('getCategoryId',{categoryId:category1Id,level:1});
      let result = await this.$API.attr.reqCategory2List(category1Id);
      if (result.code === 200) {
        this.list2 = result.data;
      }
    },
    async handler2() {
      //清除数据
      this.list3=[];
      this.cform.category3Id='';
      const { category2Id } = this.cform;
      this.$emit('getCategoryId',{categoryId:category2Id,level:2});
      let result = await this.$API.attr.reqCategory3List(category2Id);
      if (result.code === 200) {
        this.list3 = result.data;
      }
    },
    handler3(){
      const { category3Id } = this.cform;
      this.$emit('getCategoryId',{categoryId:category3Id,level:3});
    }
  }
};
</script>
<style lang=""></style>
