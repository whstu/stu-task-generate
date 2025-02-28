import 'tailwindcss/tailwind.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import { fetchData } from './data.js'
import { displayData } from './ui.js'
import anime from 'animejs'

document.addEventListener('DOMContentLoaded', () => {
    fetchData('subjects.txt').then(lines => displayData(lines, 'subjects'));
    fetchData('namelist.txt').then(lines => displayData(lines, 'namelist'));
    fetchData('actions.txt').then(lines => displayData(lines, 'actions'));
});
