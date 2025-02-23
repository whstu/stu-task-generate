let names = [];
let actions = [];
let subjects = [];

// 从txt文件加载人名
async function loadNames() {
  NProgress.start();
  try {
    const response = await fetch('data/namelist.txt');
    const text = await response.text();
    names = text.split('\n')
      .map(name => name.trim())
      .filter(name => name.length > 0);
    generateCheckboxes();
  } catch (error) {
    console.error('加载人名列表失败:', error);
    alert('加载人名列表失败');
  } finally {
    NProgress.done();
  }
}

// 加载操作选项
async function loadActions() {
  NProgress.inc();
  try {
    const response = await fetch('data/actions.txt');
    const text = await response.text();
    actions = text.split('\n')
      .map(action => action.trim())
      .filter(action => action.length > 0);
    generateRadios();
  } catch (error) {
    console.error('加载操作列表失败:', error);
    alert('加载操作列表失败');
  } finally {
    NProgress.inc();
  }
}

// 加载科目选项
async function loadSubjects() {
  NProgress.inc();
  try {
    const response = await fetch('data/subjects.txt');
    const text = await response.text();
    subjects = text.split('\n')
      .map(subject => subject.trim())
      .filter(subject => subject.length > 0);
    generateSubjects();
  } catch (error) {
    console.error('加载科目列表失败:', error);
    alert('加载科目列表失败');
  } finally {
    NProgress.inc();
  }
}

// 打乱数组顺序
function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

// 更新选中计数的函数
function updateSelectedCount() {
  const count = document.querySelectorAll('.checkbox-custom:checked').length;
  document.getElementById('selectedCount').innerText = `已选择 ${count} 人`;
}

// 修改生成选择框函数
function generateCheckboxes() {
  const container = document.getElementById('checkboxArea');
  // 添加标题区域
  const header = document.createElement('div');
  header.className = 'flex items-center justify-between mb-4';
  header.innerHTML = `
    <div class="flex items-center space-x-4">
      <div class="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center text-lg font-medium">
        1
      </div>
      <div>
        <h3 class="text-lg font-medium text-gray-700 mb-1">选择人员</h3>
        <div id="selectedCount" class="text-sm text-gray-500">已选择 0 人</div>
      </div>
    </div>
    <div class="flex items-center space-x-3">
      <div class="flex items-center space-x-2">
        <input type="number" id="randomCount" min="1" max="44" class="w-16 px-2 py-1 border border-gray-200 rounded-lg text-sm" placeholder="数量">
        <button onclick="selectRandom()" class="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors">
          随机选择
        </button>
      </div>
      <button onclick="handleCardClear()" class="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors">
        清除全部
      </button>
    </div>
  `;
  container.appendChild(header);

  // 添加名单容器
  const nameGrid = document.createElement('div');
  nameGrid.className = 'checkbox-grid';

  // 按拼音排序
  const sortedNames = [...names].sort((a, b) => a.localeCompare(b, 'zh-Hans-CN'));
  
  sortedNames.forEach((name, index) => {
    const div = document.createElement('div');
    div.className = 'name-block';
    div.style.setProperty('--animation-order', index); // 添加动画延迟顺序
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = 'person_' + index;
    checkbox.value = name;
    checkbox.className = 'checkbox-custom absolute opacity-0';

    const label = document.createElement('label');
    label.htmlFor = checkbox.id;
    
    const textSpan = document.createElement('span');
    textSpan.className = 'text-gray-700 text-sm truncate';
    textSpan.innerText = name;

    const checkIcon = document.createElement('i');
    checkIcon.className = 'fas fa-check check-icon';

    label.appendChild(textSpan);
    label.appendChild(checkIcon);
    div.appendChild(checkbox);
    div.appendChild(label);
    nameGrid.appendChild(div);

    checkbox.addEventListener('change', updateSelectedCount);
  });

  container.appendChild(nameGrid);

  // 使用GSAP为名单项添加动画
  gsap.from('.name-block', {
    y: 20,
    opacity: 0,
    duration: 0.5,
    stagger: {
      each: 0.02,
      grid: 'auto',
      from: 'start'
    }
  });
}

