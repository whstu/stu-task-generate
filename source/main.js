// 从文件读取数据的函数
async function loadTextFile(filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text();
        return text.split('\n').filter(line => line.trim());
    } catch (error) {
        console.error(`加载文件 ${filePath} 失败:`, error);
        throw error;
    }
}

// 初始化UI
function initUI() {
    // 显示加载状态
    const loadingMsg = document.createElement('div');
    loadingMsg.id = 'loading-message';
    loadingMsg.textContent = '正在加载数据...';
    document.body.insertBefore(loadingMsg, document.body.firstChild);

    // 加载所有数据
    Promise.all([
        loadTextFile('./source/data/namelist.txt'),
        loadTextFile('./source/data/actions.txt'),
        loadTextFile('./source/data/subjects.txt')
    ]).then(([names, tasks, subjects]) => {
        // 移除加载消息
        document.getElementById('loading-message').remove();
        
        // 获取对应的容器
        const checkboxArea = document.getElementById("checkbox-area");
        const radioArea = document.getElementById("radio-area");
        const subjectArea = document.getElementById("subject-area");
        const generateBtn = document.getElementById("generate-btn");

        // 生成人名复选框
        names.forEach((name, index) => {
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.id = `name-${index}`;
            checkbox.value = name;
            checkbox.name = "student";

            const label = document.createElement("label");
            label.htmlFor = `name-${index}`;
            label.textContent = name;

            checkboxArea.appendChild(checkbox);
            checkboxArea.appendChild(label);
            checkboxArea.appendChild(document.createElement("br"));
        });

        // 生成任务单选框
        tasks.forEach((task, index) => {
            const radio = document.createElement("input");
            radio.type = "radio";
            radio.id = `task-${index}`;
            radio.value = task;
            radio.name = "task";

            const label = document.createElement("label");
            label.htmlFor = `task-${index}`;
            label.textContent = task;

            radioArea.appendChild(radio);
            radioArea.appendChild(label);
            radioArea.appendChild(document.createElement("br"));
        });

        // 生成科目单选框
        subjects.forEach((subject, index) => {
            const radio = document.createElement("input");
            radio.type = "radio";
            radio.id = `subject-${index}`;
            radio.value = subject;
            radio.name = "subject";

            const label = document.createElement("label");
            label.htmlFor = `subject-${index}`;
            label.textContent = subject;

            subjectArea.appendChild(radio);
            subjectArea.appendChild(label);
            subjectArea.appendChild(document.createElement("br"));
        });

        // 生成按钮点击事件
        generateBtn.addEventListener("click", () => {
            const selectedNames = Array.from(
                document.querySelectorAll('input[name="student"]:checked')
            ).map((input) => input.value);

            const selectedTaskInput = document.querySelector('input[name="task"]:checked');
            const selectedTask = selectedTaskInput ? selectedTaskInput.value : "";

            const selectedSubjectInput = document.querySelector('input[name="subject"]:checked');
            const selectedSubject = selectedSubjectInput ? selectedSubjectInput.value : "";

            if (selectedNames.length === 0 || !selectedTask || !selectedSubject) {
                alert("请至少选择一个人名、一个任务和一个科目！");
                return;
            }

            document.body.innerHTML = "";
            const resultTitle = document.createElement("h2");
            resultTitle.textContent = "生成结果:";
            document.body.appendChild(resultTitle);

            selectedNames.forEach((name) => {
                const para = document.createElement("p");
                para.textContent = `${name} 需要 ${selectedSubject}${selectedTask}`;
                document.body.appendChild(para);
            });
        });
    }).catch(error => {
        console.error('加载数据失败:', error);
        const loadingMsg = document.getElementById('loading-message');
        if (loadingMsg) {
            loadingMsg.textContent = '加载数据失败，请确保数据文件存在且路径正确！';
            loadingMsg.style.color = 'red';
        }
    });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initUI);
