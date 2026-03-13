/**
 * CloudBase SDK 集成文件
 * 加载 CloudBase SDK 并初始化
 */

(function() {
  // CloudBase CDN 地址
  const SDK_URL = 'https://webcdn.cloudbase.net/sdk/1.7.1/cloudbase.js';

  // 检查是否已加载
  if (window.cloudbase) {
    console.log('CloudBase SDK 已加载');
    return;
  }

  // 动态加载 SDK
  const script = document.createElement('script');
  script.src = SDK_URL;
  script.async = true;
  script.onload = function() {
    console.log('CloudBase SDK 加载成功');
    initCloudBase();
  };
  script.onerror = function() {
    console.error('CloudBase SDK 加载失败');
  };

  document.head.appendChild(script);

  // 初始化 CloudBase
  function initCloudBase() {
    // 从配置文件获取环境 ID
    if (window.getApiConfig) {
      const config = window.getApiConfig();
      if (config && config.envId && !config.useMock) {
        try {
          window.tcb = cloudbase.init({
            env: config.envId
          });
          console.log('CloudBase 初始化成功，环境 ID:', config.envId);
        } catch (error) {
          console.error('CloudBase 初始化失败:', error);
        }
      }
    }
  }
})();
