//平台属性管理模块请求文件
import request from '../../utils/request'

//获取图片的数据
//admin/product/spuImageList/{spuId}  get
export const reqSpuImageList = (spuId) => request({ url: `/admin/product/spuImageList/${spuId}`, method: 'get' }); 

//获取销售属性的数据
//admin/product/spuSaleAttrList/{spuId}  get
export const reqSpuSaleAttrList = (spuId) =>request({url:`/admin/product/spuSaleAttrList/${spuId}`,method:'get'});

//获取平台属性接口
//admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}  get
export const reqAttrList = (category1Id,category2Id,category3Id)=>request({url:`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,method:'get'});

//sku列表的接口
//admin/product/list/{page}/{limit}
export const reqSkuList = (page,limit)=>request({url:`/admin/product/list/${page}/${limit}`,method:'get'});

//上架
//admin/product/onSale/{skuId} get
export const reqSale = (skuId)=>request({url:`/admin/product/onSale/${skuId}`,method:'get'});

//下架
//admin/product/cancelSale/{skuId} get
export const reqCancel = (skuId)=>request({url:`/admin/product/cancelSale/${skuId}`,method:'get'});

//获取SKU详情的接口
///admin/product/getSkuById/{skuId}  get
export const reqSkuById = (skuId)=>request({url:`/admin/product/getSkuById/${skuId}`,method:'get'});