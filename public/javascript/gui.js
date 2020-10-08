let category = 'suicide';
let subcategory = 'Suicide rate (per 100,000 population)';

const toggle_sidebar = () => {
    let sidebar = document.querySelector('#sidebar');

    if (sidebar.classList.contains('side-hidden')) {
        sidebar.classList.remove('side-hidden');
        sidebar.classList.add('side-active');
    } else {
        sidebar.classList.remove('side-active');
        sidebar.classList.add('side-hidden');
    }
}

document.querySelector('#open-arrow').addEventListener('click', toggle_sidebar);

document.querySelector('#reset').addEventListener('click', resetView)

const alert_html = alert => {
    return `
    <div class="alert alert-danger alert-dismissible fade show col-md-6 offset-md-3" role="alert">
        <div><i class="fas fa-exclamation-triangle mr-3 ml-2r" style="font-size: 15pt;"></i>
        <span id='warn-info'>${alert}</span></div>
        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
    </div>
`
}

const show_alert = alert => {
    document.querySelector('#alerts').innerHTML = alert_html(alert);
}

let category_select = document.querySelector('#category');

const prepare_categories_options = () => {
    for (let category in queries) {
        const category_value = category;
        const category_name = queries[category].name;
        category_select.innerHTML += `<option value="${category_value}">${category_name}</option>`;
    }
    prepare_subcategories_options()
}

prepare_categories_options()

function prepare_subcategories_options() {
    let subcategory_select = document.querySelector('#subcategory');
    subcategory_select.innerHTML = "";
    let subcategories;
    category = this.value || 'suicide';
    choose_subcategory()

    subcategories = queries[category]['subcategories'];

    for (let subcategory of subcategories) {
        if (subcategory.displayName) {
            subcategory_select.innerHTML += `<option value="${subcategory.name}">${subcategory.displayName}</option>`;
        } else {
            subcategory_select.innerHTML += `<option value="${subcategory.name}">${subcategory.name}</option>`;
        }
    }
}

function choose_subcategory() {
    subcategory = this.value || queries[category]['subcategories'][0]['name']
}

const search_code = (category, subcategory) => {
    for (let sub of queries[category]['subcategories']) {
        if (sub.name === subcategory) {
            console.log(sub.code)
            return sub.code
        }
    }
}

category_select.addEventListener('change', prepare_subcategories_options);
document.querySelector('#subcategory').addEventListener('change', choose_subcategory)

document.querySelector('#search').addEventListener('click', () => {
    const active_sub_code = search_code(category, subcategory);
    const data_to_url = {
        'iso': iso_code,
        'code': active_sub_code
    }
    console.log(data_to_url)
    get_data(data_to_url.code, data_to_url.iso)
        .then(response => console.log(response))
        .catch(err => console.log(err))
})