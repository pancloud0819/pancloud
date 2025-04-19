// 部署环境检查工具
console.log('=== 环境检测 ===');
console.log('当前路径:', window.location.pathname);
console.log('BASE_PATH:', BASE_PATH); 
console.log('图片测试:', `${BASE_PATH}images/product1.jpg`);

if (window.location.protocol === 'file:') {
  console.warn('⚠️ 请通过GitHub Pages访问，本地file协议可能无法正常工作');
}