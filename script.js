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

// 滤镜预设值
const filterPresets = {
    normal: { brightness: 100, saturation: 100, hueRotate: 0 },
    warm: { brightness: 110, saturation: 120, hueRotate: 15 },
    cool: { brightness: 100, saturation: 90, hueRotate: 180 },
    vintage: { brightness: 90, saturation: 80, hueRotate: 30 },
    dramatic: { brightness: 120, saturation: 150, hueRotate: 0 }
};

// 初始化摄像头
async function initCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                width: { ideal: 1280 },
                height: { ideal: 720 },
                facingMode: 'user'
            },
            audio: false
        });
        
        video.srcObject = stream;
        
        // 设置canvas尺寸
        video.addEventListener('loadedmetadata', () => {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
        });
        
        // 应用初始滤镜
        applyFilters();
        
    } catch (err) {
        console.error('摄像头访问失败:', err);
        alert('无法访问摄像头，请确保已授予摄像头权限并刷新页面。');
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
    
    // 应用CSS滤镜
    video.style.filter = `brightness(${brightness}%) saturate(${saturation}%) hue-rotate(${hueRotate}deg)`;
}

// 更新背景颜色
function updateBackgroundColor() {
    videoContainer.style.backgroundColor = backgroundColorPicker.value;
}

// 应用预设滤镜
function applyPreset(preset) {
    const settings = filterPresets[preset];
    
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
    initCamera();
    setupEventListeners();
    updateBackgroundColor();
    
    // 默认选中正常预设
    document.querySelector('[data-preset="normal"]').classList.add('active');
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init);