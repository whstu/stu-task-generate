let names = [];

// 从txt文件加载人名
async function loadNames() {
  try {
    const response = await fetch('namelist.txt');
    const text = await response.text();
    names = text.split('\n')
      .map(name => name.trim())
      .filter(name => name.length > 0);
    generateCheckboxes();
  } catch (error) {
    console.error('加载人名列表失败:', error);
    alert('加载人名列表失败');
  }
}

// 操作数组
const actions = ["找老师", "听写改错", "做练习", "讨论问题"];

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
      <button onclick="clearAll()" class="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors">
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
}

// 修改页面加载事件
document.addEventListener('DOMContentLoaded', function() {
  loadNames();
  generateRadios();
});

// 生成按钮点击事件处理
document.getElementById('generateButton').addEventListener('click', function() {
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

  if (selectedNames.length === 0 || !selectedAction) {
    alert('请选择至少一个人名和一个操作');
    return;
  }

  showResultModal(selectedNames, selectedAction);
});

// 修改显示结果模态框函数
function showResultModal(selectedNames, selectedAction) {
  document.body.innerHTML = '';
  
  const resultPage = document.createElement('div');
  resultPage.className = 'min-h-screen bg-white p-6 animate__animated animate__fadeIn';
  
  const container = document.createElement('div');
  container.className = 'max-w-7xl mx-auto space-y-8';

  // 1. 标题栏
  const header = document.createElement('div');
  header.className = 'flex items-center justify-between py-4 animate__animated animate__fadeInDown animate__faster';
  header.innerHTML = `
    <h1 class="text-3xl font-semibold text-black">分组结果</h1>
    <button class="flex items-center text-gray-600 hover:text-black transition-colors" onclick="location.reload()">
      <i class="fas fa-arrow-left mr-2"></i>返回重新分组
    </button>
  `;

  // 2. 统计信息
  const stats = document.createElement('div');
  stats.className = 'bg-gray-50 rounded-xl p-6 animate__animated animate__fadeInUp';
  stats.innerHTML = `
    <div class="flex items-center space-x-8">
      <div class="text-gray-600">
        <div class="text-sm mb-1">任务类型</div>
        <div class="text-2xl font-semibold">${selectedAction}</div>
      </div>
      <div class="text-gray-600">
        <div class="text-sm mb-1">参与人数</div>
        <div class="text-2xl font-semibold">${selectedNames.length}人</div>
      </div>
    </div>
  `;

  // 3. 导出按钮
  const exportBtn = document.createElement('div');
  exportBtn.className = 'flex items-center space-x-4 animate__animated animate__fadeInUp';
  exportBtn.innerHTML = `
    <button class="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors" 
      onclick="exportAsTxt('${selectedAction}', ${JSON.stringify(selectedNames).replace(/"/g, '&quot;')})">
      <i class="fas fa-file-text mr-2"></i>导出文本文件
    </button>
  `;

  // 4. 结果列表
  const resultGrid = document.createElement('div');
  resultGrid.className = 'grid gap-4 animate__animated animate__fadeInUp';
  resultGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(250px, 1fr))';
  
  selectedNames.forEach(name => {
    resultGrid.innerHTML += `
      <div class="bg-gray-50 rounded-xl p-6">
        <div class="text-lg font-medium text-gray-700 mb-2">${name}</div>
        <div class="text-gray-500 flex items-center">
          <i class="fas fa-arrow-right mr-2"></i>${selectedAction}
        </div>
      </div>
    `;
  });

  // 组装页面
  container.appendChild(header);
  container.appendChild(stats);
  container.appendChild(exportBtn);
  container.appendChild(resultGrid);
  resultPage.appendChild(container);
  document.body.appendChild(resultPage);
}

// 添加导出文本功能
function exportAsTxt(action, names) {
  const content = `任务分配清单\n
任务类型：${action}
参与人数：${names.length}人
------------------------
分配详情：
${names.map(name => `${name} - ${action}`).join('\n')}
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