// 生成单选框函数
function generateRadios() {
  const container = document.getElementById('radioArea');
  const radioContainer = document.createElement('div');
  radioContainer.className = 'space-y-2';
  
  actions.forEach((action, index) => {
    const div = document.createElement('div');
    div.className = 'relative';

    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = 'action';
    radio.id = 'action_' + index;
    radio.value = action;
    radio.className = 'radio-custom absolute opacity-0';

    const label = document.createElement('label');
    label.htmlFor = radio.id;
    label.className = 'block p-2 border border-gray-200 rounded-lg cursor-pointer transition-all hover:border-gray-300 text-sm';
    label.innerText = action;

    div.appendChild(radio);
    div.appendChild(label);
    radioContainer.appendChild(div);
  });
  
  container.appendChild(radioContainer);
  
  // 添加自定义输入区域
  const customDiv = document.createElement('div');
  customDiv.className = 'mt-4 space-y-2';
  customDiv.innerHTML = `
    <div class="text-sm text-gray-500 mb-2">自定义操作</div>
    <div class="relative">
      <input type="text" id="customAction" 
        class="w-full p-2 border border-gray-200 rounded-lg text-sm"
        placeholder="输入自定义操作">
      <button onclick="addCustomAction()" 
        class="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-500 hover:text-black">
        添加
      </button>
    </div>
  `;
  container.appendChild(customDiv);

  // 为单选框添加动画
  gsap.from(radioContainer.children, {
    y: 15,
    opacity: 0,
    duration: 0.4,
    stagger: 0.05
  });
}

// 添加自定义操作
function addCustomAction() {
  const input = document.getElementById('customAction');
  const customAction = input.value.trim();
  if (!customAction) return;

  const container = document.getElementById('radioArea');
  const radioDiv = document.createElement('div');
  radioDiv.className = 'relative';
  radioDiv.innerHTML = `
    <input type="radio" name="action" class="radio-custom absolute opacity-0" 
      id="action_custom_${Date.now()}" value="${customAction}">
    <label class="block p-2 border border-gray-200 rounded-lg cursor-pointer transition-all hover:border-gray-300 text-sm"
      for="action_custom_${Date.now()}">
      ${customAction}
    </label>
  `;
  
  container.querySelector('.space-y-2').appendChild(radioDiv);
  input.value = '';

  const newRadio = container.querySelector('.space-y-2').lastElementChild;
  gsap.from(newRadio, {
    height: 0,
    opacity: 0,
    duration: 0.3,
    ease: 'power2.out'
  });
}

// 存储选择状态
function saveSelections() {
  const selections = {
    names: Array.from(document.querySelectorAll('.checkbox-custom:checked')).map(cb => cb.value),
    action: document.querySelector('input[name="action"]:checked')?.value,
    subject: document.querySelector('input[name="subject"]:checked')?.value
  };
  sessionStorage.setItem('lastSelections', JSON.stringify(selections));
}

// 恢复选择状态
function restoreSelections() {
  const saved = sessionStorage.getItem('lastSelections');
  if (!saved) return;
  
  const selections = JSON.parse(saved);
  
  // 恢复选中的名字
  selections.names.forEach(name => {
    const checkbox = Array.from(document.querySelectorAll('.checkbox-custom'))
      .find(cb => cb.value === name);
    if (checkbox) {
      checkbox.checked = true;
    }
  });
  
  // 恢复操作和科目选择
  if (selections.action) {
    const actionRadio = Array.from(document.getElementsByName('action'))
      .find(radio => radio.value === selections.action);
    if (actionRadio) actionRadio.checked = true;
  }
  
  if (selections.subject) {
    const subjectRadio = Array.from(document.getElementsByName('subject'))
      .find(radio => radio.value === selections.subject);
    if (subjectRadio) subjectRadio.checked = true;
  }
  
  updateSelectedCount();
}

