import anime from 'animejs';

export function createCheckbox(line) {
    const container = document.createElement('div');
    container.className = 'checkbox-btn';
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = line;
    checkbox.name = line;
    const label = document.createElement('label');
    label.htmlFor = line;
    label.appendChild(document.createTextNode(line));
    container.appendChild(checkbox);
    container.appendChild(label);
    
    container.addEventListener('click', (e) => {
        checkbox.checked = !checkbox.checked;
        container.classList.toggle('checked', checkbox.checked);
        
        // 添加点击动画
        container.classList.add('animate-click');
        anime({
            targets: container,
            scale: [1, 0.95, 1],
            duration: 300,
            easing: 'easeInOutQuad'
        });
        
        // 移除动画类
        setTimeout(() => {
            container.classList.remove('animate-click');
        }, 300);
    });
    
    return container;
}

export function displayData(lines, elementId) {
    const container = document.getElementById(elementId);
    container.innerHTML = '';
    
    // 添加特定的容器类
    if (elementId === 'actions') {
        container.classList.add('actions-container');
    } else if (elementId === 'subjects') {
        container.classList.add('subjects-container');
    } else if (elementId === 'namelist') {
        container.classList.add('namelist-container');
    }
    
    lines.forEach(line => {
        if (line.trim()) {  // 只处理非空行
            const checkbox = createCheckbox(line);
            container.appendChild(checkbox);
        }
    });
}
