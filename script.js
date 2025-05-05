let isCalculating = false;
let isPaused = false;
let startTime;
let earnings = 0;
let hourlyRate = 0;
let animationFrameId;
let moneyRainInterval;

// 更新用户名
function updateName() {
  const nameInput = document.getElementById('name-input');
  const username = document.getElementById('username');
  const resultUsername = document.getElementById('result-username');
  if (nameInput.value.trim() !== '') {
    const newName = nameInput.value;
    username.textContent = newName;
    resultUsername.textContent = newName;
    nameInput.value = '';
  }
}

// 显示不同的部分
function showSection(section) {
  document.getElementById('welcome-screen').classList.add('hidden');
  document.getElementById('monthly-section').classList.add('hidden');
  document.getElementById('hourly-section').classList.add('hidden');
  document.getElementById('result-section').classList.add('hidden');

  if (section === 'monthly' || section === 'hourly') {
    document.getElementById(`${section}-section`).classList.remove('hidden');
  }
}

// 返回主页面
function goBack() {
  resetCalculation();
  showSection('welcome');
  document.getElementById('welcome-screen').classList.remove('hidden');
}

// 开始计算
function startCalculation(type) {
  let valid = false;
  if (type === 'monthly') {
    const monthlySalary = parseFloat(document.getElementById('monthly-salary').value);
    const workingDays = parseFloat(document.getElementById('working-days').value);
    const workingHours = parseFloat(document.getElementById('working-hours').value);

    if (monthlySalary && workingDays && workingHours) {
      // 计算时薪
      hourlyRate = monthlySalary / (workingDays * workingHours);
      valid = true;
    }
  } else {
    hourlyRate = parseFloat(document.getElementById('hourly-rate').value);
    valid = !!hourlyRate;
  }

  if (valid) {
    document.getElementById(`${type}-section`).classList.add('hidden');
    document.getElementById('result-section').classList.remove('hidden');
    startTimer();
    startMoneyRain();
  } else {
    alert('请填写所有必要信息！');
  }
}

// 计时器和收入计算
function startTimer() {
  isCalculating = true;
  isPaused = false;
  startTime = new Date().getTime();
  updateDisplay();
}

function updateDisplay() {
  if (!isCalculating || isPaused) return;

  const currentTime = new Date().getTime();
  const elapsedTime = (currentTime - startTime) / 1000; // 转换为秒

  // 更新工作时间显示
  const hours = Math.floor(elapsedTime / 3600);
  const minutes = Math.floor((elapsedTime % 3600) / 60);
  const seconds = Math.floor(elapsedTime % 60);
  document.getElementById('time-counter').textContent =
    `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // 计算并更新收入
  earnings = (hourlyRate / 3600) * elapsedTime;

  // 更新收入计数器（使用数字滚动效果）
  const earningsCounter = document.getElementById('earnings-counter');
  earningsCounter.textContent = earnings.toFixed(2);

  // 更新收入速率
  document.getElementById('hourly-earning').textContent = hourlyRate.toFixed(2);
  document.getElementById('minute-earning').textContent = (hourlyRate / 60).toFixed(2);
  document.getElementById('second-earning').textContent = (hourlyRate / 3600).toFixed(2);

  animationFrameId = requestAnimationFrame(updateDisplay);
}

// 暂停/继续计算
function togglePause() {
  isPaused = !isPaused;
  const pauseBtn = document.getElementById('pause-btn');
  pauseBtn.textContent = isPaused ? '继续' : '暂停';

  if (!isPaused) {
    startTime = new Date().getTime() - (earnings * 3600 / hourlyRate * 1000);
    updateDisplay();
  }
}

// 重置计算
function resetCalculation() {
  isCalculating = false;
  isPaused = false;
  earnings = 0;

  // 重置所有输入框
  document.getElementById('monthly-salary').value = '';
  document.getElementById('working-days').value = '';
  document.getElementById('working-hours').value = '';
  document.getElementById('hourly-rate').value = '';

  // 重置显示数据
  document.getElementById('earnings-counter').textContent = '0.00';
  document.getElementById('time-counter').textContent = '00:00:00';
  document.getElementById('pause-btn').textContent = '暂停';

  // 清除动画和定时器
  cancelAnimationFrame(animationFrameId);
  clearInterval(moneyRainInterval);
  removeAllMoneySymbols();

  // 隐藏结果页面，显示欢迎页面
  document.getElementById('result-section').classList.add('hidden');
  document.getElementById('monthly-section').classList.add('hidden');
  document.getElementById('hourly-section').classList.add('hidden');
  document.getElementById('welcome-screen').classList.remove('hidden');
}

// 金钱符号动画
function startMoneyRain() {
  const symbols = ['¥', '$', '€', '£'];
  const container = document.getElementById('money-rain');

  moneyRainInterval = setInterval(() => {
    if (!isPaused) {
      const symbol = document.createElement('div');
      symbol.className = 'money-symbol';
      symbol.textContent = symbols[Math.floor(Math.random() * symbols.length)];

      // 随机位置和动画持续时间
      const left = Math.random() * 100;
      const animationDuration = 3 + Math.random() * 2;

      symbol.style.left = `${left}%`;
      symbol.style.animationDuration = `${animationDuration}s`;

      container.appendChild(symbol);

      // 动画结束后移除元素
      setTimeout(() => {
        symbol.remove();
      }, animationDuration * 1000);
    }
  }, 300);
}

function removeAllMoneySymbols() {
  const container = document.getElementById('money-rain');
  container.innerHTML = '';
}

// 键盘事件监听
document.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    const nameInput = document.getElementById('name-input');
    if (document.activeElement === nameInput) {
      updateName();
    }
  }
}); 