// 生成科目选择框
function generateSubjects() {
  const container = document.getElementById('subjectArea');
  const subjectContainer = document.createElement('div');
  subjectContainer.className = 'space-y-2';
  
  subjects.forEach((subject, index) => {
    const div = document.createElement('div');
    div.className = 'relative';

    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = 'subject';
    radio.id = 'subject_' + index;
    radio.value = subject;
    radio.className = 'radio-custom absolute opacity-0';

    const label = document.createElement('label');
    label.htmlFor = radio.id;
    label.className = 'block p-2 border border-gray-200 rounded-lg cursor-pointer transition-all hover:border-gray-300 text-sm';
    label.innerText = subject;

    div.appendChild(radio);
    div.appendChild(label);
    subjectContainer.appendChild(div);
  });
  
  container.appendChild(subjectContainer);
}

// 修改页面加载事件，添加卡片动画
document.addEventListener('DOMContentLoaded', async function() {
  NProgress.configure({ showSpinner: false });
  NProgress.start();
  
  try {
    await Promise.all([loadNames(), loadActions(), loadSubjects()]);
    restoreSelections();
    
    // 找到所有卡片容器
    const cards = document.querySelectorAll('#checkboxArea, #radioArea, #subjectArea, #generateButton').parentNode;
    
    // 设置初始状态
    gsap.set(cards, {
      scale: 0,
      opacity: 0,
      transformOrigin: 'top left'
    });
    
    // 添加展开动画
    gsap.to(cards, {
      scale: 1,
      opacity: 1,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power2.out',
      clearProps: 'all'
    });
  } finally {
    NProgress.done();
  }
});

// 生成按钮点击事件处理
document.getElementById('generateButton').addEventListener('click', async function() {
  NProgress.start();
  try {
    // 获取选中的人名
    const selectedNames = [];
    names.forEach((name, index) => {
      const checkbox = document.getElementById('person_' + index);
      if (checkbox && checkbox.checked) {
        selectedNames.push(name);
      }
    });

    // 获取选中的操作
    let selectedAction = null;
    const radios = document.getElementsByName('action');
    radios.forEach(function(radio) {
      if (radio.checked) {
        selectedAction = radio.value;
      }
    });

    // 获取选中的科目
    let selectedSubject = null;
    const subjectRadios = document.getElementsByName('subject');
    subjectRadios.forEach(function(radio) {
      if (radio.checked) {
        selectedSubject = radio.value;
      }
    });

    if (selectedNames.length === 0 || !selectedAction || !selectedSubject) {
      alert('请选择至少一个人名、一个操作和一个科目');
      return;
    }

    showResultModal(selectedNames, selectedAction, selectedSubject);
  } finally {
    NProgress.done();
  }
});

