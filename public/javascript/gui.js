const toggleSidebar = () => {
    let sidebar = document.querySelector('#sidebar');

    if (sidebar.classList.contains('side-hide')) {
        sidebar.classList.remove('side-hide');
        sidebar.classList.add('side-active');
    } else {
        sidebar.classList.remove('side-active');
        sidebar.classList.add('side-hide');
    }
}

document.querySelector('#open-arrow').addEventListener('click', toggleSidebar);

document.querySelector('#reset').addEventListener('click', resetView);