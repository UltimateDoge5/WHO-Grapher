<<<<<<< Updated upstream
const toggleSidebar = () => {
    let sidebar = document.querySelector('#sidebar');
=======
let category = "suicide";
let subcategory = "Suicide rate (per 100,000 population)";
const max_z_index = "3001";
>>>>>>> Stashed changes

    if (sidebar.classList.contains('side-hide')) {
        sidebar.classList.remove('side-hide');
        sidebar.classList.add('side-active');
    } else {
        sidebar.classList.remove('side-active');
        sidebar.classList.add('side-hide');
    }
}

<<<<<<< Updated upstream
document.querySelector('#open-arrow').addEventListener('click', toggleSidebar);
=======
document.querySelector("#open-arrow").addEventListener("click", toggle_sidebar);


// ALERTS
const alert_html = (alert, type) => {
    return `
    <div class="alert alert-${type} alert-dismissible fade show col-md-6 offset-md-3" role="alert">
        <div><i class="fas fa-exclamation-triangle mr-3 ml-2r" style="font-size: 15pt;"></i>
        <span id="warn-info">${alert}</span></div>
        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
    </div>
`
}

// show alert
const show_alert = (alert, type) => {
    document.querySelector("#alerts").innerHTML = alert_html(alert, type);
}

// CATEGORY & SUBCATEGORIES

let category_select = document.querySelector("#category");

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
    let subcategory_select = document.querySelector("#subcategory");
    subcategory_select.innerHTML = "";
    let subcategories;
    category = this.value || "suicide";
    choose_subcategory()

    subcategories = categories[category]["subcategories"];

    for (let subcategory of subcategories) {
        if (subcategory.displayName) {
            subcategory_select.innerHTML += `<option value="${subcategory.name}">${subcategory.displayName}</option>`;
        } else {
            subcategory_select.innerHTML += `<option value="${subcategory.name}">${subcategory.name}</option>`;
        }
    }
}

function choose_subcategory() {
    subcategory = this.value || categories[category]["subcategories"][0]["name"]
}

// MODES

const items_mode = document.querySelectorAll(".mode");

function change_mode() {
    mode = this.value;

    items_mode.forEach(item => {
        item.classList.remove("active-mode");
    })

    this.classList.add("active-mode")

    if(mode == "multi") {
        btn_add_country.style.visibility = "visible";
        document.querySelector("#selected-countries").style.display = "block";
        resetView();
    }
    else if(mode == "single"){
        btn_add_country.style.visibility = "hidden";
        document.querySelector("#selected-countries").style.display = "none";
        resetView();
    }
}

items_mode.forEach(item => {
    item.addEventListener("click", change_mode);
})


// MULTI MODE

const btn_add_country = document.querySelector("#add");

const list_item = name => {
    return `
        <li class="selected-countries__item" data-name="${name}">${name}
        <span class="remove"><i class="fas fa-times"></i></span></li>
    `;
}

const update_country_list = () => {
    const list = document.querySelector(".selected-countries__list");
    const latest_country = countries.length - 1;
    if(countries[latest_country] != undefined){
        list.innerHTML += list_item(countries[latest_country], latest_country);
        document.querySelectorAll(".remove").forEach(item => item.addEventListener('click', delete_country))
    } 
    
}

btn_add_country.addEventListener("click", () => {
    addCountry()
    update_country_list();
})


function delete_country() {
    const name = this.parentElement.dataset.name;
    document.querySelectorAll(".remove").forEach((item, index) => {
        if(item.parentElement.dataset.name == name){
            countries.splice(index, 1);
        }
    })
    this.parentElement.remove();
}


// MODAL

const update_modal_header = () => {
    const modal_title = document.querySelector(".modal-title");
    if(mode == "multi"){
        let country_list = countries.join(", ");
        modal_title.innerHTML = `<b>Country:</b> ${country_list}, <b>Category:</b> ${category}, <b>Subcategory:</b> ${subcategory}`;
        return;
    }
    modal_title.innerHTML = `<b>Country:</b> ${country}, <b>Category:</b> ${category}, <b>Subcategory:</b> ${subcategory}`;
}

const btn_fullscreen = document.querySelector(".fullscreen");

btn_fullscreen.addEventListener("click", () => {
    document.querySelector(".modal-dialog").classList.toggle("modal-dialog__fullscreen")
    document.querySelector(".modal-content").classList.toggle("modal-content__fullscreen")
})


// CHART

// search code for api url
const search_code = (category, subcategory) => {
    for (let sub of categories[category]["subcategories"]) {
        if (sub.name === subcategory) {
            return sub.code
        }
    }
}


category_select.addEventListener("change", prepare_subcategories_options);
document.querySelector("#subcategory").addEventListener("change", choose_subcategory)