// 修改显示结果模态框函数
function showResultModal(selectedNames, selectedAction, selectedSubject) {
  saveSelections();
  
  document.body.innerHTML = '';
  
  const resultPage = document.createElement('div');
  resultPage.className = 'min-h-screen bg-white p-6';
  resultPage.style.opacity = 0;
  
  const container = document.createElement('div');
  container.className = 'max-w-7xl mx-auto space-y-8';

  // 标题栏
  const header = document.createElement('div');
  header.className = 'flex items-center justify-between py-4';
  
  const title = document.createElement('h1');
  title.className = 'text-3xl font-semibold text-black';
  title.textContent = '分组结果';
  
  const closeBtn = document.createElement('button');
  closeBtn.className = 'text-2xl text-gray-600 hover:text-black transition-colors';
  closeBtn.innerHTML = '<i class="fas fa-times"></i>';
  closeBtn.onclick = hideResult;
  
  header.appendChild(title);
  header.appendChild(closeBtn);

  // 统计信息
  const stats = document.createElement('div');
  stats.className = 'bg-gray-50 rounded-xl p-8';
  
  const statsContent = document.createElement('div');
  statsContent.className = 'flex items-center space-x-12';
  
  const statItems = [
    { label: '任务类型', value: selectedAction },
    { label: '科目', value: selectedSubject },
    { label: '参与人数', value: `${selectedNames.length}人` }
  ];
  
  statItems.forEach(item => {
    const statDiv = document.createElement('div');
    statDiv.className = 'text-gray-600';
    
    const label = document.createElement('div');
    label.className = 'text-sm mb-2';
    label.textContent = item.label;
    
    const value = document.createElement('div');
    value.className = 'text-3xl font-semibold';
    value.textContent = item.value;
    
    statDiv.appendChild(label);
    statDiv.appendChild(value);
    statsContent.appendChild(statDiv);
  });
  
  stats.appendChild(statsContent);

  // 导出按钮
  const exportBtn = document.createElement('div');
  exportBtn.className = 'flex items-center space-x-4';
  
  const exportBtnInner = document.createElement('button');
  exportBtnInner.className = 'flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors';
  exportBtnInner.innerHTML = '<i class="fas fa-file-text mr-2"></i>导出文本文件';
  exportBtnInner.onclick = () => exportAsTxt(selectedAction, selectedNames, selectedSubject);
  
  exportBtn.appendChild(exportBtnInner);

  // 结果列表
  const resultGrid = document.createElement('div');
  resultGrid.className = 'grid gap-4';
  resultGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(280px, 1fr))';
  
  // 预先创建所有卡片但初始设置为不可见
  selectedNames.forEach(name => {
    const card = document.createElement('div');
    card.className = 'bg-gray-50 rounded-xl p-6';
    card.style.opacity = '0';  // 初始不可见
    card.style.transform = 'translateY(20px)';  // 初始位置偏移
    
    const nameDiv = document.createElement('div');
    nameDiv.className = 'text-2xl font-medium mb-3';  // 增大名字大小
    nameDiv.textContent = name;
    
    const infoDiv = document.createElement('div');
    infoDiv.className = 'text-gray-600 flex items-center text-sm';  // 增大任务信息大小
    infoDiv.innerHTML = `
      <i class="fas fa-arrow-right mr-3"></i>
      <span>${selectedSubject} - ${selectedAction}</span>
    `;
    
    card.appendChild(nameDiv);
    card.appendChild(infoDiv);
    resultGrid.appendChild(card);
  });

  // 组装页面
  container.appendChild(header);
  container.appendChild(stats);
  container.appendChild(exportBtn);
  container.appendChild(resultGrid);
  resultPage.appendChild(container);
  document.body.appendChild(resultPage);

  // GSAP动画序列
  gsap.context(() => {
    const tl = gsap.timeline();
    
    // 整体容器淡入
    tl.to(resultPage, {
      opacity: 1,
      duration: 0.3,
      ease: 'power2.out'
    });

    // 标题
    tl.from(header, {
      y: -30,
      opacity: 0,
      duration: 0.5,
      ease: 'back.out(1.7)'
    });

    // 统计信息
    tl.from(stats, {
      scale: 0.95,
      opacity: 0,
      duration: 0.5,
      ease: 'power2.out'
    });

    // 统计数字
    tl.from(statsContent.querySelectorAll('.text-3xl'), {
      y: 20,
      opacity: 0,
      duration: 0.4,
      stagger: 0.1,
      ease: 'power2.out'
    }, "-=0.2");

    // 导出按钮
    tl.from(exportBtn, {
      y: 20,
      opacity: 0,
      duration: 0.4,
      ease: 'power2.out'
    }, "-=0.2");

    // 结果卡片逐个显示
    tl.to(resultGrid.children, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      stagger: {
        amount: 0.8,  // 控制整体动画持续时间
        grid: [4, 3], // 网格布局
        from: 'start',
        ease: 'power2.out'
      }
    }, "-=0.2");
  });
}

