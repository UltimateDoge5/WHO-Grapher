let category = 'suicide';
let subcategory = 'Suicide rate (per 100,000 population)';

// enable tooltips

$(function () {
    $('[data-toggle="tooltip"]').tooltip()
})

// enable selects

function enabled_categories() {
    document.querySelector('#selected-country').innerHTML = country;
    document.querySelector('#category').disabled = false;
    document.querySelector('#subcategory').disabled = false;
    document.querySelector('#search').disabled = false;
}

// on/off sidebar

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

const alert_html = (alert, type) => {
    return `
    <div class="alert alert-${type} alert-dismissible fade show col-md-6 offset-md-3" role="alert">
        <div><i class="fas fa-exclamation-triangle mr-3 ml-2r" style="font-size: 15pt;"></i>
        <span id='warn-info'>${alert}</span></div>
        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
    </div>
`
}

// show alert

const show_alert = (alert, type) => {
    document.querySelector('#alerts').innerHTML = alert_html(alert, type);
}


let category_select = document.querySelector('#category');

// create options in category select

const prepare_categories_options = () => {
    for (let category in categories) {
        const category_value = category;
        const category_name = categories[category].name;
        category_select.innerHTML += `<option value="${category_value}">${category_name}</option>`;
    }
    prepare_subcategories_options()
}

prepare_categories_options()

// create options in subcategory select

function prepare_subcategories_options() {
    let subcategory_select = document.querySelector('#subcategory');
    subcategory_select.innerHTML = "";
    let subcategories;
    category = this.value || 'suicide'; 
    choose_subcategory()

    subcategories = categories[category]['subcategories'];

    for (let subcategory of subcategories) {
        if (subcategory.displayName) {
            subcategory_select.innerHTML += `<option value="${subcategory.name}">${subcategory.displayName}</option>`;
        } else {
            subcategory_select.innerHTML += `<option value="${subcategory.name}">${subcategory.name}</option>`;
        }
    }
}

function choose_subcategory() {
    subcategory = this.value || categories[category]['subcategories'][0]['name']
}

// search code for api url

const search_code = (category, subcategory) => {
    for (let sub of categories[category]['subcategories']) {
        if (sub.name === subcategory) {
            console.log(sub.code)
            return sub.code
        }
    }
}

const update_modal_header = () => {
    document.querySelector('.modal-title').innerHTML = `<b>Country:</b> ${country}, <b>Category:</b> ${category}, <b>Subcategory:</b> ${subcategory}`;
}

category_select.addEventListener('change', prepare_subcategories_options);
document.querySelector('#subcategory').addEventListener('change', choose_subcategory)

document.querySelector('#search').addEventListener('click', () => {
    const active_sub_code = search_code(category, subcategory);
    const data_to_url = {'iso': iso_code,'code': active_sub_code}
    update_modal_header();

    console.log(data_to_url)
    getData(`/api/${data_to_url.code}?country=${data_to_url.iso}`)
        .then(response => {
            isFetch = false;
            renderChart(response, country);
            console.log(response)
        })
        .catch(err => console.log(err))
})