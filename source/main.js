// 通用的文件加载函数
async function loadTextFile(filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return (await response.text()).split('\n').filter(line => line.trim());
    } catch (error) {
        console.error(`加载文件 ${filePath} 失败:`, error);
        throw error;
    }
}

// 通用的按钮创建函数
function createButton(config) {
    const { id, value, name, type = 'checkbox' } = config;
    const label = document.createElement("label");
    label.className = "label cursor-pointer justify-start gap-2";

    const input = document.createElement("input");
    input.type = type;
    input.className = "hidden";
    input.id = id;
    input.value = value;
    input.name = name;

    const button = document.createElement("div");
    button.className = "btn btn-outline btn-sm w-full";
    button.textContent = value;

    // 统一的点击事件处理
    button.addEventListener('click', () => {
        if (type === 'radio') {
            // 单选逻辑
            document.querySelectorAll(`input[name="${name}"]`).forEach(radio => {
                radio.parentElement.querySelector('div').classList.remove('btn-active');
            });
            input.checked = true;
        } else {
            // 多选逻辑
            input.checked = !input.checked;
        }
        button.classList.toggle('btn-active');
    });

    return Object.assign(label, {
        appendChild: label.appendChild.bind(label),
        elements: [input, button].forEach(el => label.appendChild(el))
    });
}

// 批量创建按钮并添加到容器
function createButtons(items, containerSelector, type, name) {
    const container = document.getElementById(containerSelector);
    items.forEach((item, index) => {
        container.appendChild(
            createButton({
                id: `${name}-${index}`,
                value: item,
                name: name,
                type: type
            })
        );
    });
}

// 生成结果界面
function showResults(selectedNames, selectedSubject, selectedTask) {
    document.body.innerHTML = `
        <div class="container mx-auto p-4">
            <h2 class="text-2xl font-bold mb-4">生成结果:</h2>
            <div id="results" class="space-y-2"></div>
            <button onclick="location.reload()" class="btn btn-primary mt-8 w-full">返回</button>
        </div>
    `;

    const resultsDiv = document.getElementById("results");
    selectedNames.forEach(name => {
        resultsDiv.appendChild(Object.assign(document.createElement("div"), {
            className: "card bg-base-200 p-4",
            textContent: `${name} 需要 ${selectedSubject}${selectedTask}`
        }));
    });
}

// 初始化UI
function initUI() {
    const loadingMsg = Object.assign(document.createElement('div'), {
        id: 'loading-message',
        textContent: '正在加载数据...'
    });
    document.body.insertBefore(loadingMsg, document.body.firstChild);

    Promise.all([
        loadTextFile('./source/data/namelist.txt'),
        loadTextFile('./source/data/actions.txt'),
        loadTextFile('./source/data/subjects.txt')
    ]).then(([names, tasks, subjects]) => {
        loadingMsg.remove();
        
        // 批量创建按钮
        createButtons(names, "checkbox-area", "checkbox", "student");
        createButtons(subjects, "subject-area", "radio", "subject");
        createButtons(tasks, "radio-area", "radio", "task");

        // 处理生成按钮点击事件
        document.getElementById("generate-btn").addEventListener("click", () => {
            const selectedNames = Array.from(document.querySelectorAll('input[name="student"]:checked')).map(input => input.value);
            const selectedSubject = document.querySelector('input[name="subject"]:checked')?.value;
            const selectedTask = document.querySelector('input[name="task"]:checked')?.value;

            if (!selectedNames.length || !selectedTask || !selectedSubject) {
                alert("请至少选择一个人名、一个任务和一个科目！");
                return;
            }

            showResults(selectedNames, selectedSubject, selectedTask);
        });
    }).catch(error => {
        console.error('加载数据失败:', error);
        loadingMsg.textContent = '加载数据失败，请确保数据文件存在且路径正确！';
        loadingMsg.style.color = 'red';
    });
}

document.addEventListener('DOMContentLoaded', initUI);