// 优化隐藏结果的动画效果
function hideResult() {
  const resultPage = document.querySelector('.min-h-screen');
  const cards = document.querySelectorAll('.result-card');
  const header = document.querySelector('.flex.items-center.justify-between');
  const stats = document.querySelector('.bg-gray-50.rounded-xl');
  const exportBtn = document.querySelector('.flex.items-center.space-x-4');

  gsap.context(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        setTimeout(() => {
          location.reload();
        }, 100);
      }
    });

    // 首先是卡片消失
    tl.to(cards, {
      y: 30,
      opacity: 0,
      duration: 0.4,
      stagger: {
        amount: 0.5,
        grid: 'auto',
        from: 'end',
        ease: 'power2.in'
      }
    });

    // 其他元素消失
    tl.to([exportBtn, stats, header], {
      y: -20,
      opacity: 0,
      duration: 0.3,
      stagger: 0.1,
      ease: 'power2.in'
    }, "-=0.2");

    // 最后整个页面淡出
    tl.to(resultPage, {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in'
    });
  });
}

// 修改导出文本功能
function exportAsTxt(action, names, subject) {
  const content = `任务分配清单\n
科目：${subject}
任务类型：${action}
参与人数：${names.length}人
------------------------
分配详情：
${names.map(name => `${name} - ${subject} - ${action}`).join('\n')}
------------------------
导出时间：${new Date().toLocaleString()}
`;

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `任务分配清单_${new Date().toLocaleDateString()}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// 添加清除全部功能
function clearAll() {
  const checkboxes = document.querySelectorAll('.checkbox-custom');
  checkboxes.forEach(checkbox => {
    checkbox.checked = false;
  });
  updateSelectedCount();
}

// 添加随机选择功能
function selectRandom() {
  // 获取输入的数量
  const count = parseInt(document.getElementById('randomCount').value);
  const maxCount = names.length;
  
  if (!count || count < 1 || count > maxCount) {
    alert(`请输入1-${maxCount}之间的数字`);
    return;
  }

  // 先清除所有选中
  clearAll();
  
  // 随机选择指定数量
  const indexes = Array.from({length: maxCount}, (_, i) => i);
  const selectedIndexes = shuffle([...indexes]).slice(0, count);
  
  selectedIndexes.forEach(index => {
    const checkbox = document.getElementById(`person_${index}`);
    if (checkbox) {
      checkbox.checked = true;
    }
  });
  
  updateSelectedCount();
}

// 修改清除功能
function clearAllSelections() {
  // 清除所有选择
  const checkboxes = document.querySelectorAll('.checkbox-custom');
  checkboxes.forEach(checkbox => {
    checkbox.checked = false;
  });
  
  const actions = document.querySelectorAll('input[name="action"]');
  actions.forEach(radio => {
    radio.checked = false;
  });
  
  const subjects = document.querySelectorAll('input[name="subject"]');
  subjects.forEach(radio => {
    radio.checked = false;
  });
  
  updateSelectedCount();
  sessionStorage.removeItem('lastSelections');
}

// 修改清除全部按钮的逻辑
let clearConfirmTimeout;
const fixedClearBtn = document.getElementById('clearAllBtn'); // 改名以区分

fixedClearBtn.addEventListener('click', function(e) {
  e.stopPropagation(); // 防止事件冒泡
  
  if (this.classList.contains('confirm')) {
    // 确认清除
    clearAllSelections();
    resetClearButton();
  } else {
    // 首次点击，显示确认状态
    this.classList.add('confirm');
    this.innerHTML = '<i class="fas fa-check"></i>';
    
    // 5秒后重置按钮状态
    clearTimeout(clearConfirmTimeout);
    clearConfirmTimeout = setTimeout(resetClearButton, 5000);
  }
});

// 重置清除按钮状态
function resetClearButton() {
  clearTimeout(clearConfirmTimeout);
  const btn = document.getElementById('clearAllBtn');
  if (btn) {
    btn.classList.remove('confirm');
    btn.innerHTML = '<i class="fas fa-trash-alt"></i>';
  }
}

// 为选择人员卡片中的清除全部按钮添加单独的处理函数
function handleCardClear() {
  const checkboxes = document.querySelectorAll('.checkbox-custom');
  checkboxes.forEach(checkbox => {
    checkbox.checked = false;
  });
  updateSelectedCount();
}

// 添加ESC键监听
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && document.querySelector('.min-h-screen')) {
    hideResult();
  }
});
