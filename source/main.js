// 定义人名数组和任务数组
const names = ["张三", "李四", "王五"]; // 可按需扩展
const tasks = ["找老师", "听写改错", "其他任务"]; // 可按需扩展

// 获取对应的容器
const checkboxArea = document.getElementById("checkbox-area");
const radioArea = document.getElementById("radio-area");
const generateBtn = document.getElementById("generate-btn");

// 生成人名复选框
names.forEach((name, index) => {
  // 创建复选框输入
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.id = `name-${index}`;
  checkbox.value = name;
  checkbox.name = "student";

  // 创建对应的标签
  const label = document.createElement("label");
  label.htmlFor = `name-${index}`;
  label.textContent = name;

  // 添加到复选框区域
  checkboxArea.appendChild(checkbox);
  checkboxArea.appendChild(label);
  checkboxArea.appendChild(document.createElement("br"));
});

// 生成任务单选框
tasks.forEach((task, index) => {
  // 创建单选框输入
  const radio = document.createElement("input");
  radio.type = "radio";
  radio.id = `task-${index}`;
  radio.value = task;
  radio.name = "task";

  // 创建对应的标签
  const label = document.createElement("label");
  label.htmlFor = `task-${index}`;
  label.textContent = task;

  // 添加到单选框区域
  radioArea.appendChild(radio);
  radioArea.appendChild(label);
  radioArea.appendChild(document.createElement("br"));
});

// 生成按钮点击事件
generateBtn.addEventListener("click", () => {
  // 获取选中的人名
  const selectedNames = Array.from(
    document.querySelectorAll('input[name="student"]:checked')
  ).map((input) => input.value);
  // 获取选中的任务
  const selectedTaskInput = document.querySelector(
    'input[name="task"]:checked'
  );
  const selectedTask = selectedTaskInput ? selectedTaskInput.value : "";

  // 如果未选择人名或任务则提示
  if (selectedNames.length === 0 || !selectedTask) {
    alert("请至少选择一个人名和一个任务！");
    return;
  }

  // 清空页面，并生成结果展示区域
  document.body.innerHTML = "";
  const resultTitle = document.createElement("h2");
  resultTitle.textContent = "生成结果:";
  document.body.appendChild(resultTitle);

  // 展示每位选中人名和任务
  selectedNames.forEach((name) => {
    const para = document.createElement("p");
    para.textContent = `${name} 需要 ${selectedTask}`;
    document.body.appendChild(para);
  });
});
