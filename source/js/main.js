document.addEventListener('DOMContentLoaded', () => {
    fetchData('subjects.txt').then(lines => displayData(lines, 'subjects'));
    fetchData('namelist.txt').then(lines => displayData(lines, 'namelist'));
    fetchData('actions.txt').then(lines => displayData(lines, 'actions'));
});
