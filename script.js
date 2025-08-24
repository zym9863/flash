// 获取DOM元素
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const videoContainer = document.querySelector('.video-container');
const brightnessSlider = document.getElementById('brightness');
const saturationSlider = document.getElementById('saturation');
const hueRotateSlider = document.getElementById('hue-rotate');
const brightnessValue = document.getElementById('brightness-value');
const saturationValue = document.getElementById('saturation-value');
const hueRotateValue = document.getElementById('hue-rotate-value');
const presetButtons = document.querySelectorAll('.preset');

// 新增加载和通知相关元素
const loadingOverlay = document.getElementById('loading-overlay');
const loadingMessage = document.getElementById('loading-message');
const notification = document.getElementById('notification');

// 滤镜预设值
const filterPresets = {
    normal: { brightness: 100, saturation: 100, hueRotate: 0 },
    warm: { brightness: 110, saturation: 120, hueRotate: 15 },
    cool: { brightness: 100, saturation: 90, hueRotate: 180 },
    vintage: { brightness: 90, saturation: 80, hueRotate: 30 },
    dramatic: { brightness: 120, saturation: 150, hueRotate: 0 }
};

// 显示通知
function showNotification(message, type = 'info', duration = 3000) {
    const iconMap = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };

    const notificationIcon = notification.querySelector('.notification-icon');
    const notificationMessage = notification.querySelector('.notification-message');

    notificationIcon.className = `notification-icon ${iconMap[type]}`;
    notificationMessage.textContent = message;
    
    notification.className = `notification ${type} show`;

    setTimeout(() => {
        notification.classList.remove('show');
    }, duration);
}

// 隐藏加载状态
function hideLoadingOverlay() {
    loadingOverlay.classList.add('hidden');
    setTimeout(() => {
        loadingOverlay.style.display = 'none';
    }, 500);
}

// 更新加载消息
function updateLoadingMessage(message) {
    loadingMessage.textContent = message;
}

// 初始化摄像头
async function initCamera() {
    try {
        updateLoadingMessage('正在连接摄像头...');
        
        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                width: { ideal: 1280 },
                height: { ideal: 720 },
                facingMode: 'user'
            },
            audio: false
        });
        
        updateLoadingMessage('摄像头连接成功，正在加载...');
        
        video.srcObject = stream;
        
        // 设置canvas尺寸
        video.addEventListener('loadedmetadata', () => {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            
            // 延迟隐藏加载界面，让用户感受到完整的加载过程
            setTimeout(() => {
                hideLoadingOverlay();
                showNotification('美颜补光灯已就绪！✨', 'success');
            }, 1000);
        });
        
        // 应用初始滤镜
        setTimeout(() => {
            applyFilters();
        }, 500);
        
    } catch (err) {
        console.error('摄像头访问失败:', err);
        updateLoadingMessage('无法访问摄像头');
        
        setTimeout(() => {
            hideLoadingOverlay();
            let errorMessage = '无法访问摄像头，请检查权限设置';
            
            if (err.name === 'NotAllowedError') {
                errorMessage = '摄像头权限被拒绝，请允许访问后刷新页面';
            } else if (err.name === 'NotFoundError') {
                errorMessage = '未找到摄像头设备，请连接摄像头后重试';
            } else if (err.name === 'NotReadableError') {
                errorMessage = '摄像头被其他应用占用，请关闭后重试';
            }
            
            showNotification(errorMessage, 'error', 5000);
        }, 1000);
    }
}

// 应用滤镜效果
function applyFilters() {
    const brightness = brightnessSlider.value;
    const saturation = saturationSlider.value;
    const hueRotate = hueRotateSlider.value;
    
    // 更新显示值
    brightnessValue.textContent = `${brightness}%`;
    saturationValue.textContent = `${saturation}%`;
    hueRotateValue.textContent = `${hueRotate}°`;
    
    // 应用CSS滤镜，增加过渡动画
    video.style.filter = `brightness(${brightness}%) saturate(${saturation}%) hue-rotate(${hueRotate}deg)`;
}

// 更新背景颜色
function updateBackgroundColor() {
    // 这个函数在原始代码中引用了不存在的元素，暂时保留但不执行任何操作
    // videoContainer.style.backgroundColor = backgroundColorPicker.value;
}

// 应用预设滤镜
function applyPreset(preset) {
    const settings = filterPresets[preset];
    
    if (!settings) {
        showNotification('未找到该滤镜预设', 'warning');
        return;
    }
    
    // 更新滑块值
    brightnessSlider.value = settings.brightness;
    saturationSlider.value = settings.saturation;
    hueRotateSlider.value = settings.hueRotate;
    
    // 应用滤镜
    applyFilters();
    
    // 更新活动按钮样式
    presetButtons.forEach(button => {
        if (button.dataset.preset === preset) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
    
    // 显示成功通知
    const presetNames = {
        normal: '正常模式',
        warm: '暖色模式',
        cool: '冷色模式',
        vintage: '复古模式',
        dramatic: '戏剧模式'
    };
    
    showNotification(`已应用${presetNames[preset] || preset}滤镜`, 'success');
}

// 事件监听器
function setupEventListeners() {
    // 滤镜滑块事件
    brightnessSlider.addEventListener('input', applyFilters);
    saturationSlider.addEventListener('input', applyFilters);
    hueRotateSlider.addEventListener('input', applyFilters);
    
    // 预设按钮事件
    presetButtons.forEach(button => {
        button.addEventListener('click', () => {
            applyPreset(button.dataset.preset);
        });
    });
}

// 初始化应用
function init() {
    // 显示欢迎消息
    showNotification('欢迎使用美颜补光灯！🎉', 'info', 2000);
    
    // 延迟初始化摄像头，让用户看到加载过程
    setTimeout(() => {
        initCamera();
        setupEventListeners();
        updateBackgroundColor();
        
        // 默认选中正常预设
        const normalPreset = document.querySelector('[data-preset="normal"]');
        if (normalPreset) {
            normalPreset.classList.add('active');
        }
    }, 800);
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init);