document.querySelector("#search").addEventListener("click", () => {
    const active_sub_code = search_code(category, subcategory);
    update_modal_header();

    if (mode == "single") {
        fetchSingleCountry(active_sub_code)
        //point_difference()
    } else if (mode == "multi") {
        fetchMultipleCountries(active_sub_code)
    } else if (mode == "global") {
        //Global mode fetch function here
    } else {
        show_alert(`No mode named: ${mode}`, "danger")
    }
})

function change_type_chart() {
    chart.config.type = this.value;
    chart.update();
}

document.querySelector("#chart_type").addEventListener("click", change_type_chart)

// TUTORIAL MODE

let is_tutorial_mode = false;
let number_hint = 0;

// reset css styles
const reset_css = () => {
    document.querySelector(".container_toasts").style.visibility = "hidden";
    document.querySelector('.end_tutorial').style.visibility = "hidden"
    document.querySelector('.main-nav').style.zIndex = '1';
    document.querySelector('#sidebar').classList.remove('side-active');
    document.querySelector('#sidebar').classList.add('side-hidden')
    document.querySelector('.mode-nav').style.zIndex = "1";
    document.querySelector("#single").click();
    document.querySelector('.fullscreen').style.color = '';
    document.querySelector('.fullscreen').style.fontSize = '';
    close_modal()
}

// reset tutorial mode, reset variables

const reset_tutorial_mode = () => { 
    let toast = document.querySelector(".toast")
    is_tutorial_mode = false;
    
    if(number_hint){
        toast.style.gridArea = toasts[0].position;
    }
    
    number_hint = 0;
}

// turn on tutorial mode

document.querySelector("#tutorial").addEventListener("click", () => {
    is_tutorial_mode = true;
    $(".toast").toast("show")
    document.querySelector(".container_toasts").style.visibility = "visible";
    document.querySelector('.end_tutorial').style.visibility = "hidden";
    render_toast()
})

// turn off tutorial mode

document.querySelector(".exit").addEventListener("click", () => {
    reset_tutorial_mode()
    reset_css()
})

// imitating user events

const active_sidebar = () => {
    document.querySelector('#sidebar').classList.remove('side-hidden');
    document.querySelector('#sidebar').classList.add('side-active')
}

const show_modal = () => {
    document.querySelector("#search").disabled = false;
    document.querySelector("#search").click();
    document.querySelector("#search").disabled = true;
    // document.querySelector('.modal').style.zIndex = max_z_index;
}

const close_modal = () => {
    document.querySelector('.modal').style.zIndex = '1050';
    document.querySelector(".close").click()
}

const change_to_multi_mode = () => {
    document.querySelector("#multi").click();
}

const sample_country_list = country_num => {
    const sample = ["Poland", "Germany", "France"];
    countries.push(sample[country_num])
    update_country_list()
}

const clear_country_list = () => {
    countries = [];
    document.querySelector(".selected-countries__list").innerHTML = "";
}

// toast service
const next_toast = () => {
    if(number_hint === toasts.length -1){
        document.querySelector('.end_tutorial').style.visibility = "visible";
        $(".toast").toast("hide");
        clear_country_list();
        return false;
    }
    number_hint++;
    render_toast()
    console.log(number_hint)
}

const render_toast = () => {
    const active = toasts[number_hint]
    let toast = document.querySelector(".toast")
    let toast_body = document.querySelector(".toast-body");
    toast_body.innerHTML = active.text;
    console.log(number_hint)

    switch(number_hint){
        case 0: 
            return true;
            break;
        case 1:
            document.querySelector('.main-nav').style.zIndex = max_z_index;
            break;
        case 2:
            active_sidebar()
            document.querySelector('.main-nav').style.zIndex = "1";
            document.querySelector('#sidebar').style.zIndex = max_z_index;
            break;
        case 4:
            document.querySelector('#sidebar').style.zIndex = "1";
            country = "Poland";
            show_modal();
            break;
        case 5:
            document.querySelector('.fullscreen').style.color = 'rgb(66, 117, 244)';
            document.querySelector('.fullscreen').style.fontSize = '2rem';
            break;
        case 6:
            document.querySelector('.fullscreen').style.color = '';
            document.querySelector('.fullscreen').style.fontSize = '';
            document.querySelector('.mode-nav').style.zIndex = max_z_index;
            close_modal();
            break;
        case 7:
            change_to_multi_mode();
            document.querySelector('.mode-nav').style.zIndex = "1";
            document.querySelector('.main-nav').style.zIndex = max_z_index;
            break;
        case 8:
            document.querySelector('.main-nav').style.zIndex = "1";
            document.querySelector('#sidebar').style.zIndex = max_z_index;
            sample_country_list(0); sample_country_list(1); sample_country_list(2);
            break;
    }

    toast.style.gridArea = active.position;
}
>>>>>>> Stashed changes

document.querySelector('#reset').addEventListener('click', resetView);