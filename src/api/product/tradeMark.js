import request from '../../utils/request'
//获取品牌信息
export const reqTradeMarkList= (page,limit) =>{
    return request({url:`/admin/product/baseTrademark/${page}/${limit}`,method:'get'})
}
//处理添加品牌
//新增品牌: /admin/product/baseTrademark/save   post  携带两个参数：品牌名称、品牌logo,id由服务器生成
//修改品牌 /admin/product/baseTrademark/update   put   携带三个参数：id、品牌名称、品牌logo
//有id所以是修改
export const reqAddOrUpdateTradeMark=(trademark)=>{
    if(trademark.id){
        return request({url:'/admin/product/baseTrademark/update',method:'put',data:trademark})
    }else{
        return request({url:'/admin/product/baseTrademark/save',method:'post',data:trademark})
    }
}
//删除品牌
///admin/product/baseTrademark/remove/{id}  delete
export const reqDeleteTradeMark = (id)=>request({url:`/admin/product/baseTrademark/remove/${id}`,method:'delete'});