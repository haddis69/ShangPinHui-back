<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="12">
        <Search />
      </el-col>
      <el-col :span="12">
        <Cate />
      </el-col>
    </el-row>
  </div>
</template>
<script>
import Search from "./Search";
import Cate from "./Cate";
export default {
  name: "Observe",
  components: {
    Search,
    Cate,
  },
};
</script>
<style scoped>
</style>
